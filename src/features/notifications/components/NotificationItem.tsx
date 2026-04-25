import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import ProfileAvatar from '@/features/profile/components/ProfileAvatar';
import { type AppNotification } from '../types';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useTeamStore } from '@/features/teams/store/useTeamStore';
import { MemberRole } from '@/features/teams/types';

interface NotificationItemProps {
  notification: AppNotification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { id: currentUserId, users: registeredUsers, updateUserNotifications, updateUserMyTeams, updateUserJoinRequests } = useAuthStore();

  const { teams, addMember } = useTeamStore();

  const currentUser = registeredUsers.find(u => u.id === currentUserId);
  const notifications = currentUser?.notifications || [];

  const markAsRead = (id: string) => {
    if (!currentUserId) return;
    const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    updateUserNotifications(currentUserId, updated);
  };

  const removeNotification = (id: string) => {
    if (!currentUserId) return;
    const updated = notifications.filter(n => n.id !== id);
    updateUserNotifications(currentUserId, updated);
  };

  const handleAccept = () => {
    const isInvitation = notification.type === 'InvitationReceived';
    const joiningUserId = isInvitation ? currentUserId : notification.sender?.id;
    const approvingUserId = isInvitation ? notification.sender?.id : currentUserId;
    const teamId = notification.relatedEntityId;

    if (!joiningUserId || !approvingUserId || !teamId || !currentUserId) {
      removeNotification(notification.id);
      return;
    }

    const joiningUser = registeredUsers.find(u => u.id === joiningUserId);
    const approvingUser = registeredUsers.find(u => u.id === approvingUserId);

    // Crucial: Fallback to searching leader's persistent teams if not in session store
    const team = teams.find(t => t.id === teamId) || approvingUser?.myTeams?.find(t => t.id === teamId);

    if (joiningUser && approvingUser && team) {
      // 1. Update Global Team Store members
      const newMember = {
        id: `m-${Date.now()}`,
        userId: joiningUserId,
        teamId: teamId,
        role: MemberRole.Member,
        joinedAt: new Date().toISOString()
      };
      addMember(teamId, newMember);

      const updatedTeam = {
        ...team,
        members: [...team.members, newMember],
        status: (team.members.length + 1 >= team.maxMembers) ? ('Full' as const) : (team.status === 'Open' ? ('Partial' as const) : team.status)
      };

      // 2. Update Entering user's persistent MyTeams
      const joiningUserTeams = joiningUser.myTeams || [];
      const updatedJoiningUserTeams = joiningUserTeams.some(t => t.id === teamId)
        ? joiningUserTeams.map(t => t.id === teamId ? updatedTeam : t)
        : [...joiningUserTeams, updatedTeam];
      updateUserMyTeams(joiningUserId, updatedJoiningUserTeams);

      // 3. Update Approving user's (Leader) persistent MyTeams
      const approverMyTeams = (approvingUser.myTeams || []).map(t =>
        t.id === teamId ? updatedTeam : t
      );
      updateUserMyTeams(approvingUserId, approverMyTeams);

      // 4. Update join request status if it was a join request
      if (!isInvitation) {
        const requesterJoinRequests = (joiningUser.joinRequests || []).map(r =>
          r.teamId === teamId ? { ...r, status: 'Approved' as const, updatedAt: new Date().toISOString() } : r
        );
        updateUserJoinRequests(joiningUserId, requesterJoinRequests);
      }

      // 5. Notify the OTHER party
      const notifyTargetId = isInvitation ? approvingUserId : joiningUserId;
      // Fetch fresh user data for notifications
      const targetUser = registeredUsers.find(u => u.id === notifyTargetId);

      const resultNotif: AppNotification = {
        id: `notif-acc-${Date.now()}`,
        userId: notifyTargetId,
        message: isInvitation
          ? `${joiningUser.profile.firstName} accepted your invitation to join ${team.name}!`
          : `Your request to join ${team.name} has been accepted!`,
        isRead: false,
        type: isInvitation ? 'TeamMemberJoined' : 'JoinRequestAccepted',
        relatedEntityId: teamId,
        createdAt: new Date(),
        sender: {
          id: currentUserId,
          name: `${currentUser?.profile.firstName} ${currentUser?.profile.lastName}`,
          imageUrl: currentUser?.profile.profileImageUrl
        }
      };
      updateUserNotifications(notifyTargetId, [...(targetUser?.notifications || []), resultNotif]);

      toast.success(isInvitation ? `You joined ${team.name}` : `Accepted ${joiningUser.profile.firstName}'s request`);
    } else {
      toast.error("Process failed: Project data missing.");
    }

    removeNotification(notification.id);
  };

  const handleReject = () => {
    const isInvitation = notification.type === 'InvitationReceived';
    const senderId = notification.sender?.id;
    const teamId = notification.relatedEntityId;

    if (!senderId || !teamId || !currentUserId) {
      removeNotification(notification.id);
      return;
    }

    const sender = registeredUsers.find(u => u.id === senderId);
    const team = teams.find(t => t.id === teamId) || sender?.myTeams?.find(t => t.id === teamId);

    if (sender && team) {
      // 1. Update Requester's join request status if it was a join request
      if (!isInvitation) {
        const requesterJoinRequests = (sender.joinRequests || []).map(r =>
          r.teamId === teamId ? { ...r, status: 'Rejected' as const, updatedAt: new Date().toISOString() } : r
        );
        updateUserJoinRequests(senderId, requesterJoinRequests);
      }

      // 2. Notify Sender of rejection
      const rejectionNotif: AppNotification = {
        id: `notif-rej-${Date.now()}`,
        userId: senderId,
        message: isInvitation
          ? `${currentUser?.profile.firstName} declined your invitation to join ${team.name}.`
          : `Your request to join ${team.name} was declined.`,
        isRead: false,
        type: isInvitation ? 'InvitationReceived' : 'JoinRequestRejected',
        relatedEntityId: teamId,
        createdAt: new Date(),
        sender: {
          id: currentUserId,
          name: `${currentUser?.profile.firstName} ${currentUser?.profile.lastName}`,
          imageUrl: currentUser?.profile.profileImageUrl
        }
      };
      updateUserNotifications(senderId, [...(sender.notifications || []), rejectionNotif]);
      toast.info(isInvitation ? `Declined invitation` : `Declined ${sender.profile.firstName}'s request`);
    }

    removeNotification(notification.id);
  };

  const isRating = notification.type === 'RatingReceived';
  const showActionButtons =
    notification.type === 'JoinRequestReceived' ||
    notification.type === 'TaRequestReceived' ||
    notification.type === 'InvitationReceived';

  const showViewTeam =
    notification.type === 'JoinRequestAccepted' ||
    notification.type === 'TeamMemberJoined' ||
    notification.type === 'JoinRequestReceived' ||
    notification.type === 'InvitationReceived';

  const showViewProfile =
    notification.type === 'JoinRequestReceived' ||
    notification.type === 'TaRequestReceived';

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className={`w-full bg-brand-card p-4 rounded-xl border ${notification.isRead ? 'border-brand-grey/20 opacity-70' : 'border-brand-grey/50'} shadow-sm relative group transition-all overflow-hidden`}
    >
      <div className="flex gap-4">
        {/* Top Right Links */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5 z-10 font-medium">
          {showViewProfile && (
            <Link
              to={`/bridge/${notification.sender?.id || ''}`}
              onClick={() => markAsRead(notification.id)}
              className="text-[10px] md:text-xs text-brand-text-primary underline hover:opacity-70 transition-opacity whitespace-nowrap"
            >
              View Profile
            </Link>
          )}
          {showViewTeam && (
            <Link
              to={`/teams/${notification.relatedEntityId || ''}`}
              onClick={() => markAsRead(notification.id)}
              className="text-[10px] md:text-xs text-brand-text-primary underline hover:opacity-70 transition-opacity whitespace-nowrap"
            >
              View Team
            </Link>
          )}
        </div>

        {/* Avatar or Icon */}
        <div className="shrink-0 mt-1">
          {isRating ? (
            <div className="w-12 h-12 rounded-lg bg-brand-background flex items-center justify-center">
              <Star className="w-8 h-8 text-brand-yellow fill-brand-yellow drop-shadow-sm" />
            </div>
          ) : (
            <ProfileAvatar
              name={notification.sender?.name}
              imageUrl={notification.sender?.imageUrl}
              className="w-12 h-12 rounded-lg shadow-none border border-brand-grey/20"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-12 md:pr-16">
          <div className="flex flex-col justify-center min-h-[48px]">
            {isRating && <p className="text-sm font-bold text-brand-text-primary mb-1">Rating</p>}
            {!isRating && notification.type === 'JoinRequestAccepted' && (
              <p className="text-sm font-bold text-brand-text-primary mb-1">You've been accepted</p>
            )}

            <p className="text-sm text-brand-text-secondary leading-snug">
              {notification.message}
            </p>

            <p className="text-[10px] text-brand-text-secondary/60 mt-1 font-bold uppercase tracking-wider">
              {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {/* Action Buttons */}
          {showActionButtons && (
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleAccept}
                className="px-4 py-2 text-sm font-bold text-white bg-brand-green rounded-xl hover:opacity-80 transition-all focus:ring-2 focus:ring-brand-green/30 outline-none shadow-sm"
              >
                Accept
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 text-sm font-bold text-brand-text-secondary bg-brand-grey/20 rounded-xl hover:bg-brand-grey/40 transition-all focus:ring-2 focus:ring-brand-grey/30 outline-none"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

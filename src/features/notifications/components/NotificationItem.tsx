import React from 'react';
import { motion } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import ProfileAvatar from '@/features/profile/components/ProfileAvatar';
import { type AppNotification, type NotificationType } from '../types';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useTeamStore } from '@/features/teams/store/useTeamStore';
import { MemberRole } from '@/features/teams/types';

interface NotificationItemProps {
  notification: AppNotification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const {
    id: currentUserId,
    users: registeredUsers,
    updateUserNotifications,
    updateUserMyTeams,
    updateUserJoinRequests,
    acceptSupervisionRequest,
    rejectSupervisionRequest
  } = useAuthStore();

  const { teams, addMember, setTeams } = useTeamStore();

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

  const updateCurrentNotification = (type: NotificationType, newMessage: string) => {
    if (!currentUserId) return;
    const updated = notifications.map(n =>
      n.id === notification.id
        ? { ...n, type, message: newMessage, isRead: true }
        : n
    );
    updateUserNotifications(currentUserId, updated);
  };

  const handleAccept = () => {
    const isInvitation = notification.type === 'InvitationReceived';
    const isTaRequest = notification.type === 'TaRequestReceived';

    const teamId = notification.relatedEntityId;

    if (!teamId || !currentUserId) {
      removeNotification(notification.id);
      return;
    }

    // Role detection
    const joiningUserId = isInvitation ? currentUserId : notification.sender?.id;
    const joiningUser = registeredUsers.find(u => u.id === (isTaRequest ? notification.sender?.id : joiningUserId));

    const team = teams.find(t => t.id === teamId) ||
      registeredUsers.find(u => u.myTeams?.some(t => t.id === teamId))?.myTeams?.find(t => t.id === teamId);

    if (team) {
      if (isTaRequest) {
        // --- TA Acceptance Logic ---
        const supRequest = currentUser?.supervisionRequests?.find(r => r.projectId === teamId && r.status === 'pending');
        if (supRequest) {
          acceptSupervisionRequest(supRequest.id);
          toast.success(`You are now supervising ${team.name}`);
          // Note: updateCurrentNotification logic is handled inside acceptSupervisionRequest now (notification transformation)
          // But since the parent component might need a local refresh, I'll return
          return;
        }

        // Fallback for simulation/legacy (if request object missing)
        const updatedTeam = { ...team, taId: currentUserId, status: 'TaApproved' as const };
        setTeams(teams.map(t => t.id === teamId ? updatedTeam : t));

        // Sync Leader
        const leaderId = notification.sender?.id;
        if (leaderId) {
          const leader = registeredUsers.find(u => u.id === leaderId);
          if (leader) {
            updateUserMyTeams(leaderId, (leader.myTeams || []).map(t => t.id === teamId ? updatedTeam : t));
            const leaderNotif: AppNotification = {
              id: `notif-ta-acc-${Date.now()}`,
              userId: leaderId,
              message: `TA ${currentUser?.profile.firstName} has accepted to supervise your team: ${team.name}`,
              isRead: false,
              type: 'TaRequestAccepted',
              relatedEntityId: teamId,
              createdAt: new Date(),
              sender: { id: currentUserId, name: `${currentUser?.profile.firstName} ${currentUser?.profile.lastName}`, imageUrl: currentUser?.profile.profileImageUrl }
            };
            updateUserNotifications(leaderId, [...(leader.notifications || []), leaderNotif]);
          }
        }

        // Sync TA
        updateUserMyTeams(currentUserId, [...(currentUser?.myTeams || []), updatedTeam]);

        toast.success(`You are now supervising ${team.name}`);
        updateCurrentNotification('TaRequestAccepted', `You accepted to supervise "${team.name}"`);

      } else {
        // --- Member Join Logic ---
        if (!joiningUserId || !joiningUser) return;

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

        // Update Joiner
        updateUserMyTeams(joiningUserId, joiningUser.myTeams?.some(t => t.id === teamId)
          ? joiningUser.myTeams.map(t => t.id === teamId ? updatedTeam : t)
          : [...(joiningUser.myTeams || []), updatedTeam]);

        // Update Approver
        const approverId = isInvitation ? notification.sender?.id : currentUserId;
        if (approverId) {
          const approver = registeredUsers.find(u => u.id === approverId);
          const approverMyTeams = approver?.myTeams || [];
          const updatedApproverTeams = approverMyTeams.some(t => t.id === teamId)
            ? approverMyTeams.map(t => t.id === teamId ? updatedTeam : t)
            : [...approverMyTeams, updatedTeam];
          updateUserMyTeams(approverId, updatedApproverTeams);
        }

        // Update join request record
        if (!isInvitation) {
          updateUserJoinRequests(joiningUserId, (joiningUser.joinRequests || []).map(r =>
            r.teamId === teamId ? { ...r, status: 'Approved' as const, updatedAt: new Date().toISOString() } : r
          ));
        }

        // Notify reciprocal party
        const notifyTargetId = isInvitation ? notification.sender?.id : joiningUserId;
        const targetUser = registeredUsers.find(u => u.id === notifyTargetId);
        if (notifyTargetId) {
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
            sender: { id: currentUserId, name: `${currentUser?.profile.firstName} ${currentUser?.profile.lastName}`, imageUrl: currentUser?.profile.profileImageUrl }
          };
          updateUserNotifications(notifyTargetId, [...(targetUser?.notifications || []), resultNotif]);
        }

        toast.success(isInvitation ? `You joined ${team.name}` : `Accepted ${joiningUser.profile.firstName}'s request`);
        updateCurrentNotification(isInvitation ? 'InvitationAccepted' : 'JoinRequestAccepted',
          isInvitation ? `You joined "${team.name}"` : `You accepted ${joiningUser.profile.firstName} into your team.`);
      }
    } else {
      toast.error("Process failed: Team data missing.");
      removeNotification(notification.id);
    }
  };

  const handleReject = () => {
    const isInvitation = notification.type === 'InvitationReceived';
    const isTaRequest = notification.type === 'TaRequestReceived';
    const senderId = notification.sender?.id;
    const teamId = notification.relatedEntityId;

    if (!senderId || !teamId || !currentUserId) {
      removeNotification(notification.id);
      return;
    }

    const sender = registeredUsers.find(u => u.id === senderId);
    const team = teams.find(t => t.id === teamId) || (sender?.myTeams?.find(t => t.id === teamId));

    if (sender && team) {
      if (isTaRequest) {
        const supRequest = currentUser?.supervisionRequests?.find(r => r.projectId === teamId && r.status === 'pending');
        if (supRequest) {
          rejectSupervisionRequest(supRequest.id);
          toast.info(`Declined request`);
          return;
        }
      }

      if (!isInvitation && !isTaRequest) {
        updateUserJoinRequests(senderId, (sender.joinRequests || []).map(r =>
          r.teamId === teamId ? { ...r, status: 'Rejected' as const, updatedAt: new Date().toISOString() } : r
        ));
      }

      const rejectionNotif: AppNotification = {
        id: `notif-rej-${Date.now()}`,
        userId: senderId,
        message: isInvitation
          ? `${currentUser?.profile.firstName} declined your invitation to join ${team.name}.`
          : isTaRequest
            ? `TA ${currentUser?.profile.firstName} declined your supervision request for ${team.name}.`
            : `Your request to join ${team.name} was declined.`,
        isRead: false,
        type: isInvitation ? 'InvitationReceived' : isTaRequest ? 'TaRequestRejected' : 'JoinRequestRejected',
        relatedEntityId: teamId,
        createdAt: new Date(),
        sender: { id: currentUserId, name: `${currentUser?.profile.firstName} ${currentUser?.profile.lastName}`, imageUrl: currentUser?.profile.profileImageUrl }
      };
      updateUserNotifications(senderId, [...(sender.notifications || []), rejectionNotif]);

      toast.info(`Declined request`);
      updateCurrentNotification(isInvitation ? 'InvitationRejected' : isTaRequest ? 'TaRequestRejected' : 'JoinRequestRejected',
        `You declined the request regarding "${team.name}"`);
    } else {
      removeNotification(notification.id);
    }
  };

  const isRating = notification.type === 'RatingReceived';
  const showActionButtons =
    notification.type === 'JoinRequestReceived' ||
    notification.type === 'TaRequestReceived' ||
    notification.type === 'InvitationReceived';

  const showViewTeam =
    notification.type === 'JoinRequestAccepted' ||
    notification.type === 'InvitationAccepted' ||
    notification.type === 'TeamMemberJoined' ||
    notification.type === 'JoinRequestReceived' ||
    notification.type === 'InvitationReceived' ||
    notification.type === 'TaRequestReceived' ||
    notification.type === 'TaRequestAccepted' ||
    notification.type === 'TaLeftSupervision';

  const showViewProfile =
    notification.type === 'JoinRequestReceived' ||
    notification.type === 'TaRequestReceived';

  const isOutcome =
    notification.type === 'JoinRequestAccepted' ||
    notification.type === 'JoinRequestRejected' ||
    notification.type === 'InvitationAccepted' ||
    notification.type === 'InvitationRejected' ||
    notification.type === 'TaRequestAccepted' ||
    notification.type === 'TaRequestRejected';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
      className={`w-full bg-brand-card p-4 rounded-xl border ${notification.isRead ? 'border-brand-grey/20 opacity-70' : 'border-brand-grey/50'} shadow-sm relative group transition-all overflow-hidden`}
    >
      <div className="flex gap-4">
        {/* Top Right Controls */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5 z-10 font-medium">
          {!showActionButtons && (
            <button
              onClick={() => removeNotification(notification.id)}
              className="p-1 hover:bg-brand-red/10 rounded-lg transition-colors text-brand-text-secondary/40 hover:text-brand-red"
              aria-label="Remove notification"
            >
              <X size={16} />
            </button>
          )}
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

            {isOutcome && (
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${notification.type.includes('Accepted') ? 'text-brand-green' : 'text-brand-red'
                }`}>
                {notification.type.includes('Accepted') ? 'Accomplished' : 'Declined'}
              </p>
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

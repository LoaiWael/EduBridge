import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProfileAvatar from '@/features/profile/components/ProfileAvatar';
import { type AppNotification } from '../types';
import { useNotificationStore } from '../store/useNotificationStore';

interface NotificationItemProps {
  notification: AppNotification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { acceptRequest, rejectRequest, markAsRead } = useNotificationStore();

  const handleAccept = () => {
    acceptRequest(notification.id);
  };

  const handleReject = () => {
    rejectRequest(notification.id);
  };

  // UI decisions based on notification type
  const isRating = notification.type === 'RatingReceived';
  const showActionButtons =
    notification.type === 'JoinRequestReceived' ||
    notification.type === 'TaRequestReceived' ||
    notification.type === 'DoctorRequestReceived';

  const showViewTeam = notification.type === 'JoinRequestAccepted' || notification.type === 'TeamMemberJoined';
  const showViewProfile = notification.type === 'JoinRequestReceived' || notification.type === 'TaRequestReceived';

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className={`bg-brand-card p-4 rounded-xl border ${notification.isRead ? 'border-brand-grey/20 opacity-70' : 'border-brand-grey/50'} shadow-sm relative group transition-all`}
    >
      <div className="flex gap-4">
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
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {isRating && <p className="text-sm font-bold text-brand-text-primary mb-1">Rating</p>}
          {!isRating && notification.type === 'JoinRequestAccepted' && (
            <p className="text-sm font-bold text-brand-text-primary mb-1">You've been accepted</p>
          )}

          <p className="text-sm text-brand-text-secondary leading-snug line-clamp-2">
            {notification.message}
          </p>

          {/* Action Buttons underneath message */}
          {showActionButtons && (
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={handleAccept}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#5CB85C] rounded-md hover:bg-[#4cae4c] transition-colors focus:ring-2 focus:ring-[#5CB85C]/30 outline-none"
              >
                Accept
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-1.5 text-xs font-bold text-brand-text-secondary bg-[#E5E5E5] dark:bg-[#333333] rounded-md hover:bg-[#D4D4D4] dark:hover:bg-[#444444] transition-colors focus:ring-2 focus:ring-brand-grey/30 outline-none"
              >
                Reject
              </button>
            </div>
          )}
        </div>

        {/* Right Corner Interactions */}
        <div className="shrink-0 flex flex-col justify-start items-end pl-2">
          {showViewProfile && (
            <Link to={`/bridge/${notification.sender?.id || ''}`} onClick={() => markAsRead(notification.id)} className="text-xs font-bold text-brand-text-primary underline hover:opacity-70 transition-opacity">
              View Profile
            </Link>
          )}
          {showViewTeam && (
            <Link to={`/teams/${notification.relatedEntityId || ''}`} onClick={() => markAsRead(notification.id)} className="text-xs font-bold text-brand-text-primary underline hover:opacity-70 transition-opacity">
              View Team
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

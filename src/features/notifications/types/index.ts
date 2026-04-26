export type NotificationType =
  | 'JoinRequestReceived'
  | 'JoinRequestAccepted'
  | 'JoinRequestRejected'
  | 'TaRequestReceived'
  | 'TaRequestAccepted'
  | 'TaRequestRejected'
  | 'TeamMemberJoined'
  | 'InvitationReceived'
  | 'InvitationAccepted'
  | 'InvitationRejected'
  | 'RatingReceived'
  | 'TaLeftSupervision';

export interface AppNotification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  type: NotificationType;
  relatedEntityId?: string;

  // UI Specific helper fields for the mock rendering
  createdAt: Date;
  sender?: {
    id: string;
    name: string;
    imageUrl?: string;
  };
}

/**
 * User notification preferences
 */
export interface NotificationPreferences {
  userId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  marketingEmails: boolean;
  teamUpdates: boolean;
  ideaMentions: boolean;
  supervisionRequests: boolean;
}
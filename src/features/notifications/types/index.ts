/**
 * Notification types
 */
export type NotificationType = 'email' | 'push' | 'in_app'

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
import { create } from 'zustand';
import { type AppNotification, type NotificationPreferences } from '../types';

interface NotificationState {
  notifications: AppNotification[];
  setNotifications: (notifications: AppNotification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  acceptRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
  preferences: NotificationPreferences;
  updatePreferences: (updates: Partial<NotificationPreferences>) => void;
}

export const useNotificationStore = create<NotificationState>()(
  (set) => ({
    notifications: [],
    setNotifications: (notifications) => set({ notifications }),
    markAsRead: (id) =>
      set((state) => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, isRead: true } : n
        )
      })),
    markAllAsRead: () =>
      set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true }))
      })),
    acceptRequest: (id) =>
      set((state) => ({
        // Mock action: remove the request from the list after acting on it
        notifications: state.notifications.filter(n => n.id !== id)
      })),
    rejectRequest: (id) =>
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
    preferences: {
      userId: 'current-user',
      emailEnabled: true,
      pushEnabled: true,
      inAppEnabled: true,
      marketingEmails: false,
      teamUpdates: true,
      ideaMentions: true,
      supervisionRequests: true,
    },
    updatePreferences: (updates) =>
      set((state) => ({
        preferences: { ...state.preferences, ...updates }
      })),
  })
);

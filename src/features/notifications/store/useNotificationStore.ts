import { create } from 'zustand';
import { type AppNotification, type NotificationPreferences } from '../types';

interface NotificationState {
  notifications: AppNotification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  acceptRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
  preferences: NotificationPreferences;
  updatePreferences: (updates: Partial<NotificationPreferences>) => void;
}

// Helper to generate dates relative to today
const getPastDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const MOCK_NOTIFICATIONS: AppNotification[] = [
  // Today
  {
    id: '1',
    userId: 'current-user',
    message: 'Sarah Lee wants to join your project Backend API Development as a developer.',
    isRead: false,
    type: 'JoinRequestReceived',
    createdAt: getPastDate(0),
    sender: {
      id: 'user-sarah',
      name: 'Sarah Lee',
    }
  },
  {
    id: '2',
    userId: 'current-user',
    message: 'Michael Chen sent a TA supervision request for Frontend Optimization.',
    isRead: false,
    type: 'TaRequestReceived',
    createdAt: getPastDate(0),
    sender: {
      id: 'user-michael',
      name: 'Michael Chen'
    }
  },
  // Yesterday
  {
    id: '3',
    userId: 'current-user',
    message: 'Your team EduBridge achieved a 5-star rating from Dr. Ahmed.',
    isRead: true,
    type: 'RatingReceived',
    createdAt: getPastDate(1),
    sender: {
      id: 'user-ahmed',
      name: 'Dr. Ahmed',
    }
  },
  {
    id: '4',
    userId: 'current-user',
    message: "You have been accepted into the Innovators Team.",
    isRead: true,
    type: 'JoinRequestAccepted',
    createdAt: getPastDate(1),
    sender: {
      id: 'user-innovators',
      name: 'Innovators Team'
    }
  },
  // This week
  {
    id: '5',
    userId: 'current-user',
    message: 'Alex Johnson has requested to join your team.',
    isRead: true,
    type: 'JoinRequestReceived',
    createdAt: getPastDate(3),
    sender: {
      id: 'user-alex',
      name: 'Alex Johnson',
    }
  }
];

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: MOCK_NOTIFICATIONS,
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
}));

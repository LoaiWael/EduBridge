import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AppNotification } from "@/features/notifications/types";
import type { UserProfile, TaProfile } from "@/features/profile/types";
import type { Team, JoinRequest } from "@/features/teams/types";

export interface RegisteredUser {
  id: string;
  email: string;
  role: 'student' | 'ta';
  // User-specific data states - These are the source of truth
  savedIdeaIds: string[];
  teams: Team[];
  joinRequests: JoinRequest[];
  notifications: AppNotification[];
  profile: UserProfile | TaProfile;
}

interface AuthState {
  // Collection of all users registered in the browser
  users: RegisteredUser[];
  // ID of the currently logged-in user
  id: string | null;
  isAuthenticated: boolean;
  rememberMe: boolean;

  // Basic Actions
  setId: (id: string | null) => void;
  setIsAuthenticated: (arg: boolean) => void;
  setRememberMe: (arg: boolean) => void;

  // Multi-user Actions
  login: (id: string) => void;
  logout: () => void;
  register: (user: RegisteredUser) => void;

  // Data sync actions (called by other stores to persist per-user data)
  updateUserSavedIdeas: (userId: string, ideaIds: string[]) => void;
  updateUserTeams: (userId: string, teams: Team[]) => void;
  updateUserJoinRequests: (userId: string, requests: JoinRequest[]) => void;
  updateUserNotifications: (userId: string, notifications: AppNotification[]) => void;
  updateUserProfile: (userId: string, profile: UserProfile | TaProfile) => void;

  // Helper to get current user data
  getCurrentUser: () => RegisteredUser | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      id: '',
      isAuthenticated: false,
      rememberMe: false,

      setId: (id) => set({ id }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setRememberMe: (rememberMe) => set({ rememberMe }),

      login: (id: string) => {
        const userExists = get().users.find(u => u.id === id);
        if (userExists) {
          set({ id, isAuthenticated: true });
        }
      },

      logout: () => {
        set({ id: null, isAuthenticated: false, rememberMe: false });
      },

      register: (user: RegisteredUser) => {
        set((state) => ({
          users: [...state.users.filter(u => u.id !== user.id), user]
        }));
      },

      updateUserSavedIdeas: (userId, ideaIds) => {
        set((state) => ({
          users: state.users.map(u =>
            u.id === userId ? { ...u, savedIdeaIds: ideaIds } : u
          )
        }));
      },

      updateUserTeams: (userId, teams) => {
        set((state) => ({
          users: state.users.map(u =>
            u.id === userId ? { ...u, teams: teams } : u
          )
        }));
      },

      updateUserJoinRequests: (userId, requests) => {
        set((state) => ({
          users: state.users.map(u =>
            u.id === userId ? { ...u, joinRequests: requests } : u
          )
        }));
      },

      updateUserNotifications: (userId, notifications) => {
        set((state) => ({
          users: state.users.map(u =>
            u.id === userId ? { ...u, notifications: notifications } : u
          )
        }));
      },

      updateUserProfile: (userId, profile) => {
        set((state) => ({
          users: state.users.map(u =>
            u.id === userId ? { ...u, profile: profile } : u
          )
        }));
      },

      getCurrentUser: () => {
        const { users, id } = get();
        return users.find(u => u.id === id) || null;
      }
    }),
    {
      name: "edubridge-auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        users: state.users,
        ...(state.rememberMe ? {
          id: state.id,
          isAuthenticated: state.isAuthenticated,
          rememberMe: true
        } : {})
      }),
    }
  )
);
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AppNotification } from "@/features/notifications/types";
import type { UserProfile, TaProfile } from "@/features/profile/types";
import type { Team, JoinRequest } from "@/features/teams/types";
import type { SupervisionRequest } from "@/features/supervision/types";

export interface RegisteredUser {
  id: string;
  email: string;
  role: 'student' | 'ta';
  // User-specific data states - These are the source of truth
  savedIdeaIds: string[];
  myTeams: Team[];
  joinRequests: JoinRequest[];
  supervisionRequests: SupervisionRequest[];
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
  updateUserMyTeams: (userId: string, teams: Team[]) => void;
  updateUserJoinRequests: (userId: string, requests: JoinRequest[]) => void;
  updateUserSupervisionRequests: (userId: string, requests: SupervisionRequest[]) => void;
  updateUserNotifications: (userId: string, notifications: AppNotification[]) => void;
  updateUserProfile: (userId: string, profile: UserProfile | TaProfile) => void;

  // Supervision Actions
  acceptSupervisionRequest: (requestId: string) => void;
  rejectSupervisionRequest: (requestId: string) => void;

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

      updateUserMyTeams: (userId, teams) => {
        set((state) => ({
          users: state.users.map(u =>
            u.id === userId ? { ...u, myTeams: teams } : u
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

      updateUserSupervisionRequests: (userId, requests) => {
        set((state) => ({
          users: state.users.map(u =>
            u.id === userId ? { ...u, supervisionRequests: requests } : u
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

      acceptSupervisionRequest: (requestId: string) => {
        const currentUser = get().getCurrentUser();
        if (!currentUser) return;

        const request = currentUser.supervisionRequests?.find(r => r.id === requestId);
        if (!request) return;

        const leader = get().users.find(u => u.id === request.studentId);
        if (!leader) return;

        const team = (leader.myTeams || []).find(t => t.id === request.projectId);
        if (!team) return;

        // 1. Update Leader Team: Assign current TA
        const updatedLeaderTeams = leader.myTeams.map(t =>
          t.id === team.id ? { ...t, taId: currentUser.id, status: 'TaApproved' as const } : t
        );

        // 2. Add to TA Team List
        const updatedTeam = { ...team, taId: currentUser.id, status: 'TaApproved' as const };
        const updatedTaTeams = [...(currentUser.myTeams || []), updatedTeam];

        // 3. Update Request Status
        const updatedRequests = currentUser.supervisionRequests.map(r =>
          r.id === requestId ? { ...r, status: 'approved' as const, reviewedAt: new Date() } : r
        );

        // 4. Create Notification for Leader
        const notification: AppNotification = {
          id: `notif-ta-acc-${Date.now()}`,
          userId: leader.id,
          message: `TA ${currentUser.profile.firstName} has accepted to supervise your team "${team.name}"!`,
          isRead: false,
          type: 'TaRequestAccepted',
          relatedEntityId: team.id,
          createdAt: new Date(),
          sender: {
            id: currentUser.id,
            name: `${currentUser.profile.firstName} ${currentUser.profile.lastName}`,
            imageUrl: currentUser.profile.profileImageUrl
          }
        };

        // 5. Update TA notifications (Transform request into accepted)
        const updatedTaNotifications = (currentUser.notifications || []).map(n =>
          (n.type === 'TaRequestReceived' && n.relatedEntityId === request.projectId)
            ? { ...n, type: 'TaRequestAccepted' as const, message: `You accepted to supervise "${team.name}".`, isRead: true }
            : n
        );

        set((state) => ({
          users: state.users.map(u => {
            if (u.id === leader.id) {
              return {
                ...u,
                myTeams: updatedLeaderTeams,
                notifications: [...(u.notifications || []), notification]
              };
            }
            if (u.id === currentUser.id) {
              return {
                ...u,
                myTeams: updatedTaTeams,
                supervisionRequests: updatedRequests,
                notifications: updatedTaNotifications
              };
            }
            return u;
          })
        }));
      },

      rejectSupervisionRequest: (requestId: string) => {
        const currentUser = get().getCurrentUser();
        if (!currentUser) return;

        const request = currentUser.supervisionRequests?.find(r => r.id === requestId);
        if (!request) return;

        const leader = get().users.find(u => u.id === request.studentId);
        if (!leader) return;

        const team = (leader.myTeams || []).find(t => t.id === request.projectId);
        if (!team) return;

        // 1. Update Request Status
        const updatedRequests = currentUser.supervisionRequests.map(r =>
          r.id === requestId ? { ...r, status: 'rejected' as const, reviewedAt: new Date() } : r
        );

        // 2. Create Notification for Leader
        const notification: AppNotification = {
          id: `notif-ta-rej-${Date.now()}`,
          userId: leader.id,
          message: `TA ${currentUser.profile.firstName} has declined to supervise your team.`,
          isRead: false,
          type: 'TaRequestRejected',
          relatedEntityId: request.projectId,
          createdAt: new Date(),
          sender: {
            id: currentUser.id,
            name: `${currentUser.profile.firstName} ${currentUser.profile.lastName}`,
            imageUrl: currentUser.profile.profileImageUrl
          }
        };

        // 3. Update TA notifications (Transform request into declined)
        const updatedTaNotifications = (currentUser.notifications || []).map(n =>
          (n.type === 'TaRequestReceived' && n.relatedEntityId === request.projectId)
            ? { ...n, type: 'TaRequestRejected' as const, message: `You declined to supervise "${team.name}".`, isRead: true }
            : n
        );

        set((state) => ({
          users: state.users.map(u => {
            if (u.id === leader.id) {
              return {
                ...u,
                notifications: [...(u.notifications || []), notification]
              };
            }
            if (u.id === currentUser.id) {
              return {
                ...u,
                supervisionRequests: updatedRequests,
                notifications: updatedTaNotifications
              };
            }
            return u;
          })
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
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Team,
  JoinRequest,
  TeamStatus,
  JoinRequestStatus
} from '../types';

interface TeamsState {
  // Teams list
  teams: Team[];
  currentTeam: Team | null;
  isLoading: boolean;
  error: string | null;

  // Join Requests
  joinRequests: JoinRequest[];
  myJoinRequests: JoinRequest[];

  // Setters for teams
  setTeams: (teams: Team[]) => void;
  setCurrentTeam: (team: Team | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Team CRUD actions
  addTeam: (team: Team) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  removeTeam: (id: string) => void;

  // Team member actions
  addMember: (teamId: string, member: Team['members'][0]) => void;
  removeMember: (teamId: string, memberId: string) => void;
  updateMemberRole: (teamId: string, memberId: string, role: 'Leader' | 'Member') => void;

  // Team status
  updateTeamStatus: (teamId: string, status: TeamStatus) => void;

  // Join request actions
  setJoinRequests: (requests: JoinRequest[]) => void;
  setMyJoinRequests: (requests: JoinRequest[]) => void;
  addJoinRequest: (request: JoinRequest) => void;
  updateJoinRequest: (id: string, status: JoinRequestStatus) => void;
  removeJoinRequest: (id: string) => void;

  // Clear state
  clearCurrentTeam: () => void;
  clearError: () => void;
}

export const useTeamStore = create<TeamsState>()(
  persist(
    (set) => ({
      // Initial state
      teams: [],
      currentTeam: null,
      isLoading: false,
      error: null,
      joinRequests: [],
      myJoinRequests: [],

      // Setters
      setTeams: (teams) => set({ teams }),
      setCurrentTeam: (team) => set({ currentTeam: team }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Team CRUD
      addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
      updateTeam: (id, updates) =>
        set((state) => ({
          teams: state.teams.map((t) => (t.id === id ? { ...t, ...updates } : t)),
          currentTeam: state.currentTeam?.id === id
            ? { ...state.currentTeam, ...updates }
            : state.currentTeam
        })),
      removeTeam: (id) =>
        set((state) => ({
          teams: state.teams.filter((t) => t.id !== id),
          currentTeam: state.currentTeam?.id === id ? null : state.currentTeam
        })),

      // Team member actions
      addMember: (teamId, member) =>
        set((state) => {
          const updatedTeams = state.teams.map((t) =>
            t.id === teamId ? { ...t, members: [...t.members, member] } : t
          );
          const updatedCurrentTeam = state.currentTeam?.id === teamId
            ? { ...state.currentTeam, members: [...state.currentTeam.members, member] }
            : state.currentTeam;
          return { teams: updatedTeams, currentTeam: updatedCurrentTeam };
        }),
      removeMember: (teamId, memberId) =>
        set((state) => {
          const updatedTeams = state.teams.map((t) =>
            t.id === teamId
              ? { ...t, members: t.members.filter((m) => m.id !== memberId) }
              : t
          );
          const updatedCurrentTeam = state.currentTeam?.id === teamId
            ? { ...state.currentTeam, members: state.currentTeam.members.filter((m) => m.id !== memberId) }
            : state.currentTeam;
          return { teams: updatedTeams, currentTeam: updatedCurrentTeam };
        }),
      updateMemberRole: (teamId, memberId, role) =>
        set((state) => {
          const updatedTeams = state.teams.map((t) =>
            t.id === teamId
              ? {
                ...t,
                members: t.members.map((m) =>
                  m.id === memberId ? { ...m, role } : m
                )
              }
              : t
          );
          const updatedCurrentTeam = state.currentTeam?.id === teamId
            ? {
              ...state.currentTeam,
              members: state.currentTeam.members.map((m) =>
                m.id === memberId ? { ...m, role } : m
              )
            }
            : state.currentTeam;
          return { teams: updatedTeams, currentTeam: updatedCurrentTeam };
        }),

      // Team status
      updateTeamStatus: (teamId, status) =>
        set((state) => {
          const updatedTeams = state.teams.map((t) =>
            t.id === teamId ? { ...t, status } : t
          );
          const updatedCurrentTeam = state.currentTeam?.id === teamId
            ? { ...state.currentTeam, status }
            : state.currentTeam;
          return { teams: updatedTeams, currentTeam: updatedCurrentTeam };
        }),

      // Join request actions
      setJoinRequests: (requests) => set({ joinRequests: requests }),
      setMyJoinRequests: (requests) => set({ myJoinRequests: requests }),
      addJoinRequest: (request) =>
        set((state) => ({ joinRequests: [...state.joinRequests, request] })),
      updateJoinRequest: (id, status) =>
        set((state) => ({
          joinRequests: state.joinRequests.map((r) =>
            r.id === id ? { ...r, status } : r
          ),
          myJoinRequests: state.myJoinRequests.map((r) =>
            r.id === id ? { ...r, status } : r
          )
        })),
      removeJoinRequest: (id) =>
        set((state) => ({
          joinRequests: state.joinRequests.filter((r) => r.id !== id),
          myJoinRequests: state.myJoinRequests.filter((r) => r.id !== id)
        })),

      // Clear state
      clearCurrentTeam: () => set({ currentTeam: null }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'edubridge-teams-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
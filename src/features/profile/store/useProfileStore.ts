import { create } from 'zustand';
import type { Role } from '../types';

interface ProfileState {
  role: Role | null;
  setRole: (role: Role) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  role: null,
  setRole: (role) => set({ role: role }),
}));

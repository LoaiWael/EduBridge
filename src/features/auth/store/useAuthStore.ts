import { create } from "zustand";

interface authState {
  id: string;
  isAuthenticated: boolean;
  setId: (id: string) => void;
  setIsAuthenticated: (arg: boolean) => void;
}

export const useAuthStore = create<authState>(set => ({
  id: '1',
  isAuthenticated: true,
  setId: (id) => set({ id: id }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated: isAuthenticated })
}))
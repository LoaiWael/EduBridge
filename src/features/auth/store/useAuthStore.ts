import { create } from "zustand";

interface authState {
  isAuthenticated: boolean;
  setIsAuthenticated: (arg: boolean) => void
}

export const useAuthStore = create<authState>(set => ({
  isAuthenticated: true,
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated: isAuthenticated })
}))
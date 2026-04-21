import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '@/types';

interface PreferencesState {
  theme: ThemeMode;
  animationsEnabled: boolean;
  setTheme: (theme: ThemeMode) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'system',
      animationsEnabled: true,
      setTheme: (theme) => set({ theme }),
      setAnimationsEnabled: (animationsEnabled) => set({ animationsEnabled }),
    }),
    {
      name: 'edubridge-preferences',
    }
  )
);

import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { Toaster } from '@/components/ui/sonner';
import router from './router';

function App() {
  const theme = usePreferencesStore(state => state.theme);
  const animationsEnabled = usePreferencesStore(state => state.animationsEnabled);

  useEffect(() => {
    const root = document.documentElement;
    root.style.colorScheme = theme === 'system' ? 'light dark' : theme;

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  // Listen for system theme changes dynamically if on 'system' mode
  useEffect(() => {
    if (theme !== 'system') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <MotionConfig reducedMotion={animationsEnabled ? "never" : "always"}>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </MotionConfig>
  );
}

export default App;
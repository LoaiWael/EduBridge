import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { User, Lock, Bell, Sun, Moon, Monitor, FileText, Shield, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useProfileStore } from "@/features/profile";
import { ProfileAvatar } from "@/features/profile/";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import BackButton from "@/components/BackButton";
import TermsAndConditions from "@/components/TermsAndConditions";
import type { ThemeMode } from "@/types";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
    }
  }
};

const SettingsPage = () => {
  const firstName = useProfileStore(state => state.firstName);
  const lastName = useProfileStore(state => state.lastName);
  const email = useProfileStore(state => state.email);
  const theme = usePreferencesStore(state => state.theme);
  const setTheme = usePreferencesStore(state => state.setTheme);
  const animationsEnabled = usePreferencesStore(state => state.animationsEnabled);
  const setAnimationsEnabled = usePreferencesStore(state => state.setAnimationsEnabled);

  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    document.title = "EduBridge - Settings";
  }, []);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
  };

  return (
    <motion.div
      className="min-h-screen w-full bg-brand-background pb-24 relative overflow-x-hidden pt-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header (Full Width Outer Scope) */}
      <div className="px-6 pb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between relative mt-4">
          <div className="absolute left-0 z-10 w-fit">
            <BackButton />
          </div>
          <h1 className="text-2xl font-bold text-center w-full z-0 text-brand-text-primary">
            Settings
          </h1>
        </div>
      </div>

      <div className="px-6 pb-6 w-full max-w-4xl mx-auto flex flex-col gap-6">

        {/* Profile Card Summary */}
        <motion.div
          variants={sectionVariants}
          className="bg-brand-card rounded-brand-input p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex items-center gap-4 border border-brand-grey"
        >
          <ProfileAvatar style={{ width: 60, height: 60, flexShrink: 0 }} />
          <div className="flex flex-col min-w-0 flex-1">
            <h2 className="text-[18px] font-bold text-brand-text-primary truncate">
              {firstName} {lastName}
            </h2>
            <p className="text-[13px] text-brand-text-secondary truncate mt-0.5">
              {email}
            </p>
          </div>
        </motion.div>

        {/* Account Section */}
        <motion.div variants={sectionVariants} className="flex flex-col">
          <h3 className="text-[13px] font-semibold text-brand-text-secondary mb-2 pl-1 uppercase tracking-wider">
            Account
          </h3>
          <div className="bg-brand-card rounded-brand-input shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-brand-grey overflow-hidden flex flex-col divide-y divide-brand-grey/30">
            <Link to="profile" viewTransition className="flex items-center justify-between p-4 px-5 hover:bg-brand-secondary/5 transition-colors active:bg-brand-secondary/10 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-inset">
              <div className="flex items-center gap-4">
                <User size={20} className="text-brand-text-primary" />
                <span className="text-[15px] font-medium text-brand-text-primary">Manage Profile</span>
              </div>
              <ChevronRight size={18} className="text-brand-text-secondary" aria-hidden="true" />
            </Link>
            <Link to="password-security" className="flex items-center justify-between p-4 px-5 hover:bg-brand-secondary/5 transition-colors active:bg-brand-secondary/10 text-left w-full focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-inset" viewTransition>
              <div className="flex items-center gap-4">
                <Lock size={20} className="text-brand-text-primary" />
                <span className="text-[15px] font-medium text-brand-text-primary">Password and security</span>
              </div>
              <ChevronRight size={18} className="text-brand-text-secondary" aria-hidden="true" />
            </Link>
            <Link to="notifications" className="flex items-center justify-between p-4 px-5 hover:bg-brand-secondary/5 transition-colors active:bg-brand-secondary/10 text-left w-full focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-inset" viewTransition>
              <div className="flex items-center gap-4 relative">
                <Bell size={20} className="text-brand-text-primary" />
                <span className="text-[15px] font-medium text-brand-text-primary">Notifications</span>
              </div>
              <ChevronRight size={18} className="text-brand-text-secondary" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>

        {/* Preference Section */}
        <motion.div variants={sectionVariants} className="flex flex-col mt-2">
          <h3 className="text-[13px] font-semibold text-brand-text-secondary mb-2 pl-1 uppercase tracking-wider">
            Preference
          </h3>
          <div className="bg-brand-card rounded-brand-input shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-brand-grey overflow-hidden flex flex-col divide-y divide-brand-grey/30">

            {/* Theme Selector */}
            <div className="flex flex-col p-4 px-5">
              <div className="flex items-center gap-4 mb-3">
                <Monitor size={20} className="text-brand-text-primary" />
                <span className="text-[15px] font-medium text-brand-text-primary">Theme Mode</span>
              </div>

              <div className="bg-brand-background rounded-[16px] p-1 flex mt-1 relative w-full h-[44px]">
                {/* Active Indicator Slider */}
                <motion.div
                  className="absolute top-1 bottom-1 bg-brand-text-primary rounded-[12px] shadow-sm z-0"
                  initial={false}
                  animate={{
                    width: "calc(33.333% - 2px)",
                    left: theme === 'system' ? '4px' : theme === 'light' ? 'calc(33.333% + 2px)' : 'calc(66.666% + 0px)'
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />

                <button
                  onClick={() => handleThemeChange('system')}
                  aria-pressed={theme === 'system'}
                  className={`flex-1 flex items-center justify-center gap-2 z-10 transition-colors text-[13px] font-medium rounded-[12px] ${theme === 'system' ? 'text-brand-background' : 'text-brand-text-secondary hover:text-brand-text-primary/70'} focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-inset`}
                >
                  <Monitor size={16} aria-hidden="true" /> <span className="sm:inline hidden">System</span>
                </button>
                <button
                  onClick={() => handleThemeChange('light')}
                  aria-pressed={theme === 'light'}
                  className={`flex-1 flex items-center justify-center gap-2 z-10 transition-colors text-[13px] font-medium rounded-[12px] ${theme === 'light' ? 'text-brand-background' : 'text-brand-text-secondary hover:text-brand-text-primary/70'} focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-inset`}
                >
                  <Sun size={16} aria-hidden="true" /> <span className="sm:inline hidden">Light</span>
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  aria-pressed={theme === 'dark'}
                  className={`flex-1 flex items-center justify-center gap-2 z-10 transition-colors text-[13px] font-medium rounded-[12px] ${theme === 'dark' ? 'text-brand-background' : 'text-brand-text-secondary hover:text-brand-text-primary/70'} focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-inset`}
                >
                  <Moon size={16} aria-hidden="true" /> <span className="sm:inline hidden">Dark</span>
                </button>
              </div>
            </div>

            {/* Animations Toggle */}
            <div className="flex items-center justify-between p-4 px-5">
              <div className="flex items-center gap-4">
                <Sparkles size={20} className="text-brand-text-primary" aria-hidden="true" />
                <div className="flex flex-col">
                  <span className="text-[15px] font-medium text-brand-text-primary">Platform Animations</span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={animationsEnabled}
                onClick={() => setAnimationsEnabled(!animationsEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 ${animationsEnabled ? 'bg-brand-text-primary' : 'bg-brand-background'}`}
              >
                <span className="sr-only">{animationsEnabled ? 'Disable' : 'Enable'} animations</span>
                <motion.span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-brand-card shadow ring-0`}
                  animate={{ x: animationsEnabled ? 20 : 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                />
              </button>
            </div>

            <Link to="/about-us" className="flex items-center justify-between p-4 px-5 hover:bg-brand-secondary/5 transition-colors active:bg-brand-secondary/10 text-left w-full focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-inset cursor-pointer">
              <div className="flex items-center gap-4">
                <FileText size={20} className="text-brand-text-primary" />
                <span className="text-[15px] font-medium text-brand-text-primary">About Us</span>
              </div>
              <ChevronRight size={18} className="text-brand-text-secondary" aria-hidden="true" />
            </Link>
            <button
              onClick={() => setShowTerms(true)}
              className="flex items-center cursor-pointer justify-between p-4 px-5 hover:bg-brand-secondary/5 transition-colors active:bg-brand-secondary/10 text-left w-full focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-inset"
            >
              <div className="flex items-center gap-4">
                <Shield size={20} className="text-brand-text-primary" />
                <span className="text-[15px] font-medium text-brand-text-primary">Terms & Conditions</span>
              </div>
              <ChevronRight size={18} className="text-brand-text-secondary" aria-hidden="true" />
            </button>
          </div>
        </motion.div>

      </div>

      <TermsAndConditions isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </motion.div>
  );
};

export default SettingsPage;
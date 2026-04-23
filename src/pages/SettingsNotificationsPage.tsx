import { motion, type Variants } from "framer-motion";
import {
  Bell,
  Smartphone,
  Mail,
  Megaphone,
  Users,
  Lightbulb,
  UserCheck
} from "lucide-react";
import BackButton from "@/components/BackButton";
import { useNotificationStore } from "@/features/notifications/store/useNotificationStore";

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

const SettingsNotificationsPage = () => {
  const preferences = useNotificationStore(state => state.preferences);
  const updatePreferences = useNotificationStore(state => state.updatePreferences);

  const CustomToggle = ({ label, icon: Icon, checked, onChange, description }: any) => (
    <div className="flex items-center justify-between p-4 px-5 hover:bg-brand-secondary/5 transition-colors">
      <div className="flex items-start gap-4">
        <Icon size={20} className="text-brand-text-primary mt-0.5" aria-hidden="true" />
        <div className="flex flex-col">
          <span className="text-[15px] font-medium text-brand-text-primary">{label}</span>
          {description && (
            <span className="text-[13px] text-brand-text-secondary mt-0.5 max-w-[240px] sm:max-w-xs">{description}</span>
          )}
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 ${checked ? 'bg-brand-text-primary' : 'bg-brand-background'} ml-4`}
      >
        <span className="sr-only">{checked ? 'Disable' : 'Enable'} {label}</span>
        <motion.span
          aria-hidden="true"
          className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-brand-card shadow ring-0"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        />
      </button>
    </div>
  );

  return (
    <motion.div
      className="min-h-screen w-full bg-brand-background pb-24 relative overflow-x-hidden pt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header (Full Width Outer Scope) */}
      <div className="px-6 pb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between relative mt-4">
          <div className="absolute left-0 z-10 w-fit">
            <BackButton />
          </div>
          <h1 className="text-2xl font-bold text-center w-full z-0 text-brand-text-primary">
            Notifications
          </h1>
        </div>
      </div>

      <div className="px-6 pb-6 w-full max-w-4xl mx-auto flex flex-col gap-6">

        {/* Delivery Methods Section */}
        <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="flex flex-col">
          <h3 className="text-[13px] font-semibold text-brand-text-secondary mb-2 pl-1 uppercase tracking-wider">
            Delivery Methods
          </h3>
          <div className="bg-brand-card rounded-brand-input shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-brand-grey overflow-hidden flex flex-col divide-y divide-brand-grey/30">
            <CustomToggle
              label="In-App Notifications"
              description="Receive notifications inside the EduBridge platform."
              icon={Bell}
              checked={preferences.inAppEnabled}
              onChange={(v: boolean) => updatePreferences({ inAppEnabled: v })}
            />
            <CustomToggle
              label="Push Notifications"
              description="Receive push notifications on your device."
              icon={Smartphone}
              checked={preferences.pushEnabled}
              onChange={(v: boolean) => updatePreferences({ pushEnabled: v })}
            />
            <CustomToggle
              label="Email Notifications"
              description="Receive notifications directly to your inbox."
              icon={Mail}
              checked={preferences.emailEnabled}
              onChange={(v: boolean) => updatePreferences({ emailEnabled: v })}
            />
          </div>
        </motion.div>

        {/* Global Configuration Section */}
        <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="flex flex-col mt-2">
          <h3 className="text-[13px] font-semibold text-brand-text-secondary mb-2 pl-1 uppercase tracking-wider">
            Notification Types
          </h3>
          <div className="bg-brand-card rounded-brand-input shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-brand-grey overflow-hidden flex flex-col divide-y divide-brand-grey/30">
            <CustomToggle
              label="Supervision Requests"
              description="Get notified when a student sends a request for project supervision."
              icon={UserCheck}
              checked={preferences.supervisionRequests}
              onChange={(v: boolean) => updatePreferences({ supervisionRequests: v })}
            />
            <CustomToggle
              label="Team Updates"
              description="Updates related to your joined teams and project invites."
              icon={Users}
              checked={preferences.teamUpdates}
              onChange={(v: boolean) => updatePreferences({ teamUpdates: v })}
            />
            <CustomToggle
              label="Idea Mentions"
              description="Get notified when someone interacts with your ideas in the library."
              icon={Lightbulb}
              checked={preferences.ideaMentions}
              onChange={(v: boolean) => updatePreferences({ ideaMentions: v })}
            />
            <CustomToggle
              label="Marketing Emails"
              description="Hear about new EduBridge features, campaigns, and guides."
              icon={Megaphone}
              checked={preferences.marketingEmails}
              onChange={(v: boolean) => updatePreferences({ marketingEmails: v })}
            />
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default SettingsNotificationsPage;
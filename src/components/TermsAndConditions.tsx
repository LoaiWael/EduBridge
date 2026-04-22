import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X } from "lucide-react";

interface TermsAndConditionsProps {
  isOpen: boolean;
  onClose: () => void;
}

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 24, rotateX: 5 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 24,
    rotateX: 5,
    transition: { duration: 0.2, ease: "easeIn" }
  }
};

const termsContent = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing and using EduBridge, you accept and agree to be bound by the terms and provision of this agreement."
  },
  {
    title: "2. Use License",
    content: "Permission is granted to temporarily use EduBridge for personal, non-commercial use only. This is the grant of a license, not a transfer of title."
  },
  {
    title: "3. User Accounts",
    content: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account."
  },
  {
    title: "4. Academic Integrity",
    content: "Users agree to maintain academic integrity. The platform is intended to assist learning, not replace it. Misuse may result in account suspension."
  },
  {
    title: "5. Privacy & Data",
    content: "We collect and process your data in accordance with our Privacy Policy. By using EduBridge, you consent to such processing."
  },
  {
    title: "6. Prohibited Uses",
    content: "You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts."
  },
  {
    title: "7. Limitation of Liability",
    content: "EduBridge shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service."
  },
  {
    title: "8. Changes to Terms",
    content: "We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of any updated terms."
  }
];

const TermsAndConditions = ({ isOpen, onClose }: TermsAndConditionsProps) => {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="bg-brand-card rounded-brand-input shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col border border-brand-grey"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-brand-grey/30 shrink-0">
              <h2 className="text-lg font-bold text-brand-text-primary">
                Terms & Conditions
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-brand-secondary/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                aria-label="Close"
              >
                <X size={20} className="text-brand-text-secondary" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {termsContent.map((section, index) => (
                <div key={index}>
                  <h3 className="text-[15px] font-semibold text-brand-text-primary mb-1.5">
                    {section.title}
                  </h3>
                  <p className="text-brand-body-sm text-brand-text-secondary leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-brand-grey/30 shrink-0">
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-brand-text-primary text-brand-background rounded-brand-input font-medium text-[15px] hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-card"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TermsAndConditions;
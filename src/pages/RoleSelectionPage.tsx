import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion, easeOut } from "motion/react";
import { useProfileStore } from "@/features/profile";
import type { Role } from "@/features/profile";
import bgVector from "@/assets/imgs/svg/login-register-bg-vector.svg";
import BackButton from "@/components/BackButton";

const RoleSelectionPage = () => {
  const navigate = useNavigate();
  const setSelectedRole = useProfileStore((state) => state.setRole);
  const shouldReduceMotion = useReducedMotion();

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    navigate("/register", { viewTransition: true });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.4,
        ease: easeOut,
      },
    },
  };

  return (
    <>
      <title>EduBridge - Role Selection</title>

      <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-brand-primary/35">
        {/* Background Vector */}
        <motion.img
          src={bgVector}
          alt=""
          aria-hidden="true"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 20, ease: easeOut }}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none mix-blend-multiply"
        />

        {/* Top Navigation */}
        <div
          className="absolute top-0 left-0 w-full p-6 z-10 flex items-center"
        >
          <BackButton />
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: easeOut }}
          className="relative z-10 w-full max-w-sm px-6 flex flex-col items-center space-y-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.5,
              delay: shouldReduceMotion ? 0 : 0.2,
              ease: easeOut
            }}
            className="text-4xl font-bold text-brand-text-primary tracking-tight text-center"
          >
            Are you...
          </motion.h1>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full flex flex-col space-y-4"
          >
            <motion.button
              variants={buttonVariants}
              whileHover={{
                scale: shouldReduceMotion ? 1 : 1.03,
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)"
              }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.97 }}
              onClick={() => handleRoleSelect("student")}
              className="w-full py-4 px-6 rounded-brand-input bg-brand-secondary text-brand-background dark:text-brand-text-primary font-medium text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-secondary/50 focus-visible:ring-offset-2"
              aria-label="Select Student role"
            >
              <span>Student</span>
            </motion.button>

            <motion.button
              variants={buttonVariants}
              whileHover={{
                scale: shouldReduceMotion ? 1 : 1.03,
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)"
              }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.97 }}
              onClick={() => handleRoleSelect("ta")}
              className="w-full py-4 px-6 rounded-brand-input bg-brand-primary text-brand-text-primary font-medium text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary/50 focus-visible:ring-offset-2"
              aria-label="Select Teaching Assistant role"
            >
              <span>Teaching Assistant</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default RoleSelectionPage;
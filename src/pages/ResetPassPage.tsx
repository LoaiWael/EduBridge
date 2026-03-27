import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, useReducedMotion, AnimatePresence, type Variants } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";

const ResetPassPage = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const password = watch("password", "");

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    console.log("Password reset submitted", data);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    navigate('/login', { viewTransition: true });
  };

  const formVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
      },
    },
  };

  return (
    <>
      <title>EduBridge - Reset Password</title>
      <div className="relative min-h-screen w-full flex flex-col items-center bg-[#EAF0FA] overflow-hidden">

        {/* Top Navigation */}
        <div className="absolute top-0 w-full px-6 py-8 z-10 flex items-center justify-between">
          <BackButton />
        </div>

        {/* Content Wrapper */}
        <div className="w-full max-w-sm px-6 mt-[120px] flex flex-col items-center z-10">

          {/* Header Text */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center space-y-3 mb-12 text-center"
          >
            <h1 className="text-3xl font-bold text-[#000000]">
              Reset Password
            </h1>
            <p className="text-[#333333] text-[15px] font-medium">
              Enter a new password
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={formVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col space-y-5"
          >
            <div className="flex flex-col space-y-4">
              {/* New Password Input */}
              <motion.div variants={itemVariants} className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must have at least 6 characters"
                    }
                  })}
                  autoComplete="new-password"
                  className={`bg-white border ${errors.password ? 'border-brand-red' : 'border-0'} text-[#444444] placeholder:text-[#B0B0B0] text-base shadow-sm focus-visible:ring-2 focus-visible:ring-brand-text-primary/20`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#A0A0A0] hover:text-[#555555] transition-colors focus:outline-none rounded-full p-1 focus-visible:ring-2 focus-visible:ring-brand-text-primary/40"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye className="w-[22px] h-[22px]" /> : <EyeOff className="w-[22px] h-[22px]" strokeWidth={1.5} />}
                </button>
                {errors.password && <p className="text-brand-red text-xs mt-1 ml-4 absolute -bottom-5 left-0">{errors.password.message as string}</p>}
              </motion.div>

              {/* Confirm Password Input */}
              <motion.div variants={itemVariants} className="relative pt-1">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: value => value === password || "Passwords do not match"
                  })}
                  autoComplete="new-password"
                  className={`bg-white border ${errors.confirmPassword ? 'border-brand-red' : 'border-0'} text-[#444444] placeholder:text-[#B0B0B0] text-base shadow-sm focus-visible:ring-2 focus-visible:ring-brand-text-primary/20`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 mt-0.5 text-[#A0A0A0] hover:text-[#555555] transition-colors focus:outline-none rounded-full p-1 focus-visible:ring-2 focus-visible:ring-brand-text-primary/40"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <Eye className="w-[22px] h-[22px]" /> : <EyeOff className="w-[22px] h-[22px]" strokeWidth={1.5} />}
                </button>
                {errors.confirmPassword && <p className="text-brand-red text-xs mt-1 ml-4 absolute -bottom-5 left-0">{errors.confirmPassword.message as string}</p>}
              </motion.div>
            </div>

            {/* Confirm Button */}
            <motion.div variants={itemVariants} className="pt-8">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-[#94A9CD] hover:bg-[#8598B8] text-black font-semibold text-[17px] shadow-sm transition-all focus-visible:ring-4 focus-visible:ring-[#94A9CD]/40 focus-visible:ring-offset-0 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Resetting...
                    </motion.div>
                  ) : (
                    <motion.span
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Confirm
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </motion.form>

        </div>
      </div>
    </>
  );
};

export default ResetPassPage;
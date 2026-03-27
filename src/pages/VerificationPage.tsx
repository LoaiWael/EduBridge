import { useState, useRef, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { motion, useReducedMotion, AnimatePresence, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import BackButton from "@/components/BackButton";
import { useProfileStore } from "@/features/profile";

const VerificationPage = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [isLoading, setIsLoading] = useState(false);
  const [dontAsk, setDontAsk] = useState(false);
  const email = useProfileStore(state => state.email);

  // OTP State handling
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([] as (HTMLInputElement | null)[]);

  const maskedEmail = email ? (() => {
    const [username, domain] = email.split('@');
    const maskedUsername = username.slice(0, 3) + '*'.repeat(Math.max(0, username.length - 3));
    return `${maskedUsername}@${domain}`;
  })() : '';

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedData = value.replace(/\D/g, "").slice(0, 4).split("");
      const newOtp = [...otp];
      pastedData.forEach((char, i) => {
        if (index + i < 4) newOtp[index + i] = char;
      });
      setOtp(newOtp);

      // Focus the next available input
      const nextIndex = Math.min(index + pastedData.length, 3);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== "" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      // Auto-focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 4) return; // Simple validation

    setIsLoading(true);
    console.log("Verification submitted", { code, dontAsk });
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    navigate('/', { viewTransition: true });
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
      <title>EduBridge - Verification</title>
      <div className="relative min-h-screen w-full flex flex-col items-center bg-[#EAF0FA] overflow-hidden">

        {/* Top Navigation */}
        <div className="absolute top-0 w-full px-6 py-8 z-10 flex items-center justify-between">
          <BackButton />
        </div>

        {/* Content Wrapper */}
        <div className="w-full max-w-sm px-4 mt-[110px] flex flex-col items-center z-10">

          {/* Header Text */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center space-y-4 mb-10 text-center"
          >
            <h1 className="text-[32px] font-bold text-[#000000]">
              Verification code
            </h1>
            <p className="text-[#000000] text-sm font-semibold max-w-[280px] leading-relaxed">
              We just send your authentication code via email to {maskedEmail} Didn't receive the email? Check your spam or junk folder.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={formVariants}
            initial="hidden"
            animate="visible"
            onSubmit={onSubmit}
            className="w-full flex flex-col items-center"
          >
            {/* OTP Inputs */}
            <motion.div variants={itemVariants} className="flex justify-center gap-4 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={4} // Allow paste lengths
                  value={digit}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-[60px] h-[60px] bg-white rounded-2xl shadow-sm text-center text-2xl font-bold text-[#444444] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-text-primary/40 focus:border-transparent transition-all"
                />
              ))}
            </motion.div>

            {/* Resend Code Link */}
            <motion.div variants={itemVariants} className="mb-12 text-center mt-2">
              <span className="text-[#000000] text-[13px] font-bold mr-1">
                Didn't receive code?
              </span>
              <button
                type="button"
                className="text-[#8FE0A4] text-[13px] font-bold hover:underline focus:outline-none rounded-sm focus-visible:ring-2 focus-visible:ring-brand-text-primary/40"
              >
                Resend code
              </button>
            </motion.div>

            {/* Checkbox */}
            <motion.div variants={itemVariants} className="w-full flex items-center justify-center space-x-3 mb-6">
              <Checkbox
                id="dontAsk"
                checked={dontAsk}
                onCheckedChange={(checked) => setDontAsk(checked as boolean)}
                className="border-[#000000] border-2 data-[state=checked]:bg-[#000000] data-[state=checked]:text-white rounded-sm w-[20px] h-[20px] shadow-sm"
              />
              <Label
                htmlFor="dontAsk"
                className="text-brand-body-sm font-bold text-[#000000] cursor-pointer"
              >
                Don't ask again on this device
              </Label>
            </motion.div>

            {/* Verify Button */}
            <motion.div variants={itemVariants} className="w-full">
              <Button
                type="submit"
                disabled={isLoading || otp.join("").length < 4}
                className="w-full h-14 bg-[#94A9CD] hover:bg-[#8598B8] text-black font-semibold text-[17px] shadow-sm transition-all focus-visible:ring-4 focus-visible:ring-[#94A9CD]/40 focus-visible:ring-offset-0 disabled:opacity-70 disabled:cursor-not-allowed rounded-[30px]"
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
                      Verifying...
                    </motion.div>
                  ) : (
                    <motion.span
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Verify
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

export default VerificationPage;
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, useReducedMotion, AnimatePresence, type Variants } from "framer-motion";
import bgVector from "@/assets/imgs/svg/login-register-bg-vector.svg";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";
import { useProfileStore } from "@/features/profile";
import type { RegisterFormData } from "@/features/auth";

const RegisterPage = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const role = useProfileStore((state) => state.role);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<RegisterFormData>();
  const setFirstName = useProfileStore(state => state.setFirstName);
  const setLastName = useProfileStore(state => state.setLastName);
  const setUniversity = useProfileStore(state => state.setUniversity);
  const setEmail = useProfileStore(state => state.setEmail);

  // Protect against users visiting register directly without selecting a role.
  // We can just default to 'student' if null, or ideally redirect back to /role-selection
  const currentRole = role || 'student';

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    // Submit registration logic goes here
    console.log("Register submitted", data, "Role:", currentRole);

    setFirstName(data.firstName);
    setLastName(data.lastName);
    setUniversity(data.universityName ?? "");
    setEmail(data.email);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    navigate('/verification', { viewTransition: true })
  };

  const formVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
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
      <title>EduBridge - Register</title>
      <div className="relative min-h-screen w-full flex flex-col overflow-hidden bg-brand-background">
        {/* Background Vector */}
        <img
          src={bgVector}
          alt=""
          aria-hidden="true"
          className="absolute top-0 left-0 w-full object-cover pointer-events-none"
        />

        {/* Top Navigation */}
        <div className="absolute top-0 w-full px-6 py-8 z-10 flex items-center justify-between">
          <BackButton />
          <Link
            to="/login"
            className="text-brand-text-primary font-bold text-lg hover:underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-text-primary rounded-md px-1"
            viewTransition
          >
            Login
          </Link>
        </div>

        {/* Header text */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 px-8 mt-28 mb-10 flex flex-col space-y-3"
        >
          <h1 className="text-[32px] font-bold text-[#444444]">
            Register
          </h1>
          <p className="text-[#666666] text-sm leading-relaxed max-w-[280px]">
            Create your account - enjoy our services with most updated features.
          </p>
        </motion.div>

        {/* Bottom Form Card (Takes up remaining space) */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0, damping: 25, stiffness: 120 }}
          className="relative z-10 left-1/2 -translate-x-1/2 flex-1 w-full lg:max-w-3/5 bg-linear-to-b from-brand-gradient-start to-brand-gradient-start/40 rounded-t-[40px] px-8 pt-10 pb-8 flex flex-col shadow-[0_-8px_20px_rgba(0,0,0,0.125)] overflow-y-auto backdrop-blur-sm"
        >
          <motion.form
            variants={formVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-xl mx-auto flex flex-col space-y-5"
          >
            <div className="space-y-4">

              {/* First Name - Small screens */}
              <motion.div variants={itemVariants} className="relative lg:hidden">
                <Input
                  type="text"
                  placeholder="First Name"
                  {...register("firstName", { required: "First name is required" })}
                  autoComplete="given-name"
                  className={`bg-[#F3F6FB]/80 border ${errors.firstName ? 'border-brand-red' : 'border-0'} h-14 px-5 text-[#444444] placeholder:text-[#999999] text-base focus-visible:ring-2 focus-visible:ring-brand-text-primary/20`}
                />
                {errors.firstName && <p className="text-brand-red text-xs mt-1 ml-2 ">{errors.firstName.message as string}</p>}
              </motion.div>

              {/* Last Name - Small screens */}
              <motion.div variants={itemVariants} className="relative lg:hidden">
                <Input
                  type="text"
                  placeholder="Last Name"
                  {...register("lastName", { required: "Last name is required" })}
                  autoComplete="family-name"
                  className={`bg-[#F3F6FB]/80 border ${errors.lastName ? 'border-brand-red' : 'border-0'} h-14 px-5 text-[#444444] placeholder:text-[#999999] text-base focus-visible:ring-2 focus-visible:ring-brand-text-primary/20`}
                />
                {errors.lastName && <p className="text-brand-red text-xs mt-1 ml-2 ">{errors.lastName.message as string}</p>}
              </motion.div>

              {/* First Name & Last Name - Large screens (side by side) */}
              <motion.div variants={itemVariants} className="relative hidden lg:flex gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="First Name"
                    {...register("firstName", { required: "First name is required" })}
                    autoComplete="given-name"
                    className={`bg-[#F3F6FB]/80 border ${errors.firstName ? 'border-brand-red' : 'border-0'} h-14 px-5 text-[#444444] placeholder:text-[#999999] text-base focus-visible:ring-2 focus-visible:ring-brand-text-primary/20`}
                  />
                  {errors.firstName && <p className="text-brand-red text-xs mt-1 ml-2 ">{errors.firstName.message as string}</p>}
                </div>
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Last Name"
                    {...register("lastName", { required: "Last name is required" })}
                    autoComplete="family-name"
                    className={`bg-[#F3F6FB]/80 border ${errors.lastName ? 'border-brand-red' : 'border-0'} h-14 px-5 text-[#444444] placeholder:text-[#999999] text-base focus-visible:ring-2 focus-visible:ring-brand-text-primary/20`}
                  />
                  {errors.lastName && <p className="text-brand-red text-xs mt-1 ml-2 ">{errors.lastName.message as string}</p>}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <Input
                  type="email"
                  placeholder={currentRole === 'ta' ? "University Email" : "Email"}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Entered value does not match email format"
                    }
                  })}
                  autoComplete="email"
                  className={`bg-[#F3F6FB]/80 border ${errors.email ? 'border-brand-red' : 'border-0'} h-14 px-5 text-[#444444] placeholder:text-[#999999] text-base focus-visible:ring-2 focus-visible:ring-brand-text-primary/20`}
                />
                {errors.email && <p className="text-brand-red text-xs mt-1 ml-2 ">{errors.email.message as string}</p>}
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <Input
                  type="text"
                  placeholder="University name"
                  {...register("universityName", { required: "University name is required" })}
                  className={`bg-[#F3F6FB]/80 border ${errors.universityName ? 'border-brand-red' : 'border-0'} h-14 px-5 text-[#444444] placeholder:text-[#999999] text-base focus-visible:ring-2 focus-visible:ring-brand-text-primary/20`}
                />
                {errors.universityName && <p className="text-brand-red text-xs mt-1 ml-2 ">{errors.universityName.message as string}</p>}
              </motion.div>

              {currentRole === 'ta' ? (
                <motion.div variants={itemVariants} className="relative" key="department">
                  <Input
                    type="text"
                    placeholder="Department"
                    {...register("department", { required: "Department is required" })}
                    className={`bg-[#F3F6FB]/80 border ${errors.department ? 'border-brand-red' : 'border-0'} h-14 px-5 text-[#444444] placeholder:text-[#999999] text-base focus-visible:ring-2 focus-visible:ring-brand-text-primary/20`}
                  />
                  {errors.department && <p className="text-brand-red text-xs mt-1 ml-2 ">{errors.department.message as string}</p>}
                </motion.div>
              ) : (
                <motion.div variants={itemVariants} className="relative" key="studentId">
                  <Input
                    type="text"
                    placeholder="Student ID"
                    {...register("studentId", { required: "Student ID is required" })}
                    className={`bg-[#F3F6FB]/80 border ${errors.studentId ? 'border-brand-red' : 'border-0'} h-14 px-5 text-[#444444] placeholder:text-[#999999] text-base focus-visible:ring-2 focus-visible:ring-brand-text-primary/20`}
                  />
                  {errors.studentId && <p className="text-brand-red text-xs mt-1 ml-2 ">{errors.studentId.message as string}</p>}
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must have at least 6 characters"
                    }
                  })}
                  autoComplete="new-password"
                  className={`bg-[#F3F6FB]/80 border ${errors.password ? 'border-brand-red' : 'border-0'} h-14 pl-5 pr-12 text-[#444444] placeholder:text-[#999999] text-base focus-visible:ring-2 focus-visible:ring-brand-text-primary/20`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#555555] transition-colors focus:outline-none rounded-full p-1 focus-visible:ring-2 focus-visible:ring-brand-text-primary/40"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye className="w-[22px] h-[22px]" /> : <EyeOff className="w-[22px] h-[22px]" strokeWidth={1.5} />}
                </button>
                {errors.password && <p className="text-brand-red text-xs mt-1 ml-2 ">{errors.password.message as string}</p>}
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <Input
                  type={showPasswordConfirmation ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === watch('password') || "Passwords do not match"
                  })}
                  autoComplete="new-password"
                  className={`bg-[#F3F6FB]/80 border ${errors.confirmPassword ? 'border-brand-red' : 'border-0'} h-14 pl-5 pr-12 text-[#444444] placeholder:text-[#999999] text-base focus-visible:ring-2 focus-visible:ring-brand-text-primary/20`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#555555] transition-colors focus:outline-none rounded-full p-1 focus-visible:ring-2 focus-visible:ring-brand-text-primary/40"
                  aria-label={showPasswordConfirmation ? "Hide password" : "Show password"}
                >
                  {showPasswordConfirmation ? <Eye className="w-[22px] h-[22px]" /> : <EyeOff className="w-[22px] h-[22px]" strokeWidth={1.5} />}
                </button>
                {errors.confirmPassword && <p className="text-brand-red text-xs mt-1 ml-2 ">{errors.confirmPassword.message as string}</p>}
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="flex items-center justify-between px-1 pt-1 pb-1 mt-2">
              <div className="flex items-center space-x-2">
                <Controller
                  name="rememberMe"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <Checkbox
                      id="rememberMe"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-[#8899BA] data-[state=checked]:bg-brand-secondary data-[state=checked]:text-white rounded-sm w-[18px] h-[18px]"
                    />
                  )}
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm font-medium leading-none text-brand-text-secondary cursor-pointer"
                >
                  Remember me
                </Label>
              </div>
              <Link
                to="/forget-password"
                className="text-sm font-medium text-brand-text-secondary hover:underline underline-offset-4 focus:outline-none rounded-sm focus-visible:ring-2 focus-visible:ring-white/40"
                viewTransition
              >
                Forgot Password?
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4 pb-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-white hover:bg-[#F3F6FB] text-[#444444] font-bold text-[17px] shadow-md transition-all focus-visible:ring-4 focus-visible:ring-white/40 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent disabled:opacity-70 disabled:cursor-not-allowed"
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
                      Registering...
                    </motion.div>
                  ) : (
                    <motion.span
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Register
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

          </motion.form>
        </motion.div>
      </div>
    </>
  );
};

export default RegisterPage;
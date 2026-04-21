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

const LoginPage = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, control, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    // Use data.email, data.password, data.rememberMe
    console.log("Login submitted", data);
    // Simulate login delay for perceived performance
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    navigate('/', { viewTransition: true })
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
      <title>EduBridge - Login</title>
      <div className="relative min-h-screen w-full flex flex-col overflow-hidden bg-brand-background">
        {/* Background Vector */}
        <img
          src={bgVector}
          alt=""
          aria-hidden="true"
          className="absolute top-0 left-0 w-full object-cover pointer-events-none mix-blend-multiply"
        />

        {/* Top Navigation */}
        <div className="absolute top-0 w-full px-6 py-8 z-10 flex items-center justify-between">
          <BackButton />
          <Link
            to="/role-selection"
            className="text-brand-text-primary font-bold text-lg hover:underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-text-primary rounded-md px-1"
            viewTransition
          >
            Register
          </Link>
        </div>

        {/* Header text */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 px-8 mt-28 mb-10 flex flex-col space-y-3"
        >
          <h1 className="text-[32px] font-bold text-brand-text-secondary">
            Welcome Back
          </h1>
          <p className="text-brand-text-secondary text-sm leading-relaxed max-w-[260px]">
            Login your account - enjoy exclusive features and many more.
          </p>
        </motion.div>

        {/* Bottom Form Card (Takes up remaining space) */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0, damping: 25, stiffness: 120 }}
          className="relative z-10 left-1/2 -translate-x-1/2 flex-1 lg:max-w-3/5 bg-linear-to-b from-brand-gradient-start to-brand-gradient-start/40 rounded-t-[40px] px-8 pt-10 pb-8 flex flex-col shadow-[0_-8px_20px_rgba(0,0,0,0.125)] backdrop-blur-sm"
        >
          <motion.form
            variants={formVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-xl mx-auto flex flex-col space-y-5 mt-4"
          >

            <div className="space-y-4">
              <motion.div variants={itemVariants}>
                <Input
                  type="email"
                  placeholder="Username/Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Entered value does not match email format"
                    }
                  })}
                  autoComplete="email"
                  className={`bg-brand-card/80 border ${errors.email ? 'border-brand-red' : 'border-brand-grey/50'} h-14 px-5 text-brand-text-secondary placeholder:text-brand-text-secondary/50 text-base focus-visible:ring-2 focus-visible:ring-brand-text-primary/20`}
                />
                {errors.email && <p className="text-brand-red text-xs mt-1 ml-2">{errors.email.message as string}</p>}
              </motion.div>

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
                  autoComplete="current-password"
                  className={`bg-brand-card/80 border ${errors.password ? 'border-brand-red' : 'border-brand-grey/50'} h-14 pl-5 pr-12 text-brand-text-secondary placeholder:text-brand-text-secondary/50 text-base focus-visible:ring-2 focus-visible:ring-brand-text-primary/20`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-dark-grey hover:text-brand-text-primary transition-colors focus:outline-none rounded-full p-1 focus-visible:ring-2 focus-visible:ring-brand-text-primary/40"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye className="w-[22px] h-[22px]" /> : <EyeOff className="w-[22px] h-[22px]" strokeWidth={1.5} />}
                </button>
                {errors.password && <p className="text-brand-red text-xs mt-1 ml-2 absolute -bottom-5 left-0">{errors.password.message as string}</p>}
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="flex items-center justify-between px-1 py-1">
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
                      className="border-brand-grey data-[state=checked]:bg-brand-secondary data-[state=checked]:text-white rounded-sm w-[18px] h-[18px]"
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

            <motion.div variants={itemVariants} className="pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-brand-background hover:bg-brand-card text-brand-text-primary border border-brand-grey/20 font-bold text-[17px] shadow-md transition-all focus-visible:ring-4 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent disabled:opacity-70 disabled:cursor-not-allowed"
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
                      Signing in...
                    </motion.div>
                  ) : (
                    <motion.span
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Login
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

export default LoginPage;
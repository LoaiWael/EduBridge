import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";
import type { PasswordChangeRequest } from "@/features/profile/types";

const settingsInputClassName = "bg-brand-background dark:bg-brand-background border border-brand-grey/50 text-brand-text-secondary placeholder:text-brand-text-secondary/50 text-base shadow-sm focus-visible:ring-2 focus-visible:ring-brand-primary";

const SettingsPasswordPage = () => {
  const navigate = useNavigate();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<PasswordChangeRequest & { confirmNewPassword: string }>();

  const newPassword = watch("newPassword", "");

  const changePassword = async (data: PasswordChangeRequest & { confirmNewPassword: string }) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log("Password change submitted for:", data);
  };

  const onSubmit = async (data: PasswordChangeRequest & { confirmNewPassword: string }) => {
    const promise = changePassword(data);
    toast.promise(promise, {
      loading: "Updating password...",
      success: () => {
        navigate(-1);
        return "Password updated successfully!";
      },
      error: "Failed to update password",
    });
    await promise;
  };

  useEffect(() => {
    document.title = "EduBridge - Password & Security";
  }, []);

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
            Password and Security
          </h1>
        </div>
      </div>

      <div className="px-6 pb-6 w-full max-w-4xl mx-auto flex flex-col gap-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-brand-card border border-brand-grey/20 p-6 sm:p-8 rounded-brand-card shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex flex-col">

          <div className="space-y-4 max-w-lg mb-4">
            {/* Current Password Input */}
            <div className="relative pt-1 space-y-2">
              <Label htmlFor="currentPassword" className="text-brand-text-secondary">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  {...register("currentPassword", {
                    required: "Current password is required",
                  })}
                  autoComplete="current-password"
                  className={`${settingsInputClassName} pr-12 ${errors.currentPassword ? 'border-brand-red' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-dark-grey hover:text-brand-text-primary transition-colors focus:outline-none rounded-full p-1 focus-visible:ring-2 focus-visible:ring-brand-text-primary/40"
                  aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                >
                  {showCurrentPassword ? <Eye className="w-[20px] h-[20px]" /> : <EyeOff className="w-[20px] h-[20px]" strokeWidth={1.5} />}
                </button>
              </div>
              {errors.currentPassword && <p className="text-brand-red text-xs mt-1 ml-2">{errors.currentPassword.message}</p>}
            </div>

            {/* New Password Input */}
            <div className="relative pt-3 space-y-2 border-t border-brand-grey/20">
              <Label htmlFor="newPassword" className="text-brand-text-secondary">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 6,
                      message: "Password must have at least 6 characters"
                    }
                  })}
                  autoComplete="new-password"
                  className={`${settingsInputClassName} pr-12 ${errors.newPassword ? 'border-brand-red' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-dark-grey hover:text-brand-text-primary transition-colors focus:outline-none rounded-full p-1 focus-visible:ring-2 focus-visible:ring-brand-text-primary/40"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <Eye className="w-[20px] h-[20px]" /> : <EyeOff className="w-[20px] h-[20px]" strokeWidth={1.5} />}
                </button>
              </div>
              {errors.newPassword && <p className="text-brand-red text-xs mt-1 ml-2">{errors.newPassword.message}</p>}
            </div>

            {/* Confirm Password Input */}
            <div className="relative pt-1 space-y-2">
              <Label htmlFor="confirmNewPassword" className="text-brand-text-secondary">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmNewPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  {...register("confirmNewPassword", {
                    required: "Please confirm your new password",
                    validate: value => value === newPassword || "Passwords do not match"
                  })}
                  autoComplete="new-password"
                  className={`${settingsInputClassName} pr-12 ${errors.confirmNewPassword ? 'border-brand-red' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-brand-dark-grey hover:text-brand-text-primary transition-colors focus:outline-none rounded-full p-1 focus-visible:ring-2 focus-visible:ring-brand-text-primary/40"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <Eye className="w-[20px] h-[20px]" /> : <EyeOff className="w-[20px] h-[20px]" strokeWidth={1.5} />}
                </button>
              </div>
              {errors.confirmNewPassword && <p className="text-brand-red text-xs mt-1 ml-2">{errors.confirmNewPassword.message}</p>}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between pt-4 border-t border-brand-grey/20">
            <button
              type="button"
              onClick={() => navigate('/forget-password', { viewTransition: true })}
              className="text-sm font-medium text-brand-text-secondary hover:text-brand-text-primary hover:underline underline-offset-4 focus:outline-none rounded-sm focus-visible:ring-2 focus-visible:ring-brand-primary/40 transition-colors"
            >
              Forgot your password?
            </button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 bg-brand-primary text-brand-text-primary hover:opacity-90 font-semibold focus-visible:ring-offset-2 focus-visible:ring-brand-primary h-11 disabled:opacity-25 cursor-pointer"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default SettingsPasswordPage;

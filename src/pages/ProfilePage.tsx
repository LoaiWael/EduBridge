import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/features/profile/store/useProfileStore";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const ProfilePage = () => {
  const shouldReduceMotion = useReducedMotion();
  const { firstName, lastName, setFirstName, setLastName } = useProfileStore();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    setValue("firstName", firstName);
    setValue("lastName", lastName);
  }, [firstName, lastName, setValue]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setFirstName(data.firstName);
    setLastName(data.lastName);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
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
      <title>EduBridge - Profile</title>
      <div className="min-h-screen w-full bg-brand-background pb-24">
        {/* Header */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-6 py-8"
        >
          <h1 className="text-[32px] font-bold text-brand-text-primary">
            Profile
          </h1>
          <p className="text-brand-text-secondary text-sm mt-1">
            Manage your personal information
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-6 bg-white rounded-3xl p-6 shadow-brand-card"
        >
          <motion.form
            variants={formVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-5"
          >
            {/* First Name */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Label
                htmlFor="firstName"
                className="text-sm font-semibold text-brand-text-primary"
              >
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                {...register("firstName", {
                  required: "First name is required",
                })}
                className={`bg-[#F3F6FB]/80 border ${
                  errors.firstName ? "border-brand-red" : "border-0"
                } h-12 px-4 text-brand-text-primary placeholder:text-brand-text-secondary/60 text-base focus-visible:ring-2 focus-visible:ring-brand-text-primary/20`}
              />
              {errors.firstName && (
                <p className="text-brand-red text-xs ml-1">
                  {errors.firstName.message as string}
                </p>
              )}
            </motion.div>

            {/* Last Name */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Label
                htmlFor="lastName"
                className="text-sm font-semibold text-brand-text-primary"
              >
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="Enter your last name"
                {...register("lastName", {
                  required: "Last name is required",
                })}
                className={`bg-[#F3F6FB]/80 border ${
                  errors.lastName ? "border-brand-red" : "border-0"
                } h-12 px-4 text-brand-text-primary placeholder:text-brand-text-secondary/60 text-base focus-visible:ring-2 focus-visible:ring-brand-text-primary/20`}
              />
              {errors.lastName && (
                <p className="text-brand-red text-xs ml-1">
                  {errors.lastName.message as string}
                </p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-brand-secondary hover:bg-brand-secondary/90 text-white font-bold text-base shadow-md transition-all focus-visible:ring-4 focus-visible:ring-brand-secondary/30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </>
  );
};

export default ProfilePage;
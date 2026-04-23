import { useForm } from "react-hook-form";
import { useState } from "react";
import { X, Plus } from "lucide-react";
import { type UserSkill } from "@/features/profile/types";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "@/features/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuthStore } from "@/features/auth";

const settingsInputClassName = "bg-brand-background dark:bg-brand-background border border-brand-grey/50 focus-visible:ring-brand-primary focus-visible:ring-2";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  major: string;
  university: string;
  githubUrl?: string;
  linkedInUrl?: string;
  skills: UserSkill[];
  department?: string;
  academicTitle?: string;
  officeLocation?: string;
  maxSlots?: number;
}

const SettingsProfilePage = () => {
  const navigate = useNavigate();
  const {
    role,
    firstName,
    lastName,
    email,
    bio,
    major,
    university,
    githubUrl,
    linkedInUrl,
    skills,
    department,
    academicTitle,
    officeLocation,
    maxSlots,
    setFirstName,
    setLastName,
    setEmail,
    setBio,
    setMajor,
    setUniversity,
    setGithubUrl,
    setLinkedInUrl,
    setSkills,
    setDepartment,
    setAcademicTitle,
    setOfficeLocation,
    setMaxSlots,
  } = useProfileStore();

  const [skillInput, setSkillInput] = useState("");
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<ProfileFormData>({
    defaultValues: {
      firstName,
      lastName,
      email,
      bio,
      major,
      university,
      githubUrl,
      linkedInUrl,
      skills: skills || [],
      department,
      academicTitle,
      officeLocation: officeLocation as string | undefined,
      maxSlots,
    }
  });

  const watchSkills = watch("skills");

  const addSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill) {
      if (watchSkills.some(s => s.name.toLowerCase() === trimmedSkill.toLowerCase())) {
        setSkillInput("");
        return;
      }

      const newSkill: UserSkill = {
        id: `${trimmedSkill.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        name: trimmedSkill
      };
      setValue("skills", [...watchSkills, newSkill]);
      setSkillInput("");
    }
  };

  const removeSkill = (id: string) => {
    setValue("skills", watchSkills.filter(s => s.id !== id));
  };

  const saveProfile = async (data: ProfileFormData) => {
    await new Promise(resolve => setTimeout(resolve, 600));

    setFirstName(data.firstName);
    setLastName(data.lastName);
    setEmail(data.email);
    setBio(data.bio);
    setMajor(data.major);
    setUniversity(data.university);
    if (data.githubUrl !== undefined) setGithubUrl(data.githubUrl);
    if (data.linkedInUrl !== undefined) setLinkedInUrl(data.linkedInUrl);
    setSkills(data.skills);

    if (role === 'ta') {
      if (data.department) setDepartment(data.department);
      if (data.academicTitle) setAcademicTitle(data.academicTitle);
      if (data.officeLocation) setOfficeLocation(data.officeLocation);
      if (data.maxSlots) setMaxSlots(data.maxSlots);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    const promise = saveProfile(data);
    toast.promise(promise, {
      loading: "Saving changes...",
      success: () => {
        const currentUserId = useAuthStore.getState().id;
        navigate(`/bridge/${currentUserId}`, { viewTransition: true });
        return "Profile updated successfully!";
      },
      error: "Failed to save profile",
    });
    await promise;
  };

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
            Profile Settings
          </h1>
        </div>
      </div>

      <div className="px-6 pb-6 w-full max-w-4xl mx-auto flex flex-col gap-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-brand-card border border-brand-grey/20 p-6 sm:p-8 rounded-brand-card shadow-[0_2px_16px_rgba(0,0,0,0.06)]">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-brand-text-secondary">First Name</Label>
              <Input
                id="firstName"
                {...register("firstName", { required: "First name is required" })}
                className={`${settingsInputClassName} ${errors.firstName ? 'border-brand-red' : ''}`}
              />
              {errors.firstName && <p className="text-brand-red text-xs">{errors.firstName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-brand-text-secondary">Last Name</Label>
              <Input
                id="lastName"
                {...register("lastName", { required: "Last name is required" })}
                className={`${settingsInputClassName} ${errors.lastName ? 'border-brand-red' : ''}`}
              />
              {errors.lastName && <p className="text-brand-red text-xs">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-brand-text-secondary">Email Address</Label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
              })}
              className={`${settingsInputClassName} ${errors.email ? 'border-brand-red' : ''}`}
            />
            {errors.email && <p className="text-brand-red text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-brand-text-secondary">Bio / Tagline</Label>
            <Input
              id="bio"
              placeholder="A short description about yourself"
              {...register("bio")}
              className={settingsInputClassName}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="university" className="text-brand-text-secondary">University</Label>
              <Input
                id="university"
                {...register("university", { required: "University is required" })}
                className={`${settingsInputClassName} ${errors.university ? 'border-brand-red' : ''}`}
              />
              {errors.university && <p className="text-brand-red text-xs">{errors.university.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="major" className="text-brand-text-secondary">Major / Field of Study</Label>
              <Input
                id="major"
                {...register("major", { required: "Major is required" })}
                className={`${settingsInputClassName} ${errors.major ? 'border-brand-red' : ''}`}
              />
              {errors.major && <p className="text-brand-red text-xs">{errors.major.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-2 border-b border-brand-grey/20 sm:pb-6">
            <div className="space-y-2">
              <Label htmlFor="githubUrl" className="text-brand-text-secondary">GitHub URL <span className="opacity-50 text-xs">(Optional)</span></Label>
              <Input
                id="githubUrl"
                placeholder="https://github.com/..."
                {...register("githubUrl")}
                className={settingsInputClassName}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedInUrl" className="text-brand-text-secondary">LinkedIn URL <span className="opacity-50 text-xs">(Optional)</span></Label>
              <Input
                id="linkedInUrl"
                placeholder="https://linkedin.com/in/..."
                {...register("linkedInUrl")}
                className={settingsInputClassName}
              />
            </div>
          </div>

          <div className="space-y-3 pb-2 border-b border-brand-grey/20 sm:pb-6">
            <Label htmlFor="skills" className="text-brand-text-secondary">Skills <span className="opacity-50 text-xs">(Optional)</span></Label>

            <div className="flex flex-wrap gap-2 mb-3">
              {watchSkills.length > 0 ? (
                watchSkills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    layoutId={skill.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/10 text-brand-pink border border-brand-pink/20 rounded-full text-sm font-medium group transition-colors hover:bg-brand-pink/20"
                  >
                    <span>{skill.name}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill.id)}
                      className="p-0.5 rounded-full hover:bg-brand-pink/20 transition-colors"
                      aria-label={`Remove ${skill.name}`}
                    >
                      <X className="size-3" />
                    </button>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-brand-text-secondary/50 italic py-1">No skills added yet</p>
              )}
            </div>

            <div className="relative flex items-center">
              <Input
                id="skills-input"
                placeholder="Add a skill (e.g. React, UI/UX...)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  } else if (e.key === ",") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                className={`${settingsInputClassName} pr-12`}
              />
              <button
                type="button"
                onClick={addSkill}
                disabled={!skillInput.trim()}
                className="absolute right-2 p-2 text-brand-primary hover:bg-brand-primary/10 rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <Plus className="size-5" />
              </button>
            </div>

            <p className="text-xs text-brand-text-secondary/60">
              Press Enter or use commas to add skills. These will showcase your expertise on your profile.
            </p>
          </div>

          {role === 'ta' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pt-2">
              <h3 className="text-lg font-semibold text-brand-text-primary">TA Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-brand-text-secondary">Department</Label>
                  <Input
                    id="department"
                    {...register("department", { required: "Department is required for TAs" })}
                    className={`${settingsInputClassName} ${errors.department ? 'border-brand-red' : ''}`}
                  />
                  {errors.department && <p className="text-brand-red text-xs">{errors.department.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academicTitle" className="text-brand-text-secondary">Academic Title</Label>
                  <Input
                    id="academicTitle"
                    placeholder="e.g. Teaching Assistant, Professor"
                    {...register("academicTitle")}
                    className={settingsInputClassName}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="officeLocation" className="text-brand-text-secondary">Office Location</Label>
                  <Input
                    id="officeLocation"
                    {...register("officeLocation")}
                    className={settingsInputClassName}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxSlots" className="text-brand-text-secondary">Max Supervision Slots</Label>
                  <Input
                    id="maxSlots"
                    type="number"
                    {...register("maxSlots", {
                      valueAsNumber: true,
                      min: { value: 1, message: "Must be at least 1" }
                    })}
                    className={`${settingsInputClassName} ${errors.maxSlots ? 'border-brand-red' : ''}`}
                  />
                  {errors.maxSlots && <p className="text-brand-red text-xs">{errors.maxSlots.message}</p>}
                </div>
              </div>
            </motion.div>
          )}

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 bg-brand-primary text-brand-text-primary hover:opacity-90 font-semibold focus-visible:ring-offset-2 focus-visible:ring-brand-primary h-11 disabled:opacity-25 cursor-pointer"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default SettingsProfilePage;

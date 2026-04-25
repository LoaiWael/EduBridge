import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { X, Plus, Users, Book, Building, Calendar, Info, ShieldCheck, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export interface CreateTeamFormData {
  name: string;
  description: string;
  subject: string;
  department: string;
  academicYear: string;
  maxMembers: number;
  requiredRoles: string[];
}

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTeamFormData) => void;
}

export function CreateTeamModal({ isOpen, onClose, onSubmit }: CreateTeamModalProps) {
  const [roles, setRoles] = useState<string[]>([]);
  const [roleInput, setRoleInput] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateTeamFormData>({
    defaultValues: {
      maxMembers: 5
    }
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset({ maxMembers: 5 });
      setRoles([]);
      setRoleInput("");
    }
  }, [isOpen, reset]);

  const handleAddRole = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();

    const trimmed = roleInput.trim();
    if (trimmed && !roles.includes(trimmed)) {
      setRoles([...roles, trimmed]);
      setRoleInput("");
    }
  };

  const removeRole = (roleToRemove: string) => {
    setRoles(roles.filter(r => r !== roleToRemove));
  };

  const onFormSubmit = async (data: CreateTeamFormData) => {
    const creationPromise = new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        onSubmit({ ...data, requiredRoles: roles });
        resolve(true);
      }, 1500);
    });

    toast.promise(creationPromise, {
      loading: "Launching your team...",
      success: () => {
        onClose();
        return "Team created successfully!";
      },
      error: "Failed to create team. Please try again.",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-background/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full h-full sm:h-auto sm:max-w-2xl bg-brand-card sm:rounded-[2em] shadow-[0_30px_100px_rgba(0,0,0,0.25)] border-brand-grey/10 overflow-hidden flex flex-col sm:max-h-[90dvh]"
          >
            <div className="p-8 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-primary/10 rounded-2xl">
                  <ShieldCheck className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-brand-text-primary tracking-tight">Establish New Team</h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-brand-grey/10 rounded-full transition-colors text-brand-text-secondary hover:text-brand-text-primary"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 px-8 pb-8 overflow-y-auto min-h-0 custom-scrollbar">
              <form id="create-team-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 pt-2">

                {/* Team Identity Section */}
                <div className="space-y-4">
                  <div className="relative">
                    <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-brand-text-secondary mb-2 block ml-1">Team Name</Label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary/40" />
                      <input
                        id="name"
                        placeholder="e.g., Quantum Synergy"
                        {...register("name", { required: "Team name is required" })}
                        className="w-full bg-brand-background border border-brand-grey h-14 pl-12 rounded-2xl focus-visible:ring-brand-primary/20 text-brand-text-primary font-bold"
                      />
                    </div>
                    {errors.name && <p className="text-brand-red text-[10px] font-bold mt-1 ml-2 uppercase tracking-wider">{errors.name.message}</p>}
                  </div>

                  <div className="relative">
                    <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-brand-text-secondary mb-2 block ml-1">Project Objective</Label>
                    <textarea
                      id="description"
                      placeholder="Briefly explain your project goals..."
                      {...register("description", { required: "Description is required" })}
                      className="w-full bg-brand-background border border-brand-grey min-h-[100px] p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-brand-text-primary font-medium text-sm resize-none"
                    />
                    {errors.description && <p className="text-brand-red text-[10px] font-bold mt-1 ml-2 uppercase tracking-wider">{errors.description.message}</p>}
                  </div>
                </div>

                {/* Academic Context Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-xs font-black uppercase tracking-widest text-brand-text-secondary mb-2 block ml-1">Academic Subject</Label>
                    <div className="relative">
                      <Book className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary/40" />
                      <input
                        id="subject"
                        placeholder="Advanced SWE"
                        {...register("subject")}
                        className=" w-full bg-brand-background border border-brand-grey h-12 pl-10 rounded-xl focus-visible:ring-brand-primary/20 text-brand-text-primary font-bold text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="academicYear" className="text-xs font-black uppercase tracking-widest text-brand-text-secondary mb-2 block ml-1">Academic Level</Label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary/40" />
                      <input
                        id="academicYear"
                        placeholder="Final Year"
                        {...register("academicYear")}
                        className="w-full bg-brand-background border border-brand-grey h-12 pl-10 rounded-xl focus-visible:ring-brand-primary/20 text-brand-text-primary font-bold text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-xs font-black uppercase tracking-widest text-brand-text-secondary mb-2 block ml-1">Faculty / Dept</Label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary/40" />
                      <input
                        id="department"
                        placeholder="Computer Science"
                        {...register("department")}
                        className="w-full bg-brand-background border border-brand-grey h-12 pl-10 rounded-xl focus-visible:ring-brand-primary/20 text-brand-text-primary font-bold text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxMembers" className="text-xs font-black uppercase tracking-widest text-brand-text-secondary mb-2 block ml-1">Max Slots (Capacity)</Label>
                    <div className="relative">
                      <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary/40" />
                      <input
                        id="maxMembers"
                        type="number"
                        min={1}
                        max={10}
                        {...register("maxMembers", { valueAsNumber: true })}
                        className="w-full bg-brand-background border border-brand-grey h-12 pl-10 rounded-xl focus-visible:ring-brand-primary/20 text-brand-text-primary font-bold text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Role Management Section */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs font-black uppercase tracking-widest text-brand-text-secondary block ml-1">Searching For Roles</Label>
                      <p className="text-[10px] text-brand-text-secondary/60 ml-1">Press Enter to add multiple roles</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-bold border-brand-primary/20 text-brand-primary">{roles.length} Roles</Badge>
                  </div>

                  <div className="flex flex-wrap min-h-[40px] bg-brand-background rounded-2xl border border-brand-grey">
                    <AnimatePresence>
                      {roles.map(role => (
                        <motion.div
                          key={role}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-1.5 bg-brand-card px-3 py-1.5 rounded-full border border-brand-pink/20 shadow-sm m-2"
                        >
                          <span className="text-[10px] font-bold text-brand-text-primary uppercase tracking-tight">{role}</span>
                          <button
                            type="button"
                            onClick={() => removeRole(role)}
                            className="p-0.5 hover:bg-brand-red/10 rounded-full text-brand-red transition-colors"
                          >
                            <X size={10} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <input
                      type="text"
                      value={roleInput}
                      onChange={(e) => setRoleInput(e.target.value)}
                      onKeyDown={handleAddRole}
                      placeholder={roles.length === 0 ? "Add skill or role (e.g. Frontend Specialist)" : ""}
                      className="flex-1 p-4 bg-transparent border-none outline-none text-xs text-brand-text-primary font-medium min-w-[120px]"
                    />
                  </div>
                </div>

                <div className="p-4 bg-brand-secondary/5 rounded-2xl border border-dashed border-brand-secondary/20 flex gap-3">
                  <Info className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
                  <p className="text-[11px] text-brand-text-secondary leading-relaxed font-medium">
                    As the creator, you will be assigned as the <span className="font-bold text-brand-pink underline underline-offset-2 italic">Team Leader</span>.
                    You can manage members and supervision requests once the group is formed.
                  </p>
                </div>

              </form>
            </div>

            {/* Sticky Actions */}
            <div className="p-8 pt-4 border-t border-brand-grey/10 flex flex-wrap items-center justify-end gap-4 bg-brand-card/80 backdrop-blur-md">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-xs font-black uppercase tracking-widest text-brand-text-secondary hover:text-brand-text-primary transition-colors"
              >
                Cancel
              </button>
              <Button
                type="submit"
                form="create-team-form"
                className="h-14 px-10 bg-linear-to-tr from-brand-secondary to-brand-pink text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Launch Team
                <Plus className="ml-2 w-4 h-4" strokeWidth={3} />
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

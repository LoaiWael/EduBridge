import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, UserCheck, Info } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

import { useAuthStore } from "@/features/auth";
import { type SupervisionRequest } from "../types";
import { ProfileAvatar } from "@/features/profile";
import { Input } from "@/components/ui/input";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import usersData from "@/data/users.json";

interface SupervisionRequestOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  teamName: string;
}

export const SupervisionRequestOverlay = ({ isOpen, onClose, teamId, teamName }: SupervisionRequestOverlayProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { users: registeredUsers, id: currentUserId, updateUserNotifications, updateUserSupervisionRequests } = useAuthStore();

  // Combine registered and fake users (TA role only)
  // React Compiler handles memoization automatically
  const usersMap = new Map();
  // Add fake users
  usersData.forEach(u => {
    if (u.id !== currentUserId && u.role === 'ta') {
      usersMap.set(u.id, { ...u, isFake: true });
    }
  });
  // Add/Overwrite with registered users
  registeredUsers.forEach(u => {
    if (u.id !== currentUserId && u.role === 'ta') {
      usersMap.set(u.id, {
        ...u.profile,
        id: u.id,
        role: u.role,
        email: u.email,
        isFake: false
      });
    }
  });
  const allTAs = Array.from(usersMap.values());

  const filteredUsers = allTAs.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.major?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.university?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRequestSupervision = (user: any) => {
    if (user.isFake) {
      toast.info(`Supervision request sent to ${user.firstName} (Simulation)`, {
        description: "This is a demo TA. No real notification was sent."
      });
      return;
    }

    // Real registered user logic
    const registeredUser = registeredUsers.find(u => u.id === user.id);
    if (registeredUser) {
      const currentUser = registeredUsers.find(u => u.id === currentUserId);
      const newNotification = {
        id: `notif-ta-${Date.now()}`,
        userId: registeredUser.id,
        message: `A team named "${teamName}" has requested you to be their supervisor.`,
        isRead: false,
        type: 'TaRequestReceived' as const,
        relatedEntityId: teamId,
        createdAt: new Date(),
        sender: {
          id: currentUserId || '',
          name: `${currentUser?.profile.firstName || 'A team leader'} ${currentUser?.profile.lastName || ''}`,
          imageUrl: currentUser?.profile.profileImageUrl
        }
      };

      const newRequest: SupervisionRequest = {
        id: `sup-req-${Date.now()}`,
        studentId: currentUserId || '',
        supervisorId: registeredUser.id,
        projectId: teamId,
        status: 'pending',
        createdAt: new Date()
      };

      const updatedNotifs = [...(registeredUser.notifications || []), newNotification];
      const updatedRequests = [...(registeredUser.supervisionRequests || []), newRequest];

      updateUserNotifications(registeredUser.id, updatedNotifs);
      updateUserSupervisionRequests(registeredUser.id, updatedRequests);

      toast.success(`Supervision request sent to TA ${user.firstName}!`);
    } else {
      toast.error("TA not found in registration data.");
    }
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full h-full sm:h-auto sm:max-w-2xl bg-brand-background sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col sm:max-h-[90dvh]"
          >
            {/* Header */}
            <div className="px-6 pt-8 pb-4 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-brand-grey/20 rounded-full transition-colors"
                  aria-label="Close overlay"
                >
                  <ChevronLeft size={28} className="text-brand-text-primary" />
                </button>
                <h2 className="text-2xl font-black text-brand-text-primary uppercase tracking-tight text-brand-blue">Request Supervision</h2>
              </div>

              {/* Search Bar */}
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-text-secondary group-focus-within:text-brand-primary transition-colors" size={20} />
                <Input
                  placeholder="Search TAs by name, major, or expertise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 py-7 bg-brand-grey/10 border-none rounded-[24px] focus-visible:ring-2 focus-visible:ring-brand-primary/50 text-base placeholder:text-brand-text-secondary/60"
                />
              </div>
            </div>

            {/* TA List */}
            <div className="flex-1 overflow-y-auto px-6 pb-10 space-y-5 hide-scrollbar">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <TooltipProvider key={user.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-brand-card rounded-[32px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-brand-grey/10 flex items-center gap-4 group hover:shadow-xl transition-all"
                    >
                      <ProfileAvatar
                        name={user.firstName}
                        imageUrl={user.profileImageUrl}
                        className="w-16 h-16 rounded-2xl bg-brand-grey shrink-0 border-2 border-brand-blue/20"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-bold text-brand-text-primary text-lg truncate">
                            {user.firstName} {user.lastName}
                          </h3>
                        </div>
                        <p className="text-xs text-brand-text-secondary font-medium tracking-tight truncate">
                          TA • {user.major} • {user.university}
                        </p>

                        <div className="mt-3 flex items-center gap-2">
                          <Link
                            to={`/bridge/${user.id}`}
                            className="px-4 py-1.5 bg-brand-primary/10 hover:bg-brand-primary text-brand-text-primary rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            View Profile
                          </Link>
                        </div>
                      </div>

                      <Tooltip delayDuration={200}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleRequestSupervision(user)}
                            disabled={registeredUsers.find(u => u.id === user.id)?.notifications?.some(n => n.type === 'TaRequestReceived' && n.relatedEntityId === teamId)}
                            className="p-3 bg-brand-primary text-white rounded-2xl hover:scale-110 hover:opacity-75 active:scale-95 transition-all shadow-md disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed"
                            aria-label={`Request ${user.firstName} ${user.lastName} as supervisor`}
                          >
                            <UserCheck size={22} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={8}>
                          <p>{registeredUsers.find(u => u.id === user.id)?.notifications?.some(n => n.type === 'TaRequestReceived' && n.relatedEntityId === teamId) ? "Request already sent" : "Request TA"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </motion.div>
                  </TooltipProvider>
                ))
              ) : (
                <div className="py-20 text-center space-y-3">
                  <div className="w-16 h-16 bg-brand-grey/10 rounded-full flex items-center justify-center mx-auto">
                    <Search className="text-brand-text-secondary/40" size={24} />
                  </div>
                  <p className="text-brand-text-secondary font-medium italic">No TAs found matching "{searchQuery}"</p>
                </div>
              )}
            </div>

            {/* Hint - Bottom area */}
            < div className="p-6 bg-brand-blue/5 border-t border-brand-grey/10" >
              <div className="flex items-start gap-3 text-[10px] text-brand-text-secondary leading-relaxed">
                <Info size={14} className="mt-0.5 shrink-0 text-brand-blue" />
                <p>Teaching Assistants will receive a notification to review your project. They can then choose to accept or decline the supervision role.</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

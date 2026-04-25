import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, UserPlus, Info } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

import { useAuthStore } from "@/features/auth";
import { ProfileAvatar } from "@/features/profile";
import { Input } from "@/components/ui/input";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import usersData from "@/data/users.json";

interface InviteMemberOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  teamName: string;
}

export const InviteMemberOverlay = ({ isOpen, onClose, teamId, teamName }: InviteMemberOverlayProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { users: registeredUsers, id: currentUserId, updateUserNotifications } = useAuthStore();

  // Combine registered and fake users (Students only)
  const allUsers = useMemo(() => {
    const usersMap = new Map();
    // Add fake users
    usersData.forEach(u => {
      if (u.id !== currentUserId && u.role === 'student') {
        usersMap.set(u.id, { ...u, isFake: true });
      }
    });
    // Add/Overwrite with registered users
    registeredUsers.forEach(u => {
      if (u.id !== currentUserId && u.role === 'student') {
        usersMap.set(u.id, {
          ...u.profile,
          id: u.id,
          role: u.role,
          email: u.email,
          isFake: false
        });
      }
    });
    return Array.from(usersMap.values());
  }, [registeredUsers, currentUserId]);

  const filteredUsers = useMemo(() => {
    return allUsers.filter(user =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.major?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.university?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allUsers, searchQuery]);

  const handleInvite = (user: any) => {
    if (user.isFake) {
      toast.info(`Invitation sent to ${user.firstName} (Simulation)`, {
        description: "This is a demo user. No real notification was sent."
      });
      return;
    }

    // Real registered user logic
    const registeredUser = registeredUsers.find(u => u.id === user.id);
    if (registeredUser) {
      const currentUser = registeredUsers.find(u => u.id === currentUserId);
      const newNotification = {
        id: `notif-inv-${Date.now()}`,
        userId: registeredUser.id,
        message: `You have been invited to join the team: ${teamName}`,
        isRead: false,
        type: 'InvitationReceived' as const,
        relatedEntityId: teamId,
        createdAt: new Date(),
        sender: {
          id: currentUserId || '',
          name: `${currentUser?.profile.firstName || 'A leader'} ${currentUser?.profile.lastName || ''}`,
          imageUrl: currentUser?.profile.profileImageUrl
        }
      };

      const updatedNotifs = [...(registeredUser.notifications || []), newNotification];
      updateUserNotifications(registeredUser.id, updatedNotifs);

      toast.success(`Invitation sent to ${user.firstName}!`);
    } else {
      toast.error("User not found in local storage.");
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
                <h2 className="text-2xl font-black text-brand-text-primary uppercase tracking-tight">Invite Member</h2>
              </div>

              {/* Search Bar */}
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-text-secondary group-focus-within:text-brand-primary transition-colors" size={20} />
                <Input
                  placeholder="Search by name, major, or university..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 py-7 bg-brand-grey/10 border-none rounded-[24px] focus-visible:ring-2 focus-visible:ring-brand-primary/50 text-base placeholder:text-brand-text-secondary/60"
                />
              </div>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto px-6 pb-10 space-y-5 hide-scrollbar">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <TooltipProvider>
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-brand-card rounded-[32px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-brand-grey/10 flex items-center gap-4 group hover:shadow-xl transition-all"
                    >
                      <ProfileAvatar
                        name={user.firstName}
                        imageUrl={user.profileImageUrl}
                        className="w-16 h-16 rounded-2xl bg-brand-grey shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-bold text-brand-text-primary text-lg truncate">
                            {user.firstName} {user.lastName}
                          </h3>
                        </div>
                        <p className="text-xs text-brand-text-secondary font-medium tracking-tight truncate">
                          {user.major} • {user.university}
                        </p>

                        <div className="mt-3 flex items-center gap-2">
                          <Link
                            to={`/bridge/${user.id}`}
                            className="px-4 py-1.5 bg-brand-primary/10 hover:bg-brand-primary text-brand-text-primary rounded-full text-[10px] font-black uppercase tracking-widest transition-all" viewTransition
                          >
                            View Profile
                          </Link>
                        </div>
                      </div>

                      <Tooltip delayDuration={200}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleInvite(user)}
                            className="p-3 bg-brand-primary text-brand-text-primary rounded-2xl hover:scale-110 hover:opacity-75 active:scale-95 transition-all shadow-md"
                            aria-label={`Invite ${user.firstName} ${user.lastName} to team`}
                          >
                            <UserPlus size={22} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={8}>
                          <p>Invite to team</p>
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
                  <p className="text-brand-text-secondary font-medium italic">No students found matching "{searchQuery}"</p>
                </div>
              )}
            </div>

            {/* User Hint - Bottom area */}
            < div className="p-6 bg-brand-primary/5 border-t border-brand-grey/10" >
              <div className="flex items-start gap-3 text-[10px] text-brand-text-secondary leading-relaxed">
                <Info size={14} className="mt-0.5 shrink-0 text-brand-primary" />
                <p>Invitations will notify users immediately. You can only invite students who are not already in a team (Simulation logic applied).</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

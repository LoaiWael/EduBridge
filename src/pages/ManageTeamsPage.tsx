import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, type Variants, useReducedMotion } from "framer-motion";
import { Users, XCircle } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/features/auth";
import { type Team } from "@/features/teams";
import { type AppNotification } from "@/features/notifications";
import { useProfileStore, ProfileAvatar } from "@/features/profile";
import BackButton from "@/components/BackButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";

const ManageTeamsPage = () => {
  const shouldReduceMotion = useReducedMotion();
  const currentUserId = useAuthStore(state => state.id);
  const users = useAuthStore(state => state.users);
  const updateUserNotifications = useAuthStore(state => state.updateUserNotifications);
  const updateUserMyTeams = useAuthStore(state => state.updateUserMyTeams);

  const profile = useProfileStore();
  const displayName = `${profile.firstName} ${profile.lastName}`;

  const [isLoading, setIsLoading] = useState(true);
  const [supervisedTeams, setSupervisedTeams] = useState<Team[]>([]);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    const loadSupervisedTeams = async () => {
      setIsLoading(true);
      // Simulate network delay for brand consistency
      await new Promise(resolve => setTimeout(resolve, 800));

      if (currentUserId) {
        // Aggregate supervised teams from all registered users
        const allTeams = users.reduce((acc, user) => {
          return [...acc, ...(user.myTeams || [])];
        }, [] as Team[]);

        // Filter where current user is the TA and enrich leader info
        const teams = allTeams.filter(team => team.taId === currentUserId).map(team => {
          const leaderUser = users.find(u => u.id === team.leaderId);
          return {
            ...team,
            leader: leaderUser ? {
              id: leaderUser.id,
              firstName: leaderUser.profile.firstName,
              lastName: leaderUser.profile.lastName,
              email: leaderUser.email,
              role: leaderUser.role,
            } : team.leader
          };
        });

        // Unique by ID
        const unique = Array.from(new Map(teams.map(t => [t.id, t])).values());
        setSupervisedTeams(unique);
      }
      setIsLoading(false);
    };

    loadSupervisedTeams();
  }, [currentUserId, users]);

  useEffect(() => {
    document.title = "EduBridge - Manage Teams";
  }, []);

  const handleLeaveSupervision = (team: Team) => {
    if (!currentUserId) return;

    toast.warning(`Are you sure you want to stop supervising "${team.name}"?`, {
      description: "The team will be left without a supervisor.",
      action: {
        label: "Confirm",
        onClick: () => executeLeave(team)
      },
      cancel: {
        label: "Cancel",
        onClick: () => { }
      }
    });
  };

  const executeLeave = async (team: Team) => {
    setIsProcessing(team.id);

    const leavePromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // 1. Update Leader Data: Remove TA from their team object
          const leader = users.find(u => u.id === team.leaderId);
          if (leader) {
            const updatedLeaderTeams = (leader.myTeams || []).map(t => {
              if (t.id === team.id) {
                return { ...t, taId: undefined };
              }
              return t;
            });
            updateUserMyTeams(leader.id, updatedLeaderTeams);

            // Notify Leader
            const notification: AppNotification = {
              id: `notif-leave-${Date.now()}`,
              userId: leader.id,
              message: `TA ${profile.firstName} has left the supervision of your team "${team.name}".`,
              isRead: false,
              type: 'TaLeftSupervision',
              relatedEntityId: team.id,
              createdAt: new Date(),
              sender: {
                id: currentUserId!,
                name: displayName,
                imageUrl: profile.profileImageUrl
              }
            };
            updateUserNotifications(leader.id, [...(leader.notifications || []), notification]);
          }

          // 2. Update TA Data: Remove team from current TA's list
          const currentUserObj = users.find(u => u.id === currentUserId);
          if (currentUserObj) {
            const updatedTaTeams = (currentUserObj.myTeams || []).filter(t => t.id !== team.id);
            updateUserMyTeams(currentUserId!, updatedTaTeams);
          }

          resolve(true);
        } catch (error) {
          reject(error);
        } finally {
          setIsProcessing(null);
        }
      }, 1500);
    });

    toast.promise(leavePromise, {
      loading: `Leaving supervision of "${team.name}"...`,
      success: `You have successfully left "${team.name}"`,
      error: "Failed to process request. Please try again."
    });
  };

  const listItemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.3
      }
    })
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen w-full bg-linear-to-b from-brand-primary/20 via-brand-background to-brand-primary/10 pb-24 relative overflow-x-hidden pt-6">

        {/* Header */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-6 pb-8 flex flex-col gap-4"
        >
          <div className="flex items-center gap-5">
            <BackButton />
            <h1 className="text-[32px] font-bold text-brand-text-primary">
              Manage teams
            </h1>
          </div>
        </motion.div>

        <div className="lg:w-[80dvw] max-w-5xl mx-auto px-6 flex flex-col gap-8">

          {/* TA Info Card */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-brand-card rounded-3xl p-6 shadow-brand-card flex items-center gap-6 border border-brand-grey/20"
          >
            <ProfileAvatar
              imageUrl={profile.profileImageUrl}
              name={displayName}
              className="w-20 h-20 rounded-3xl shadow-sm"
            />
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-brand-text-primary leading-tight">{displayName}</h2>
              <div className="flex items-center gap-1.5 text-brand-text-secondary text-sm mt-1 font-medium">
                <span>Availability</span>
                <span className="text-brand-green font-bold">{supervisedTeams.length}/{profile.maxSlots || 6} Teams</span>
              </div>
            </div>
          </motion.div>

          {/* Teams List Content */}
          <div className="flex flex-col gap-5 pb-[100px]">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <div className="flex flex-col gap-5">
                  {[1, 2, 3].map((i) => (
                    <div key={`skeleton-${i}`} className="w-full bg-brand-card rounded-[28px] p-6 shadow-brand-card flex flex-col gap-4 border border-brand-grey/20">
                      <div className="flex justify-between">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                      <div className="flex justify-end pt-2">
                        <Skeleton className="h-10 w-40 rounded-brand-button" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : supervisedTeams.length > 0 ? (
                <div className="flex flex-col gap-5">
                  {supervisedTeams.map((team, index) => (
                    <motion.div
                      key={team.id}
                      custom={index}
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                      className="w-full bg-brand-card rounded-[28px] p-6 shadow-brand-card flex flex-col border border-brand-grey/20 relative group transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-col">
                          <h3 className="text-2xl font-black text-brand-text-primary tracking-tight">
                            {team.name}
                          </h3>
                          {team.status === 'Completed' && (
                            <span className="text-brand-green font-bold text-[10px] bg-brand-green/5 px-2 py-0.5 rounded-full border border-brand-green/10 w-fit mt-0.5">
                              Completed
                            </span>
                          )}
                        </div>
                        <Link
                          to={`/teams/${team.id}`}
                          className="text-xs font-semibold text-brand-text-primary underline decoration-brand-text-primary/30 hover:decoration-brand-text-primary transition-all pr-1 mt-1"
                        >
                          View details
                        </Link>
                      </div>

                      <div className="flex flex-col gap-1 text-brand-text-primary mb-5">
                        <div className="flex items-center gap-1.5 text-sm">
                          <span className="text-brand-text-secondary font-medium">Team leader :</span>
                          <span className="font-bold">{team.leader?.firstName} {team.leader?.lastName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <span className="text-brand-text-secondary font-medium">Subject :</span>
                          <span className="font-bold tracking-tight">{team.subject || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <span className="text-brand-text-secondary font-medium">Number of members :</span>
                          <span className="font-bold">{team.members.length}</span>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button
                          variant="outline"
                          onClick={() => handleLeaveSupervision(team)}
                          disabled={isProcessing === team.id}
                          className="border-brand-red text-brand-red hover:bg-brand-red/5 font-bold rounded-xl px-5 py-5 gap-2 transition-all active:scale-95 disabled:opacity-50"
                        >
                          <XCircle size={18} />
                          {isProcessing === team.id ? "Processing..." : "Leave Supervision"}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center w-full"
                >
                  <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="text-brand-primary w-10 h-10 opacity-40" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-text-primary mb-2">No supervised teams</h3>
                  <p className="text-brand-text-secondary max-w-xs mx-auto">
                    You are not currently supervising any teams. Teams will appear here once you accept supervision requests.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ManageTeamsPage;
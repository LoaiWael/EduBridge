import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Users } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/features/auth";
import { type Team, type JoinRequest } from "@/features/teams";
import { type AppNotification } from "@/features/notifications";
import BackButton from "@/components/BackButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from "@/components/ui/tooltip";

const TaTeamsPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const users = useAuthStore(state => state.users);
  const currentUserId = useAuthStore(state => state.id);
  const updateUserNotifications = useAuthStore(state => state.updateUserNotifications);
  const updateUserJoinRequests = useAuthStore(state => state.updateUserJoinRequests);

  const [isLoading, setIsLoading] = useState(true);
  const [taTeams, setTaTeams] = useState<Team[]>([]);
  const [taName, setTaName] = useState("");
  const [requestingTeamId, setRequestingTeamId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate network delay for brand consistency
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (userId) {
        const taUser = users.find(u => u.id === userId);
        if (taUser) {
          setTaName(`${taUser.profile.firstName} ${taUser.profile.lastName}`);

          // Aggregate all teams from all users' myTeams and filter for those assigned to this TA
          const allTeams = users.reduce((acc, user) => {
            return [...acc, ...(user.myTeams || [])];
          }, [] as Team[]);

          // Filter teams where this user is the TA and enrich with leader info
          const supervisedTeams = allTeams.filter(team => team.taId === userId).map(team => {
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

          // Ensure uniqueness (though there shouldn't be duplicates in this simplified local model)
          const uniqueTeamsMap = new Map<string, Team>();
          supervisedTeams.forEach(team => uniqueTeamsMap.set(team.id, team));

          setTaTeams(Array.from(uniqueTeamsMap.values()));
        }
      }
      setIsLoading(false);
    };

    loadData();
  }, [userId, users]);

  useEffect(() => {
    if (taName) {
      document.title = `EduBridge - ${taName}'s Teams`;
    }
  }, [taName]);

  const handleRequestToJoin = async (team: Team) => {
    if (!currentUserId) {
      toast.error("You must be logged in to join a team");
      return;
    }

    const currentUser = users.find(u => u.id === currentUserId);
    if (!currentUser) return;

    // 1. Find the leader
    const leader = users.find(u => u.id === team.leaderId);
    if (!leader) {
      toast.error("Could not find team leader");
      return;
    }

    // 2. Check if a request already exists
    const hasAlreadyRequested = leader.joinRequests?.some(r => r.teamId === team.id && r.studentId === currentUserId);
    if (hasAlreadyRequested) {
      toast.info("You already sent a join request to this team");
      return;
    }

    setRequestingTeamId(team.id);

    const requestProcess = new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        try {
          // 3. Create the Join Request entity
          const newJoinRequest: JoinRequest = {
            id: `req-${Date.now()}`,
            teamId: team.id,
            studentId: currentUserId,
            student: {
              id: currentUserId,
              firstName: currentUser.profile.firstName,
              lastName: currentUser.profile.lastName,
              email: currentUser.email,
              role: currentUser.role
            },
            status: 'Pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          // 4. Create notification for leader
          const newNotification: AppNotification = {
            id: `notif-${Date.now()}`,
            userId: leader.id,
            message: `${currentUser.profile.firstName} ${currentUser.profile.lastName} requested to join your team "${team.name}"`,
            isRead: false,
            type: 'JoinRequestReceived',
            relatedEntityId: team.id,
            createdAt: new Date(),
            sender: {
              id: currentUserId,
              name: `${currentUser.profile.firstName} ${currentUser.profile.lastName}`,
              imageUrl: currentUser.profile.profileImageUrl
            }
          };

          // 5. Update Leader Data
          const updatedLeaderNotifications = [...(leader.notifications || []), newNotification];
          const updatedLeaderRequests = [...(leader.joinRequests || []), newJoinRequest];

          updateUserNotifications(leader.id, updatedLeaderNotifications);
          updateUserJoinRequests(leader.id, updatedLeaderRequests);

          // 6. Update Student Data (Track their own requests)
          const updatedStudentRequests = [...(currentUser.joinRequests || []), newJoinRequest];
          updateUserJoinRequests(currentUserId, updatedStudentRequests);

          resolve(true);
        } catch (error) {
          reject(error);
        } finally {
          setRequestingTeamId(null);
        }
      }, 1500);
    });

    toast.promise(requestProcess, {
      loading: "Transmitting your request...",
      success: `Request sent to ${leader.profile.firstName}`,
      error: "Transmission failed. Please try again."
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
          variants={listItemVariants}
          initial="hidden"
          animate="visible"
          className="px-6 pb-6 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between relative mt-4">
            <div className="absolute left-0 z-10 w-fit">
              <BackButton />
            </div>
            <h1 className="text-2xl font-bold text-center w-full z-0 text-brand-text-primary">
              {taName} Teams
            </h1>
          </div>
        </motion.div>

        {/* Teams List Content */}
        <div className="lg:w-[80dvw] max-w-7xl mx-auto px-6 flex flex-col items-center gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 lg:items-stretch lg:px-10 pb-[100px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="contents">
                <div className="contents">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={`skeleton-${i}`} className="w-full bg-brand-card rounded-[24px] p-5 shadow-brand-card flex flex-col gap-4 border border-brand-grey/20">
                      <div className="flex justify-between">
                        <Skeleton className="h-7 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[90%]" />
                      </div>
                      <div className="flex justify-end mt-auto pt-2">
                        <Skeleton className="h-9 w-28 rounded-brand-button" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : taTeams.length > 0 ? (
              <div className="contents">
                {taTeams.map((team, index) => (
                  <motion.div
                    key={team.id}
                    custom={index}
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                    layout
                    className="w-full bg-brand-card rounded-[24px] p-5 shadow-brand-card flex flex-col border border-brand-grey/20 relative group transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-bold text-brand-text-primary truncate pr-2">
                        {team.name}
                      </h2>
                      <Link
                        to={`/teams/${team.id}`}
                        className="text-xs font-semibold text-brand-text-primary underline decoration-brand-text-primary/30 hover:decoration-brand-text-primary transition-all"
                      >
                        View details
                      </Link>
                    </div>

                    <div className="grow flex flex-col gap-1 text-brand-text-primary mb-4">
                      <p className="text-sm">
                        <span className="text-brand-text-secondary">Team leader : </span>
                        <span className="font-medium">{team.leader?.firstName} {team.leader?.lastName}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-brand-text-secondary">Subject : </span>
                        <span className="font-bold tracking-tight">{team.subject || "N/A"}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-brand-text-secondary">Number of members : </span>
                        <span className="font-medium">{team.members.length}</span>
                      </p>
                    </div>

                    <div className="w-full border-t border-border border-dashed my-2"></div>

                    <div className="flex justify-end items-center pt-2">
                      {team.status === 'Completed' ? (
                        <span className="text-brand-green font-bold text-sm py-2 px-1">Completed</span>
                      ) : team.members.some(m => m.userId === currentUserId) ? (
                        <span className="text-brand-text-secondary bg-brand-grey/30 rounded-xl font-bold text-sm py-2 px-3">You're in this team!</span>
                      ) : users.find(u => u.id === currentUserId)?.joinRequests?.some(r => r.teamId === team.id && r.status === 'Pending') ? (
                        <span className="text-brand-text-secondary bg-brand-grey/30 rounded-xl font-bold text-sm py-2 px-3">Request Sent</span>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => handleRequestToJoin(team)}
                              disabled={requestingTeamId === team.id}
                              className="bg-brand-green hover:bg-brand-green/90 text-white font-bold rounded-brand-input-alt px-5 py-2.5 h-auto text-sm shadow-sm transform active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                              {requestingTeamId === team.id ? "Sending..." : "Request to join"}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-brand-card border-brand-grey/20 text-brand-text-primary">
                            <p>Send a join request to the leader</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="col-span-full py-20 text-center w-full">
                <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="text-brand-primary w-10 h-10 opacity-40" />
                </div>
                <h3 className="text-xl font-bold text-brand-text-primary mb-2">No active teams</h3>
                <p className="text-brand-text-secondary max-w-xs mx-auto">
                  {taName || "This TA"} is not currently supervising any active teams.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TaTeamsPage;

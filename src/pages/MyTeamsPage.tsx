import { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Plus, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useTeamStore, type Team } from "@/features/teams";
import { useAuthStore } from "@/features/auth";
import { useProfileStore } from "@/features/profile";
import BackButton from "@/components/BackButton";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import teamsData from "@/data/teams.json";

const MyTeamsPage = () => {
  const navigate = useNavigate();
  const role = useProfileStore(state => state.role);
  const currentUserId = useAuthStore(state => state.id);
  const { teams, setTeams } = useTeamStore();

  const [isLoading, setIsLoading] = useState(true);

  // Filter teams where user is member or leader
  const userTeams = teams.filter(team =>
    team.leaderId === currentUserId ||
    team.members.some(member => member.userId === currentUserId)
  );

  // Seed mock data if empty
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate network delay for perceived performance matching IdeasLibPage
      await new Promise(resolve => setTimeout(resolve, 800));

      if (teams.length === 0) {
        setTeams(teamsData as Team[]);
      }
      setIsLoading(false);
    };

    loadData();
  }, [teams.length, setTeams]);

  useEffect(() => {
    document.title = "EduBridge - Your Teams";
  }, []);

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

  const skeletonVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const skeletonItemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const fabVariants: Variants = {
    initial: { scale: 1, opacity: 1 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.5
      }
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen w-full bg-linear-to-b from-brand-primary/20 via-brand-background to-brand-primary/10 pb-24 relative overflow-x-hidden pt-6">

        {/* Header - EXACT MATCH to IdeasLibPage */}
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
              Your Teams
            </h1>
          </div>
        </motion.div>

        {/* Teams List Content - Grid MATCH to IdeasLibPage */}
        <div className="lg:w-[80dvw] max-w-7xl mx-auto px-6 flex flex-col items-center gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 lg:items-stretch lg:px-10 pb-[100px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="contents">
                <motion.div
                  variants={skeletonVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="contents"
                >
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <motion.div
                      key={`skeleton-${i}`}
                      variants={skeletonItemVariants}
                      className="w-full bg-brand-card rounded-3xl p-5 shadow-brand-card flex flex-col"
                    >
                      <Skeleton className="h-7 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-[90%] mb-3" />
                      <div className="flex justify-end mt-auto">
                        <Skeleton className="h-9 w-28 rounded-brand-input" />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            ) : userTeams.length > 0 ? (
              <div className="contents">
                {userTeams.map((team, index) => (
                  <motion.div
                    key={team.id}
                    custom={index}
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                    layout
                    className="w-full bg-brand-card rounded-[24px] p-5 shadow-brand-card flex flex-col border border-brand-grey/20 relative"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-bold text-brand-text-primary truncate pr-2">
                        {team.name}
                      </h2>
                      <Badge variant="secondary" className={`text-[10px] font-bold uppercase tracking-widest rounded-lg px-2 ${team.status === 'Open' ? 'text-brand-green bg-brand-green/10 border border-brand-green/20' :
                        team.status === 'Full' ? 'text-brand-pink bg-brand-pink/10 border border-brand-pink/20' :
                          'text-brand-secondary bg-brand-secondary/10 border border-brand-secondary/20'
                        }`}>
                        {team.status}
                      </Badge>
                    </div>

                    <div className="grow mb-4">
                      <p className="text-brand-text-secondary text-sm leading-snug line-clamp-3">
                        {team.description || "Project description goes here..."}
                      </p>
                    </div>

                    <div className="w-full border-t border-border border-dashed my-2"></div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-brand-text-secondary/60">
                        <Users size={14} />
                        <span className="text-xs font-semibold">{team.members.length} / {team.maxMembers}</span>
                      </div>
                      <Link
                        to={`/teams/${team.id}`}
                        viewTransition
                        className="bg-linear-to-b from-brand-primary to-brand-pink text-brand-text-primary text-sm font-semibold px-5 py-2.5 flex items-center justify-center rounded-brand-button hover:opacity-90 active:scale-95 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                      >
                        View details
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full flex flex-col items-center justify-center py-24 text-center w-full"
              >
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Users className="text-brand-primary w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-brand-text-primary mb-2">No teams joined yet</h3>
                <p className="text-brand-text-secondary max-w-xs mx-auto mb-8">
                  You haven't joined any teams yet. Browse the community or create your own project.
                </p>
                <Button
                  onClick={() => navigate('/teams', { viewTransition: true })}
                  className="bg-brand-primary text-brand-text-primary font-bold rounded-brand-button px-8 hover:opacity-90 transition-opacity"
                >
                  Explore Teams
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Premium FAB - Create Team */}
        {role === 'student' && (
          <div className="fixed bottom-10 right-10 z-50">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  variants={fabVariants}
                  initial="initial"
                  animate="animate"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/my-teams?create=true', { viewTransition: true })}
                  className="bg-linear-to-tr from-brand-secondary to-brand-pink p-5 rounded-3xl text-white shadow-[0_15px_30px_rgba(0,0,0,0.2)] hover:opacity-90 transition-all flex items-center gap-3 active:translate-y-1 group"
                >
                  <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
                  <span className="font-bold uppercase tracking-widest text-xs pr-2">Create New Team</span>
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-brand-card border-brand-pink/20 text-brand-text-primary font-bold">
                <p>Start a new project</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default MyTeamsPage;

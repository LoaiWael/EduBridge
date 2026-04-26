import { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { UserCheck, UserX, Clock, ClipboardList, Info } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

import { useAuthStore } from "@/features/auth";
import { type Team } from "@/features/teams";
import BackButton from "@/components/BackButton";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const SupervisionRequestsPage = () => {
  const users = useAuthStore(state => state.users);
  const currentUserId = useAuthStore(state => state.id);
  const acceptRequest = useAuthStore(state => state.acceptSupervisionRequest);
  const rejectRequest = useAuthStore(state => state.rejectSupervisionRequest);

  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Get current user's requests directly (React Compiler handles memoization)
  const currentUser = users.find(u => u.id === currentUserId);
  const requests = currentUser?.supervisionRequests || [];

  // Aggregate all teams directly
  const allTeams = users.reduce((acc, user) => {
    return [...acc, ...(user.myTeams || [])];
  }, [] as Team[]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.title = "EduBridge - Supervision Requests";
  }, []);

  const handleAccept = async (requestId: string, teamName: string) => {
    setProcessingId(requestId);
    const process = new Promise((resolve) => {
      setTimeout(() => {
        acceptRequest(requestId);
        resolve(true);
        setProcessingId(null);
      }, 1500);
    });

    toast.promise(process, {
      loading: `Accepting supervision for "${teamName}"...`,
      success: `You are now supervising "${teamName}"`,
      error: "Failed to accept request"
    });
  };

  const handleReject = async (requestId: string, teamName: string) => {
    setProcessingId(requestId);
    const process = new Promise((resolve) => {
      setTimeout(() => {
        rejectRequest(requestId);
        resolve(true);
        setProcessingId(null);
      }, 1200);
    });

    toast.promise(process, {
      loading: `Declining request for "${teamName}"...`,
      success: `Request for "${teamName}" declined`,
      error: "Failed to decline request"
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
    <div className="min-h-screen w-full bg-linear-to-b from-brand-primary/10 via-brand-background to-brand-primary/5 pb-24 relative overflow-x-hidden pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pb-8 flex flex-col gap-4"
      >
        <div className="flex items-center justify-between relative mt-4">
          <div className="absolute left-0 z-10 w-fit">
            <BackButton />
          </div>
          <h1 className="text-3xl font-black text-center w-full z-0 text-brand-text-primary uppercase tracking-tight">
            Supervision <span className="text-brand-primary">Requests</span>
          </h1>
        </div>
        <p className="text-brand-text-secondary text-center max-w-md mx-auto text-sm font-medium">
          Manage incoming requests from team leaders looking for a project supervisor.
        </p>
      </motion.div>

      {/* Content */}
      <div className="lg:w-[85dvw] max-w-7xl mx-auto px-6 flex flex-col gap-6 lg:grid lg:grid-cols-2 xl:grid-cols-3 pb-[100px]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="contents">
              {[1, 2, 3].map((i) => (
                <div key={`skeleton-${i}`} className="w-full bg-brand-card rounded-[32px] p-6 shadow-brand-card flex flex-col gap-4 border border-brand-grey/10">
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-2/3 rounded-full" />
                    <Skeleton className="h-4 w-20 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[80%]" />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-10 flex-1 rounded-2xl" />
                    <Skeleton className="h-10 flex-1 rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : requests.length > 0 ? (
            requests.map((request, index) => {
              const team = allTeams.find(t => t.id === request.projectId);
              const leader = users.find(u => u.id === request.studentId);

              if (!team || !leader) return null;

              return (
                <motion.div
                  key={request.id}
                  custom={index}
                  variants={listItemVariants}
                  initial="hidden"
                  animate="visible"
                  layout
                  className={`w-full bg-brand-card rounded-[32px] p-6 shadow-brand-card flex flex-col border transition-all relative overflow-hidden group ${request.status === 'pending' ? 'border-brand-primary/20 shadow-brand-primary/5' : 'border-brand-grey/10 opacity-70'
                    }`}
                >
                  {/* Status Badge */}
                  <div className="absolute top-6 right-2 px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest bg-brand-grey/10 text-brand-text-secondary flex items-center gap-1.5">
                    {request.status === 'pending' && <Clock size={12} className="text-brand-blue" />}
                    {request.status === 'approved' && <UserCheck size={12} className="text-brand-green" />}
                    {request.status === 'rejected' && <UserX size={12} className="text-brand-red" />}
                    {request.status}
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xl font-black text-brand-text-primary truncate pr-16 leading-tight">
                      {team.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full uppercase">
                        {team.subject || "Project"}
                      </span>
                    </div>
                  </div>

                  <div className="grow space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold overflow-hidden border border-brand-blue/20">
                        {leader.profile.profileImageUrl ? (
                          <img src={leader.profile.profileImageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          leader.profile.firstName[0]
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] text-brand-text-secondary uppercase font-black tracking-widest leading-none mb-0.5">Leader</p>
                        <p className="text-sm font-bold text-brand-text-primary leading-tight">
                          {leader.profile.firstName} {leader.profile.lastName}
                        </p>
                      </div>
                    </div>

                    <div className="bg-brand-grey/5 rounded-2xl p-3 border border-brand-grey/10">
                      <div className="flex items-start gap-2">
                        <ClipboardList size={14} className="text-brand-text-secondary mt-0.5 shrink-0" />
                        <div className="text-xs text-brand-text-secondary leading-normal">
                          <span className="font-bold text-brand-text-primary block mb-1">Request Notes:</span>
                          {request.notes || "No additional notes provided for this supervision request."}
                        </div>
                      </div>
                    </div>
                  </div>

                  {request.status === 'pending' ? (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleReject(request.id, team.name)}
                        variant="ghost"
                        disabled={processingId === request.id}
                        className="flex-1 bg-brand-red/10 hover:bg-brand-red hover:text-white text-brand-red font-black text-[10px] uppercase tracking-widest rounded-2xl py-6 transition-all disabled:opacity-50"
                      >
                        {processingId === request.id ? "Declining..." : "Decline"}
                      </Button>
                      <Button
                        onClick={() => handleAccept(request.id, team.name)}
                        disabled={processingId === request.id}
                        className="flex-1 bg-brand-primary hover:scale-[1.02] text-white font-black text-[10px] uppercase tracking-widest rounded-2xl py-6 transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50"
                      >
                        {processingId === request.id ? "Accepting..." : "Accept"}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-2 px-4 bg-brand-grey/10 rounded-2xl italic text-xs text-brand-text-secondary font-medium">
                      Request has been {request.status}
                    </div>
                  )}

                  <Link
                    to={`/teams/${team.id}`}
                    className="mt-4 text-center text-[10px] font-black uppercase tracking-widest text-brand-text-secondary hover:text-brand-primary transition-colors flex items-center justify-center gap-1.5 group/link"
                  >
                    View Team Details
                    <Info size={12} className="group-hover/link:animate-pulse" />
                  </Link>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full py-24 text-center w-full flex flex-col items-center">
              <div className="w-24 h-24 bg-brand-primary/5 rounded-full flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-brand-primary/20 animate-[spin_10s_linear_infinite]" />
                <Clock className="text-brand-primary/30 w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-brand-text-primary mb-3 uppercase tracking-tight">No pending requests</h3>
              <p className="text-brand-text-secondary max-w-xs mx-auto text-sm font-medium italic">
                You don't have any supervision requests at the moment. Teams you are supervising will appear in your management dashboard.
              </p>
              <Link
                to="/manage-teams"
                className="mt-10 px-8 py-3 bg-brand-card border border-brand-primary/20 text-brand-primary font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-brand-primary hover:text-white transition-all shadow-xl"
              >
                Manage My Teams
              </Link>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SupervisionRequestsPage;
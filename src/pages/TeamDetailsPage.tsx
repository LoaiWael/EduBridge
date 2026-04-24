import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { toast } from "sonner";
import {
  FileText,
  Plus,
  LogOut,
  Trash2,
  Book,
  Building,
  Calendar,
  ShieldCheck,
  Download,
  FileCode,
  UserCheck,
  Users,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import { useTeamStore, type Team, type JoinRequest } from "@/features/teams";
import { useIdeasStore } from "@/features/ideas";
import { useAuthStore } from "@/features/auth";
import { useProfileStore, ProfileAvatar } from "@/features/profile";
import { ChatbotButton } from "@/features/chatbot";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

import teamsData from "@/data/teams.json";
import ideasData from "@/data/ideas.json";
import usersData from "@/data/users.json";

const TeamDetailsPage = () => {
  const { id: teamId } = useParams();
  const navigate = useNavigate();

  // Stores
  const { teams, setTeams, currentTeam, setCurrentTeam, removeTeam, removeMember } = useTeamStore();
  const { ideas, setIdeas } = useIdeasStore();
  const { id: currentUserId, users: registeredUsers, updateUserJoinRequests } = useAuthStore();
  const { role: currentUserRole } = useProfileStore();

  const [isRequesting, setIsRequesting] = useState(false);

  // Load initial data if stores are empty
  useEffect(() => {
    if (teams.length === 0) setTeams(teamsData as Team[]);
    if (ideas.length === 0) setIdeas(ideasData);
  }, [teams.length, ideas.length, setTeams, setIdeas]);

  // Sync current team based on ID
  useEffect(() => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      setCurrentTeam(team);
      document.title = `EduBridge - ${team.name}`;
    }
  }, [teamId, teams, setCurrentTeam]);

  // Combined user data from local storage and json
  const allUsers = (() => {
    const usersMap = new Map();
    usersData.forEach(u => usersMap.set(u.id, u));
    registeredUsers.forEach(u => {
      usersMap.set(u.id, { ...u.profile, id: u.id, role: u.role });
    });
    return Array.from(usersMap.values());
  })();

  const currentUser = registeredUsers.find(u => u.id === currentUserId);

  // Hydrate team data
  const teamDetails = (() => {
    if (!currentTeam) return null;

    const idea = ideas.find(i => i.id === currentTeam.ideaId);

    const hydratedMembers = currentTeam.members.map(member => ({
      ...member,
      user: allUsers.find(u => u.id === member.userId)
    }));

    const ta = allUsers.find(u => u.id === currentTeam.taId);
    const leader = allUsers.find(u => u.id === currentTeam.leaderId);

    return {
      ...currentTeam,
      idea,
      hydratedMembers,
      ta,
      leader
    };
  })();

  const isMember = currentTeam?.members.some(m => m.userId === currentUserId);
  const isLeader = currentTeam?.leaderId === currentUserId;

  const hasPendingRequest = currentUser?.joinRequests?.some(req => req.teamId === teamId && req.status === "Pending");
  const isTeamFull = teamDetails?.status === "Full";

  const handleRequestToJoin = async () => {
    if (!currentUserId || !currentTeam || isTeamFull || hasPendingRequest) return;

    setIsRequesting(true);

    try {
      const newRequest: JoinRequest = {
        id: `req-${Date.now()}`,
        teamId: currentTeam.id,
        studentId: currentUserId,
        status: "Pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedRequests = [...(currentUser?.joinRequests || []), newRequest];
      updateUserJoinRequests(currentUserId, updatedRequests);

      toast.success(`Request to join ${currentTeam.name} sent!`, {
        description: "The team leader will review your request."
      });
    } catch (error) {
      toast.error("Failed to send request. Please try again.");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDisbandTeam = () => {
    if (confirm("Are you sure you want to disband this team?")) {
      removeTeam(currentTeam!.id);
      toast.success("Team disbanded successfully");
      navigate("/teams", { viewTransition: true });
    }
  };

  const handleLeaveTeam = () => {
    if (confirm("Are you sure you want to leave this team?")) {
      const member = currentTeam?.members.find(m => m.userId === currentUserId);
      if (member) {
        removeMember(currentTeam!.id, member.id);
        toast.success("You have left the team");
        navigate("/teams", { viewTransition: true });
      }
    }
  };

  const staggerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const statusBadgeColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-brand-green/10 text-brand-green border-brand-green/20";
      case "Partial": return "bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20";
      case "Full": return "bg-brand-pink/10 text-brand-pink border-brand-pink/20";
      default: return "bg-brand-grey/10 text-brand-text-secondary border-brand-grey/20";
    }
  };

  if (!teamDetails) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-brand-background">
        <h1 className="text-xl font-bold text-brand-text-primary">Team not found.</h1>
        <Link to="/teams" viewTransition className="text-brand-primary mt-4 hover:underline font-medium">Return to Teams</Link>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen w-full bg-linear-to-b from-brand-primary/15 via-brand-background to-brand-primary/5 pb-24 relative overflow-x-hidden pt-6">

        {/* Top Header */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="px-6 mb-2">
          <BackButton />
        </motion.div>

        <motion.div
          className="lg:w-[85dvw] max-w-7xl mx-auto px-6 lg:px-10 flex flex-col gap-10 pb-[100px]"
          variants={staggerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Enhanced Team Hero Card */}
          <motion.div
            variants={fadeUpVariants}
            className="w-full rounded-[36px] overflow-hidden p-8 bg-linear-to-br from-brand-primary/80 to-brand-pink/60 relative shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
          >
            <div className="absolute sm:top-0 sm:right-0 -top-4 -right-3 p-8">
              <Badge className={`px-4 py-1.5 rounded-full text-xs font-bold border ${statusBadgeColor(teamDetails.status)}`}>
                {teamDetails.status}
              </Badge>
            </div>

            <div className="relative z-10 text-brand-text-primary">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl">
                  <Users className="text-brand-text-primary w-6 h-6" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">{teamDetails.name}</h1>
              </div>
              <p className="text-brand-text-primary/80 text-lg leading-relaxed max-w-3xl mb-6">
                {teamDetails.description || teamDetails.idea?.description || "Developing core features for EduBridge."}
              </p>
              <div className="flex items-center gap-4 text-xs font-bold text-brand-text-primary/60 uppercase tracking-widest">
                <span>Created {new Date(teamDetails.createdAt).toLocaleDateString()}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
                <span>{teamDetails.members.length} / {teamDetails.maxMembers} Members</span>
              </div>
            </div>

            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50"></div>
          </motion.div>

          {/* Optimized Team Members Section */}
          <motion.div variants={fadeUpVariants} className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-brand-text-primary">The Team</h2>
                <div className="px-2 py-0.5 bg-brand-text-primary/10 rounded-lg text-brand-text-primary text-xs font-bold">
                  {teamDetails.members.length}
                </div>
              </div>
              {isLeader && (
                <Button size="sm" className="bg-brand-primary text-brand-text-primary font-bold rounded-2xl gap-2 transition-opacity hover:opacity-80">
                  <Plus size={18} />
                  Invite
                </Button>
              )}
            </div>

            <div className="flex overflow-x-auto gap-6 pb-6 snap-x hide-scrollbar">
              <AnimatePresence>
                {teamDetails.hydratedMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="min-w-[280px] bg-brand-card rounded-[32px] p-6 shadow-xl border border-brand-grey/10 snap-start shrink-0 relative"
                  >
                    {member.role === 'Leader' && (
                      <div className="absolute top-4 right-4">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <ShieldCheck size={20} className="text-brand-pink" />
                            </TooltipTrigger>
                            <TooltipContent>Team Leader</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}

                    <div className="flex flex-col items-center gap-4 text-center">
                      <ProfileAvatar
                        name={member.user?.firstName}
                        imageUrl={member.user?.profileImageUrl}
                        className="w-20 h-20 rounded-3xl bg-brand-grey shadow-inner scale-110"
                      />
                      <div className="space-y-1">
                        <h3 className="font-bold text-brand-text-primary text-lg leading-tight truncate px-2">
                          {member.user?.firstName} {member.user?.lastName}
                        </h3>
                        <p className="text-xs text-brand-pink font-bold uppercase tracking-wider">
                          {member.user?.major || 'Software Engineering'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-brand-grey/20 flex flex-col gap-3">
                      <div className="flex items-center justify-center gap-2">
                        <Badge variant="secondary" className={`text-[10px] ${member.role === 'Leader' ? 'text-brand-pink bg-brand-pink/20 border border-brand-pink' : 'text-brand-text-primary bg-brand-secondary/20 border border-brand-secondary'} uppercase font-black tracking-tighter rounded-lg px-2.5`}>
                          {member.role}
                        </Badge>
                      </div>
                      <Link
                        to={`/bridge/${member.userId}`}
                        viewTransition
                        className="w-full text-center bg-brand-primary py-2.5 rounded-2xl text-brand-text-primary font-black text-xs uppercase tracking-widest transition-opacity hover:opacity-80 shadow-sm"
                      >
                        View Profile
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Metadata Info Card */}
            <motion.div variants={fadeUpVariants} className="lg:col-span-12 xl:col-span-5 bg-brand-card rounded-[32px] p-8 shadow-xl border border-brand-grey/10">
              <h3 className="text-xl font-black text-brand-text-primary mb-6">Quick Details</h3>
              <div className="space-y-5">
                {[
                  { icon: Book, label: "Subject", value: teamDetails.subject || teamDetails.idea?.title },
                  { icon: Building, label: "Department", value: teamDetails.department || teamDetails.ta?.department || teamDetails.leader?.major },
                  { icon: Calendar, label: "Academic Year", value: teamDetails.academicYear || "Final Year" }
                ].filter(item => item.value).map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-3xl bg-brand-grey/5 border border-brand-grey/10 group">
                    <div className="p-3 bg-brand-primary/10 rounded-2xl">
                      <item.icon className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-brand-text-secondary tracking-widest leading-none mb-1">{item.label}</span>
                      <span className="font-bold text-brand-text-primary text-base">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Teaching Assistant Section */}
            <motion.div variants={fadeUpVariants} className="lg:col-span-12 xl:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-brand-text-primary">Supervisor</h2>
                {isLeader && !teamDetails.ta && (
                  <Button size="sm" className="bg-brand-green/10 text-brand-green border border-brand-green/20 hover:bg-brand-green hover:text-white rounded-2xl px-4 py-1.5 font-bold transition-all shadow-none">
                    Request supervisor
                  </Button>
                )}
              </div>

              {teamDetails.ta ? (
                <div className="bg-brand-card rounded-[32px] p-6 shadow-xl border border-brand-grey/10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
                  <ProfileAvatar
                    name={teamDetails.ta.firstName}
                    imageUrl={teamDetails.ta.profileImageUrl}
                    className="w-24 h-24 rounded-3xl bg-brand-grey shadow-inner shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                      <UserCheck size={18} className="text-brand-green" />
                      <span className="text-[10px] font-bold text-brand-green uppercase tracking-widest">Faculty Advisor</span>
                    </div>
                    <h3 className="font-black text-brand-text-primary text-2xl mb-1 truncate leading-none">
                      {teamDetails.ta.firstName} {teamDetails.ta.lastName}
                    </h3>
                    <p className="text-sm text-brand-text-secondary font-bold mb-4">
                      {teamDetails.ta.department || 'Academic Professional'}
                    </p>
                    <Link to={`/bridge/${teamDetails.ta.id}`} viewTransition className="inline-flex items-center gap-2 bg-brand-primary text-brand-text-primary font-black text-[10px] px-4 py-2.5 rounded-2xl transition-opacity hover:opacity-80 uppercase tracking-wide">
                      View Profile
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="py-12 px-6 bg-brand-grey/5 rounded-[32px] border border-dashed border-brand-grey/20 text-center">
                  <p className="text-brand-text-secondary font-medium mb-2 italic">Awaiting supervisor assignment</p>
                  {currentUserRole === 'ta' && (
                    <Button className="mt-2 bg-brand-secondary text-white font-bold rounded-xl px-6 hover:opacity-80">Provide Supervision</Button>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Optimized Documents Grid */}
          {teamDetails.documents && teamDetails.documents.length > 0 && (
            <motion.div variants={fadeUpVariants} className="space-y-6">
              <h2 className="text-2xl font-black text-brand-text-primary">Shared Assets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamDetails.documents.map(doc => (
                  <div key={doc.id} className="bg-brand-card rounded-[28px] p-5 shadow-lg border border-brand-grey/10 flex items-center justify-between group">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className={`p-3 rounded-2xl ${doc.type === 'pdf' ? 'bg-brand-red/10 text-brand-red' : 'bg-brand-secondary/10 text-brand-secondary'}`}>
                        {doc.type === 'pdf' ? <FileText size={24} /> : <FileCode size={24} />}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-brand-text-primary text-sm truncate pr-2">{doc.name}</span>
                        <span className="text-[10px] text-brand-text-secondary font-black uppercase tracking-tight italic">{doc.size} • {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button className="bg-brand-grey/10 p-2.5 rounded-xl transition-opacity hover:opacity-70 shrink-0">
                      <Download size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* required Members with Badge Design */}
          {teamDetails.requiredMembers && teamDetails.requiredMembers.length > 0 && (
            <motion.div variants={fadeUpVariants} className="space-y-6 bg-brand-pink/5 p-8 rounded-[36px] border border-brand-pink/10">
              <div className="flex items-center gap-3">
                <Plus size={24} className="text-brand-pink" />
                <h2 className="text-2xl font-black text-brand-text-primary italic">Searching For...</h2>
              </div>
              <div className="flex flex-wrap gap-4">
                {teamDetails.requiredMembers.map(role => (
                  <Badge key={role} className="bg-brand-card px-5 py-2.5 rounded-2xl shadow-sm border border-brand-pink/20 text-brand-text-primary font-black text-xs uppercase tracking-widest transition-transform cursor-default">
                    {role}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}

          {/* Contextual Actions with Improved Hierarchy */}
          <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-brand-grey/20">
            {!isMember && currentUserRole !== 'ta' && (
              <Button
                onClick={handleRequestToJoin}
                disabled={isRequesting || hasPendingRequest || isTeamFull}
                className={`w-full sm:w-auto px-10 font-black py-7 rounded-[24px] shadow-lg border-b-4 transition-all text-sm uppercase tracking-widest flex items-center gap-2 ${hasPendingRequest
                    ? "bg-brand-green text-white border-brand-green/60"
                    : isTeamFull
                      ? "bg-brand-grey text-brand-text-secondary border-brand-grey/60 cursor-not-allowed"
                      : "bg-brand-primary text-brand-text-primary border-brand-primary/60 hover:opacity-90 active:translate-y-0.5"
                  }`}
              >
                {hasPendingRequest ? (
                  <>
                    <CheckCircle2 size={20} />
                    Request Sent
                  </>
                ) : isTeamFull ? (
                  <>
                    <AlertCircle size={20} />
                    Team Full
                  </>
                ) : isRequesting ? (
                  "Sending..."
                ) : (
                  "Request to Join"
                )}
              </Button>
            )}

            {isLeader && (
              <Button
                variant="ghost"
                className="text-brand-red font-black text-xs uppercase tracking-widest px-6 rounded-2xl gap-2 hover:opacity-80 hover:bg-transparent"
                onClick={handleDisbandTeam}
              >
                <Trash2 size={16} />
                Disband Organization
              </Button>
            )}

            {isMember && !isLeader && (
              <Button
                variant="ghost"
                className="text-brand-red font-black text-xs uppercase tracking-widest px-6 rounded-2xl gap-2 hover:opacity-80 hover:bg-transparent"
                onClick={handleLeaveTeam}
              >
                <LogOut size={16} />
                Leave Organization
              </Button>
            )}
          </motion.div>

        </motion.div>

        {/* Floating Chatbot Button */}
        {currentUserRole !== 'ta' && (
          <div className="fixed bottom-10 right-10 z-50">
            <ChatbotButton />
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default TeamDetailsPage;

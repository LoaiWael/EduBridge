import { useEffect } from "react"
import { toast } from "sonner"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useIdeasStore } from "@/features/ideas"
import { useTeamStore, type Team } from "@/features/teams"
import { useProfileStore, ProfileAvatar } from "@/features/profile"
import { ChatbotButton } from "@/features/chatbot"
import BackButton from "@/components/BackButton"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { FileText, Network, GraduationCap, Calendar, File, FileCheck, Download, ExternalLink, Bookmark } from "lucide-react"
import teamsData from "@/data/teams.json"
import ideasData from "@/data/ideas.json"
import usersData from "@/data/users.json"

// Mock documents for demo purposes
const MOCK_DOCUMENTS = [
  {
    id: "d1",
    name: "Project Proposal.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadedAt: "2026-03-15",
  },
  {
    id: "d2",
    name: "Technical Specification.docx",
    type: "doc",
    size: "1.1 MB",
    uploadedAt: "2026-03-20",
  },
  {
    id: "d3",
    name: "Architecture Diagram.png",
    type: "image",
    size: "3.2 MB",
    uploadedAt: "2026-03-22",
  },
]

const MOCK_TEAMS = teamsData as Team[]

const IdeaDetailsPage = () => {
  const { id: ideaId } = useParams()
  const role = useProfileStore(state => state.role)

  const ideas = useIdeasStore(state => state.ideas)
  const setIdeas = useIdeasStore(state => state.setIdeas)
  const idea = ideas.find(i => i.id === ideaId)

  const teams = useTeamStore(state => state.teams)
  const setTeams = useTeamStore(state => state.setTeams)

  const isBookmarked = useIdeasStore(state => state.savedIdeaIds.includes(ideaId || ""))
  const toggleSaveIdea = useIdeasStore(state => state.toggleSaveIdea)

  // Find the team currently assigned to this idea and hydrate with user info
  const rawTeam = teams.find(t => t.ideaId === ideaId)
  const associatedTeam = rawTeam ? {
    ...rawTeam,
    members: rawTeam.members.map(member => ({
      ...member,
      user: usersData.find(u => u.id === member.userId)
    })),
    // @ts-ignore - for demo purposes
    ta: usersData.find(u => u.id === rawTeam.taId)
  } : null

  useEffect(() => {
    if (ideas.length === 0) {
      setIdeas(ideasData)
    }
  }, [ideas.length, setIdeas])

  useEffect(() => {
    // Seed mock teams dynamically if not exists to visualize the "Team Members" panel
    if (teams.length === 0) {
      setTeams(MOCK_TEAMS)
    }
  }, [teams.length, setTeams])

  useEffect(() => {
    if (idea) {
      document.title = `EduBridge - ${idea.title}`;
    } else {
      document.title = `EduBridge - Idea Details`;
    }
  }, [idea]);

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  if (!idea) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-brand-background">
        <h1 className="text-xl font-bold">Idea not found.</h1>
        <Link to="/library" className="text-brand-primary mt-4 underline">Return to Library</Link>
      </div>
    )
  }

  const formatLabel = (value: string) =>
    value
      .split("-")
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")

  const formatDate = (value?: string) => {
    if (!value) return null
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value))
  }

  const metadataItems = [
    { icon: <FileText size={16} />, label: formatLabel(idea.categoryId) },
    { icon: <Network size={16} />, label: `${idea.tags.length} tag${idea.tags.length === 1 ? "" : "s"}` },
    { icon: <GraduationCap size={16} />, label: associatedTeam?.ta ? `TA: ${associatedTeam.ta.firstName} ${associatedTeam.ta.lastName}` : (associatedTeam?.name || "Unassigned team") },
    { icon: <Calendar size={16} />, label: formatDate(idea.updatedAt) ? `Updated ${formatDate(idea.updatedAt)}` : "Draft idea" }
  ]

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen w-full bg-linear-to-b from-brand-primary/20 via-brand-background to-brand-primary/10 pb-24 relative overflow-x-hidden pt-6">

        {/* Top Header - Just Left Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="px-6 pb-4"
        >
          <BackButton />
        </motion.div>

        <motion.div
          className="lg:w-[80dvw] max-w-7xl mx-auto px-6 lg:px-10 flex flex-col gap-8 pb-[80px]"
          variants={staggerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* Idea Hero Card */}
          <motion.div
            variants={fadeUpVariants}
            className="w-full rounded-[30px] overflow-hidden p-8 bg-linear-to-b from-brand-primary/60 to-brand-pink/40 relative shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
          >
            <div className="relative z-10 text-brand-text-primary">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="rounded-full bg-brand-card/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-text-primary backdrop-blur-sm">
                  {formatLabel(idea.categoryId)}
                </span>
                {idea.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full bg-brand-background/55 px-3 py-1 text-xs font-medium text-brand-text-primary/85 backdrop-blur-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-bold">
                  {idea.title}
                </h1>
                {role !== 'ta' && <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        const wasBookmarked = isBookmarked;
                        toggleSaveIdea(idea.id);
                        toast.success(!wasBookmarked ? "Idea saved to your library!" : "Idea removed from library", {
                          description: !wasBookmarked ? `You've successfully saved "${idea.title}".` : `"${idea.title}" has been removed from your saved list.`,
                          duration: 2000,
                        });
                      }}
                      className="p-3 bg-brand-card/30 backdrop-blur-md rounded-2xl text-brand-text-primary hover:bg-brand-card/50 transition-all active:scale-90 shadow-sm border border-white/10"
                      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark idea"}
                    >
                      <Bookmark className="w-6 h-6" fill={isBookmarked ? 'currentColor' : 'transparent'} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isBookmarked ? "Saved" : "Save Idea"}</p>
                  </TooltipContent>
                </Tooltip>}
              </div>
              <p className="text-brand-text-secondary text-base mb-6 max-w-3xl">
                {idea.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-10">
                {idea.repositoryUrl && (
                  <a
                    href={idea.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-brand-card bg-brand-pink px-4 py-2 text-sm font-semibold text-brand-text-primary transition-opacity hover:opacity-90"
                  >
                    <ExternalLink size={14} />
                    Open repository
                  </a>
                )}
                {formatDate(idea.createdAt) && (
                  <span className="text-sm text-brand-text-secondary">
                    Created {formatDate(idea.createdAt)}
                  </span>
                )}
              </div>

              {/* Bottom Row Tags */}
              <div className="flex flex-wrap items-center gap-6 mt-10 text-[11px] font-bold">
                {metadataItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-2 opacity-80 mix-blend-multiply">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Team Members Section */}
          <motion.div variants={fadeUpVariants}>
            <h2 className="text-xl font-bold text-brand-text-primary mb-4">
              Team Members
            </h2>

            {/* Horizontal Scroll Area */}
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
              {associatedTeam ? associatedTeam.members.map(member => (
                <div
                  key={member.id}
                  className="min-w-[240px] max-w-[280px] w-[280px] bg-brand-card rounded-[24px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-brand-grey/20 snap-start shrink-0"
                >
                  <div className="flex items-start gap-3">
                    <ProfileAvatar
                      name={member.user?.firstName}
                      imageUrl={member.user?.profileImageUrl}
                      className="w-[56px] h-[56px] rounded-xl bg-brand-grey shadow-none"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-brand-text-primary text-sm truncate">
                        {member.user?.firstName} {member.user?.lastName}
                      </h3>
                      <p className="text-xs text-brand-pink font-medium mt-0.5 truncate">
                        {member.user?.major || 'Computer Science'}
                      </p>
                      <p className="text-xs text-brand-text-secondary mt-0.5 truncate">
                        {member.user?.university || 'University'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-grey/20">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${member.role === 'Leader' ? 'bg-brand-pink/20 text-brand-pink' : 'bg-brand-grey/20 text-brand-text-secondary'}`}>
                      {member.role}
                    </span>
                    <Link
                      to={`/bridge/${member.userId}`}
                      className="shrink-0 bg-brand-primary text-brand-text-primary font-bold text-[10px] px-3 py-1.5 rounded-brand-button hover:bg-brand-primary/60 transition-colors uppercase tracking-wide"
                    >
                      View
                    </Link>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-brand-dark-grey italic">No team is currently pursuing this idea.</p>
              )}
            </div>
          </motion.div>

          {/* Documents Section */}
          <motion.div variants={fadeUpVariants}>
            <h2 className="text-xl font-bold text-brand-text-primary mb-4">
              Documents
            </h2>

            {/* Document List or Empty State */}
            {MOCK_DOCUMENTS.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_DOCUMENTS.map(doc => (
                  <div
                    key={doc.id}
                    className="bg-brand-card rounded-brand-input p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-brand-grey/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${doc.type === 'pdf' ? 'bg-red-100' :
                        doc.type === 'doc' ? 'bg-blue-100' :
                          'bg-green-100'
                        }`}>
                        {doc.type === 'pdf' ? (
                          <FileText size={24} className="text-red-600" />
                        ) : doc.type === 'doc' ? (
                          <FileText size={24} className="text-blue-600" />
                        ) : (
                          <FileCheck size={24} className="text-green-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-brand-text-primary text-sm truncate">
                          {doc.name}
                        </h3>
                        <p className="text-xs text-brand-dark-grey mt-1">
                          {doc.size} • {doc.uploadedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-brand-grey/10">
                      <button className="flex items-center gap-1.5 text-xs font-medium text-brand-text-primary hover:text-brand-dark-grey cursor-pointer transition-colors">
                        <Download size={14} />
                        Download
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-medium text-brand-text-primary hover:text-brand-dark-grey cursor-pointer transition-colors">
                        <ExternalLink size={14} />
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-6 bg-white rounded-[24px] border-2 border-dashed border-brand-grey/30">
                <div className="w-20 h-20 bg-brand-grey/10 rounded-full flex items-center justify-center mb-4">
                  <File size={40} className="text-brand-dark-grey/50" />
                </div>
                <h3 className="text-lg font-semibold text-brand-text-primary mb-2">
                  No documents yet
                </h3>
                <p className="text-sm text-brand-dark-grey text-center max-w-xs">
                  This idea doesn't have any documents attached. Check back later or contact the team for updates!
                </p>
                <span className="text-3xl mt-3">📄</span>
              </div>
            )}
          </motion.div>

        </motion.div>

        {/* Floating Chatbot Button conditionally rendered */}
        {role !== 'ta' && (
          <div className="fixed bottom-24 right-4 z-50">
            <ChatbotButton />
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}

export default IdeaDetailsPage

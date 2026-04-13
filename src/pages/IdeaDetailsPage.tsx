import { useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { useIdeasStore } from "@/features/ideas"
import { useTeamStore, type Team } from "@/features/teams"
import { useProfileStore } from "@/features/profile"
import { ChatbotButton } from "@/features/chatbot"
import BackButton from "@/components/BackButton"
import { TooltipProvider } from "@/components/ui/tooltip"
import { FileText, Network, GraduationCap, Calendar, User, File, FileCheck, Download, ExternalLink } from "lucide-react"

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

const MOCK_TEAMS: Team[] = [
  {
    id: "t1",
    name: "Harmony Team",
    leaderId: "u1",
    ideaId: "1",
    status: "InProgress",
    maxMembers: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    members: [
      {
        id: "m1",
        userId: "u1",
        teamId: "t1",
        role: "Leader",
        joinedAt: new Date().toISOString(),
        user: {
          id: "u1",
          firstName: "Olivia",
          lastName: "Brown",
          email: "olivia@example.com",
          role: "student",
        }
      },
      {
        id: "m2",
        userId: "u2",
        teamId: "t1",
        role: "Member",
        joinedAt: new Date().toISOString(),
        user: {
          id: "u2",
          firstName: "James",
          lastName: "Smith",
          email: "james@example.com",
          role: "student",
        }
      }
    ]
  }
];

const IdeaDetailsPage = () => {
  const { id: ideaId } = useParams()
  const shouldReduceMotion = useReducedMotion()
  const role = useProfileStore(state => state.role)

  const ideas = useIdeasStore(state => state.ideas)
  const idea = ideas.find(i => i.id === ideaId)

  const teams = useTeamStore(state => state.teams)
  const setTeams = useTeamStore(state => state.setTeams)

  // Find the team currently assigned to this idea
  const associatedTeam = teams.find(t => t.ideaId === ideaId)

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

  // Pre-configured tag mapped metadata (as icons/types aren't strict in state)
  const TAG_ICONS = [
    { icon: <FileText size={16} />, label: "Software engineering" },
    { icon: <Network size={16} />, label: "Computer Science" },
    { icon: <GraduationCap size={16} />, label: "Level 3" },
    { icon: <Calendar size={16} />, label: "2026" }
  ]

  if (!idea) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-brand-background">
        <h1 className="text-xl font-bold">Idea not found.</h1>
        <Link to="/library" className="text-brand-primary mt-4 underline">Return to Library</Link>
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen w-full bg-[#F5F7FB] pb-24 relative overflow-x-hidden pt-6">

        {/* Top Header - Just Left Back Button */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, x: -10 }}
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
              <h1 className="text-3xl font-bold mb-2">
                {idea.title}
              </h1>
              <p className="text-[#333333] text-base mb-16">
                {idea.description}
              </p>

              {/* Bottom Row Tags */}
              <div className="flex flex-wrap items-center gap-6 mt-16 text-[#000000] text-[11px] font-bold">
                {TAG_ICONS.map((tag, idx) => (
                  <div key={idx} className="flex items-center gap-2 opacity-80 mix-blend-multiply">
                    {tag.icon}
                    <span>{tag.label}</span>
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
                  className="min-w-[240px] max-w-[280px] w-[280px] bg-white rounded-[24px] p-4 flex gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-brand-grey/20 snap-start shrink-0 items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-[60px] h-[60px] bg-[#E8E8E8] rounded-xl flex items-center justify-center shrink-0">
                      <User size={30} className="text-[#A2A2A2]" strokeWidth={1.5} />
                    </div>
                  </div>

                  <Link
                    to={`/bridge/${member.userId}`}
                    className="shrink-0 bg-brand-primary text-brand-text-primary font-bold text-[10px] px-4 py-2 rounded-brand-button hover:bg-brand-primary/60 transition-colors uppercase tracking-wide opacity-80"
                  >
                    View Profile
                  </Link>
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
                    className="bg-white rounded-brand-input p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-brand-grey/20"
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
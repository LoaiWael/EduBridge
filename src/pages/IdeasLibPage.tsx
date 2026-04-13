import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useIdeasStore } from "@/features/ideas"
import { ChatbotButton } from "@/features/chatbot"
import BackButton from "@/components/BackButton"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { useProfileStore } from "@/features/profile"

const MOCK_IDEAS = [
  {
    id: "1",
    title: "Harmony",
    description: "Project description",
    categoryId: "c1",
    tags: [],
    teamId: "t1"
  },
  {
    id: "2",
    title: "EduBridge",
    description: "Project description",
    categoryId: "c2",
    tags: [],
    teamId: "t2"
  },
  {
    id: "3",
    title: "EduBridge",
    description: "Project description",
    categoryId: "c2",
    tags: [],
    teamId: "t3"
  },
  {
    id: "4",
    title: "EduBridge",
    description: "Project description",
    categoryId: "c2",
    tags: [],
    teamId: "t4"
  }
];

const IdeasLibPage = () => {
  const shouldReduceMotion = useReducedMotion()
  const role = useProfileStore(state => state.role)
  const ideas = useIdeasStore(state => state.ideas)
  const setIdeas = useIdeasStore(state => state.setIdeas)
  const [isLoading, setIsLoading] = useState(true)

  // Seed mock data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      // Simulate network delay for perceived performance
      await new Promise(resolve => setTimeout(resolve, 500))

      if (ideas.length === 0) {
        setIdeas(MOCK_IDEAS)
      }
      setIsLoading(false)
    }

    loadData()
  }, [ideas.length, setIdeas])

  useEffect(() => {
    document.title = "EduBridge - Library";
  }, []);

  const listItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.3
      }
    })
  }

  const skeletonVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const skeletonItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  }

  return (
    <TooltipProvider delayDuration={300}>
      {/* Background configured using brand colors with an opacity touch */}
      <div className="min-h-screen w-full bg-linear-to-b from-brand-primary/20 via-brand-background to-brand-primary/10 pb-24 relative overflow-x-hidden pt-6">
        {/* Header */}
        <motion.div
          variants={listItemVariants}
          className="px-6 pb-6 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between relative mt-4">
            <div className="absolute left-0 z-10 w-fit">
              <BackButton />
            </div>
            <h1 className="text-2xl font-bold text-center w-full z-0 text-brand-text-primary">
              Library
            </h1>
          </div>
        </motion.div>

        {/* Ideas List with Skeleton Loading */}
        <div className="lg:w-[80dvw] max-w-7xl mx-auto px-6 flex flex-col items-center gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 lg:items-stretch lg:px-10 pb-[100px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              // Skeleton loaders
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
                      className="w-full bg-white rounded-3xl p-5 shadow-brand-card flex flex-col"
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
            ) : (
              // Actual ideas list
              <div className="contents">
                {ideas.map((idea, index) => (
                  <motion.div
                    key={idea.id}
                    custom={index}
                    variants={listItemVariants}
                    initial={shouldReduceMotion ? "visible" : "hidden"}
                    animate="visible"
                    layout
                    className="w-full bg-white rounded-3xl p-5 shadow-brand-card flex flex-col"
                  >
                    <h2 className="text-xl font-bold text-brand-text-primary mb-1">
                      {idea.title}
                    </h2>
                    <div className="grow">
                      <p className="text-[#444444] text-sm mb-3">
                        {idea.description}
                      </p>
                    </div>

                    <div className="flex justify-end mt-auto">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            to={`/library/${idea.id}`}
                            viewTransition
                            className="bg-linear-to-b from-brand-primary to-brand-pink text-brand-secondary text-sm font-semibold px-4 py-2 flex items-center justify-center rounded-brand-card hover:opacity-90 active:scale-95 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                            aria-label={`View details for ${idea.title}`}
                          >
                            View details
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to view project details</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Chatbot Button overlaid safely */}
        {role !== 'ta' ?
          <div className="fixed bottom-24 right-4 z-50">
            <ChatbotButton />
          </div>
          : ''
        }
      </div>
    </TooltipProvider>
  )
}

export default IdeasLibPage
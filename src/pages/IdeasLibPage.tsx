import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useIdeasStore, IdeaCard } from "@/features/ideas"
import { ChatbotButton } from "@/features/chatbot"
import BackButton from "@/components/BackButton"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { useProfileStore } from "@/features/profile"
import ideasData from "@/data/ideas.json"

const IdeasLibPage = () => {
  const role = useProfileStore(state => state.role)
  const ideas = useIdeasStore(state => state.ideas)
  const setIdeas = useIdeasStore(state => state.setIdeas)
  const [isLoading, setIsLoading] = useState(true)

  // Seed mock data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      // Simulate network delay for perceived performance
      await new Promise(resolve => setTimeout(resolve, 800))

      if (ideas.length === 0) {
        setIdeas(ideasData)
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
            ) : (
              // Actual ideas list
              <div className="contents">
                {ideas.map((idea, index) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    index={index}
                    variants={listItemVariants}
                  />
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

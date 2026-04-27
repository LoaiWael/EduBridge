import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import BackButton from '@/components/BackButton'
import boarding1 from '@/assets/imgs/svg/boarding-1.svg'
import boarding2 from '@/assets/imgs/svg/boarding-2.svg'
import boarding3 from '@/assets/imgs/svg/boarding-3.svg'

const steps = [
  {
    image: boarding1,
    title: 'Build better teams faster',
    description: 'Stop wasting time searching for teammates. Find the right match based on skills, interests, and academic level',
  },
  {
    image: boarding2,
    title: 'Let the system match you',
    description: 'Based on your skills, strengths, and goals',
  },
  {
    image: boarding3,
    title: 'From idea to supervised success',
    description: 'Explore ideas, build your team, choose your TA',
  },
]

// Animation variants for staggered effects
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
}

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
} as const

const BoardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(0)
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setDirection(1)
      setCurrentStep((prev) => prev + 1)
    } else {
      handleFinish()
    }
  }, [currentStep])

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  const handleFinish = () => {
    toast.success('Welcome to EduBridge!', { description: 'Let\'s complete your profile.' })
    navigate('/settings/profile', { viewTransition: true })
  }

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault()
      handleNext()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      handlePrev()
    } else if (e.key === 'Escape') {
      handleFinish()
    }
  }, [handleNext, handlePrev])

  const currentContent = steps[currentStep]
  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  // SVG for circular progress
  const radius = 30
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference

  // Animation settings based on reduced motion preference
  const animationDuration = shouldReduceMotion ? 0 : 0.4

  return (
    <TooltipProvider delayDuration={300}>
      <motion.div
        className="flex flex-col min-h-screen bg-brand-background p-brand-6 mx-auto items-center relative overflow-hidden"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={shouldReduceMotion ? undefined : pageVariants}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {/* Top Header */}
        <motion.div
          className="w-full flex items-center justify-between z-10"
          variants={contentVariants}
        >
          <BackButton />
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleFinish}
                className="text-brand-text-primary font-bold text-lg px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-background transition-all"
              >
                Skip
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Skip onboarding and go to home</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>

        {/* Content Area */}
        <motion.div
          className="flex-1 w-full flex flex-col justify-center items-center mt-4 sm:mt-8"
          variants={contentVariants}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{
                opacity: 0,
                x: direction >= 0 ? 100 : -100,
                scale: 0.975,
              }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{
                opacity: 0,
                x: direction >= 0 ? -100 : 100,
                scale: 0.975,
              }}
              transition={{ duration: animationDuration, ease: 'easeInOut' }}
              className="flex flex-col items-center text-center w-full"
            >
              {/* Image section */}
              <div className="w-full max-w-[200px] sm:max-w-[280px] h-[220px] sm:h-[300px] flex items-center justify-center mb-4 sm:mb-8">
                <img
                  src={currentContent.image}
                  alt={currentContent.title}
                  className="w-full h-full object-contain pointer-events-none select-none"
                />
              </div>

              {/* Text Section */}
              <h1 className="text-brand-text-primary text-xl sm:text-2xl font-bold mb-2 sm:mb-4 px-2">
                {currentContent.title}
              </h1>
              <p className="text-brand-text-secondary text-sm sm:text-base leading-relaxed max-w-[75ch]">
                {currentContent.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress Dots */}
          <div className="flex items-center gap-2 mt-6" role="tablist" aria-label="Onboarding progress">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 rounded-full transition-colors ${index === currentStep ? 'bg-brand-secondary w-8' : 'bg-brand-grey/30 w-2'
                  }`}
                initial={false}
                animate={{
                  width: index === currentStep ? 32 : 8,
                  backgroundColor: index === currentStep ? 'var(--brand-secondary)' : 'var(--brand-grey)',
                }}
                transition={{ duration: 0.3 }}
                role="tab"
                aria-selected={index === currentStep}
                aria-label={`Step ${index + 1} of ${steps.length}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Bottom Footer Area */}
        <motion.div
          className="w-full flex justify-center items-center gap-4 pb-4 sm:pb-8 pt-4 sm:pt-6 z-10"
          variants={contentVariants}
        >
          {/* Previous Button (only show if not on first step) */}
          {currentStep > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={handlePrev}
                  className="absolute left-4 md:left-12 p-3 rounded-full bg-brand-grey/10 hover:bg-brand-grey/20 focus-visible:ring-2 focus-visible:ring-brand-secondary transition-colors"
                  aria-label="Previous step"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-5 h-5 text-brand-text-primary" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go back</p>
              </TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleNext}
                className="relative group focus:outline-none flex items-center justify-center"
                aria-label={currentStep === steps.length - 1 ? "Finish onboarding" : "Next step"}
              >
                {/* Circular Progress Indicator */}
                <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 80 80">
                  {/* Background Circle */}
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="var(--brand-grey)"
                    strokeWidth="4"
                    fill="transparent"
                    className="opacity-50"
                  />
                  {/* Progress Circle Loop with Dash Array */}
                  <motion.circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="var(--brand-secondary)"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    strokeLinecap="round"
                  />
                </svg>

                {/* Inner Button Circle */}
                <motion.div
                  className="absolute inset-0 m-auto w-12 h-12 bg-brand-secondary rounded-full flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowRight className="text-brand-background w-6 h-6" />
                </motion.div>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{currentStep === steps.length - 1 ? 'Finish onboarding' : 'Go to next step'}</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  )
}

export default BoardingPage
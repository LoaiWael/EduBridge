import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from 'motion/react'

const BackButton = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: 'easeInOut' }}
      onClick={() => navigate('..', { viewTransition: true })}
      className="p-2 -ml-2 rounded-full hover:bg-brand-text-secondary/16 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-text-primary"
      aria-label="Go back to previous page"
    >
      <ArrowLeft className="w-7 h-7 text-brand-text-primary/80" />
    </motion.button>
  )
}

export default BackButton
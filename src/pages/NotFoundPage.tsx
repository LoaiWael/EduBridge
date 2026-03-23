import { useNavigate, type To } from "react-router"
import { motion } from "motion/react"
import { Home, AlertCircle, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
          className="mb-6"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-6xl font-bold text-foreground mb-2"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-xl font-semibold text-foreground mb-2"
        >
          Page Not Found
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-muted-foreground mb-8"
        >
          Sorry, the page you're looking for doesn't exist or has been moved.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            onClick={() => navigate(-1 as To, { viewTransition: true })}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate("/", { viewTransition: true })}
            size="lg"
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFoundPage
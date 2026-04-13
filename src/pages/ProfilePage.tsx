import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Briefcase, GraduationCap, Bookmark, ChevronRight, Network, Star, Users } from "lucide-react"
import { toast } from "sonner"
import { useProfileStore } from "@/features/profile/store/useProfileStore"
import { useAuthStore } from "@/features/auth"
import ProfileAvatar from "@/features/profile/components/ProfileAvatar"
import EditProfileButton from "@/features/profile/components/EditProfileButton"
import BackButton from "@/components/BackButton"
import { TooltipProvider } from "@/components/ui/tooltip"
import { maskEmail } from "@/utils"

const ProfilePage = () => {
  const shouldReduceMotion = useReducedMotion()
  const { userId } = useParams()
  const firstName = useProfileStore(state => state.firstName);
  const lastName = useProfileStore(state => state.lastName);
  const email = useProfileStore(state => state.email);
  const major = useProfileStore(state => state.major);
  const university = useProfileStore(state => state.university);
  const department = useProfileStore(state => state.department);
  const role = useProfileStore(state => state.role);
  const academicTitle = useProfileStore(state => state.academicTitle);
  const rating = useProfileStore(state => state.rating);
  const maxSlots = useProfileStore(state => state.maxSlots);
  const authId = useAuthStore(state => state.id)

  const isOwnProfile = userId === authId || (userId && authId && userId.replace(/^ID/, '') === authId.replace(/^ID/, ''))

  const displayName = firstName && lastName ? `${firstName} ${lastName}` : "Olivia Brown"
  const displayId = userId || (authId ? (authId.toString().startsWith("ID") ? authId : `ID${authId}`) : "ID1000274875")
  const displayEmail = maskEmail(email)

  const handleSavedTeamsClick = () => {
    toast.info("Navigating to your saved teams", {
      description: "Here you can view and manage your bookmarked teams"
    })
  }

  // Stagger variants for list items
  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.3
      }
    })
  }

  useEffect(() => {
    const previousTitle = document.title
    document.title = `EduBridge - ${displayName}`

    return () => {
      document.title = previousTitle
    }
  }, [displayName])

  // Fallbacks for missing store details in the mocked UI
  const details = role === 'ta' ? [
    {
      label: "Track",
      value: major || "AI",
      icon: <Briefcase className="w-5 h-5 text-brand-text-primary" />
    },
    {
      label: "Faculty",
      value: university || "Computer Science",
      icon: <GraduationCap className="w-5 h-5 text-brand-text-primary" />
    },
    {
      label: "Rating",
      value: `${rating || "4.6"}/5`,
      icon: <Star className="w-5 h-5 text-black" fill="currentColor" />
    },
    ...(isOwnProfile ? [{
      label: "Manage Teams",
      value: <ChevronRight className="w-5 h-5 text-brand-text-secondary" />,
      icon: <Users className="w-5 h-5 text-brand-text-primary" />,
      link: "/manage-teams"
    }] : [
      {
        label: "Teams",
        value: <ChevronRight className="w-5 h-5 text-brand-text-secondary" />,
        icon: <Users className="w-5 h-5 text-brand-text-primary" />,
        link: `/bridge/${userId}/teams`
      }
    ])
  ] : [
    {
      label: "Track",
      value: major || "UI/UX",
      icon: <Briefcase className="w-5 h-5 text-brand-text-primary" />
    },
    {
      label: "Faculty",
      value: university || "Computer Science",
      icon: <GraduationCap className="w-5 h-5 text-brand-text-primary" />
    },
    ...(isOwnProfile ? [{
      label: "Saved Teams",
      value: <ChevronRight className="w-5 h-5 text-brand-text-secondary" />,
      icon: <Bookmark className="w-5 h-5 text-brand-text-primary" />,
      link: "/my-teams"
    }] : []),
    {
      label: "Department",
      value: department || "CS",
      icon: <Network className="w-5 h-5 text-brand-text-primary" />
    }
  ]

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen w-full bg-linear-to-b from-[#EFE9FF] via-white to-[#F8F5FF] pb-24 relative overflow-x-hidden">

        {/* Header */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-6 pb-12 pt-6 flex flex-col gap-4"
        >
          <div className="flex items-center gap-5">
            <BackButton />
            <h1 className="text-[32px] font-bold text-brand-text-primary">
              Profile
            </h1>
          </div>
        </motion.div>

        {/* User Info Card */}
        <div className=" lg:w-[80dvw] max-w-5xl mx-auto">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-6 bg-white rounded-3xl p-6 shadow-brand-card flex flex-col items-center text-center relative z-10"
          >
            {/* Profile Avatar overridden with inline style to be larger like UI */}
            <div className="mb-3">
              <ProfileAvatar style={{ width: '96px', height: '96px', fontSize: '32px' }} />
            </div>

            <h2 className="text-xl font-bold text-brand-text-primary mb-1">
              {displayName}
            </h2>
            {role === 'ta' ? (
              <div className="text-brand-text-secondary text-sm mb-4 leading-tight flex flex-col items-center gap-0.5">
                <p>Teaching Assistant @ {department || "CS"} dept</p>
                <p>{academicTitle || (major ? `${major} Engineer` : "AI Engineer")}</p>
                <p className="mt-0.5 select-none"><span className="text-brand-green font-medium">Availability</span> 4/{maxSlots || 6} Teams</p>
              </div>
            ) : (
              <>
                <p className="text-brand-text-secondary text-sm mb-1">
                  {displayId}
                </p>
                <p className="text-brand-text-secondary text-sm mb-4">
                  {displayEmail}
                </p>
              </>
            )}

            {isOwnProfile && <EditProfileButton />}
          </motion.div>

          {/* Details Card */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-6 mt-6 bg-white rounded-3xl overflow-hidden shadow-brand-card flex flex-col relative z-10"
          >
            {details.map((item, index) => {
              const content = (
                <motion.div
                  custom={index}
                  variants={listItemVariants}
                  initial={shouldReduceMotion ? "visible" : "hidden"}
                  animate="visible"
                  className={`flex flex-row items-center justify-between p-4 ${index !== details.length - 1 ? 'border-b border-brand-grey/50' : ''} ${item.link ? 'hover:bg-black/5 transition-colors cursor-pointer' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-brand-text-primary font-medium">{item.label}</span>
                  </div>
                  <div className="text-brand-text-secondary text-sm">
                    {item.value}
                  </div>
                </motion.div>
              );

              return item.link ? (
                <Link
                  to={item.link}
                  viewTransition
                  key={item.label}
                  onClick={handleSavedTeamsClick}
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-text-primary focus-visible:z-10 relative"
                >
                  {content}
                </Link>
              ) : (
                <div key={item.label}>
                  {content}
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default ProfilePage
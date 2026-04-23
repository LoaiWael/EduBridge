import { useEffect, type JSX } from "react"
import { Link, useParams } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Briefcase, GraduationCap, Bookmark, ChevronRight, Star, Users, Mail, BadgeCheck, MapPin, Github, Linkedin } from "lucide-react"
import { useProfileStore } from "@/features/profile/store/useProfileStore"
import { useAuthStore } from "@/features/auth"
import ProfileAvatar from "@/features/profile/components/ProfileAvatar"
import EditProfileButton from "@/features/profile/components/EditProfileButton"
import { LogoutButton } from "@/features/auth"
import BackButton from "@/components/BackButton"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useIdeasStore, SavedIdeasDialog } from "@/features/ideas"
import { useState } from "react"
import usersData from "@/data/users.json"

interface DetailRow {
  label: string;
  value: string | JSX.Element;
  icon: JSX.Element;
  link?: string;
  onClick?: () => void;
}

const ProfilePage = () => {
  const shouldReduceMotion = useReducedMotion()
  const { userId } = useParams()
  const [isSavedIdeasOpen, setIsSavedIdeasOpen] = useState(false)

  const authId = useAuthStore(state => state.id)
  const savedIdeasCount = useIdeasStore(state => state.savedIdeaIds.length)

  const isOwnProfile = !userId || userId === authId || (userId && authId && userId.replace(/^ID/, '') === authId.replace(/^ID/, ''))

  // Find user data from JSON if not own profile
  const otherUser = !isOwnProfile ? usersData.find(u => u.id === userId) : null

  // Helper to fallback to store if own profile, else use otherUser data
  const userData = isOwnProfile ? {
    firstName: useProfileStore(state => state.firstName),
    lastName: useProfileStore(state => state.lastName),
    email: useProfileStore(state => state.email),
    bio: useProfileStore(state => state.bio),
    major: useProfileStore(state => state.major),
    university: useProfileStore(state => state.university),
    profileImageUrl: useProfileStore(state => state.profileImageUrl),
    githubUrl: useProfileStore(state => state.githubUrl),
    linkedInUrl: useProfileStore(state => state.linkedInUrl),
    isDisabled: useProfileStore(state => state.isDisabled),
    skills: useProfileStore(state => state.skills),
    department: useProfileStore(state => state.department),
    role: useProfileStore(state => state.role),
    academicTitle: useProfileStore(state => state.academicTitle),
    officeLocation: useProfileStore(state => state.officeLocation),
    rating: useProfileStore(state => state.rating),
    maxSlots: useProfileStore(state => state.maxSlots),
  } : {
    firstName: otherUser?.firstName || "",
    lastName: otherUser?.lastName || "",
    email: otherUser?.email || "",
    bio: otherUser?.bio || "",
    major: otherUser?.major || "",
    university: otherUser?.university || "",
    profileImageUrl: otherUser?.profileImageUrl || "",
    githubUrl: otherUser?.githubUrl || "",
    linkedInUrl: otherUser?.linkedInUrl || "",
    isDisabled: otherUser?.isDisabled || false,
    skills: otherUser?.skills || [],
    // @ts-ignore
    department: otherUser?.department || "",
    // @ts-ignore
    role: otherUser?.role || "student",
    // @ts-ignore
    academicTitle: otherUser?.academicTitle || "",
    // @ts-ignore
    officeLocation: otherUser?.officeLocation || "",
    // @ts-ignore
    rating: otherUser?.rating || 0,
    // @ts-ignore
    maxSlots: otherUser?.maxSlots || 0,
  }

  const { firstName, lastName, email, bio, major, university, profileImageUrl, githubUrl, linkedInUrl, isDisabled, skills, department, role, academicTitle, officeLocation, rating, maxSlots } = userData;

  const displayName = firstName && lastName ? `${firstName} ${lastName}` : "Olivia Brown"
  const displayId = userId || (authId ? (authId.toString().startsWith("ID") ? authId : `ID${authId}`) : "ID1000274875")
  const displayBio = bio || "Add a short bio to help teammates and supervisors understand your background and interests."
  const displaySkills = skills.length > 0 ? skills : [
    { id: "skill-1", name: role === "ta" ? "Mentorship" : "UI/UX" },
    { id: "skill-2", name: role === "ta" ? "Project Review" : "Teamwork" },
    { id: "skill-3", name: role === "ta" ? "Research" : "Problem Solving" },
  ]
  const officeLocationLabel = typeof officeLocation === "string" && officeLocation.trim()
    ? officeLocation
    : "Not specified"

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

  const detailRows: DetailRow[] = (role === 'ta' ? [
    {
      label: "Major",
      value: major || "AI",
      icon: <Briefcase className="w-5 h-5 text-brand-text-primary" />
    },
    {
      label: "Faculty",
      value: university || "Computer Science",
      icon: <GraduationCap className="w-5 h-5 text-brand-text-primary" />
    },
    {
      label: "Email",
      value: email || 'oliviabrown@gmail.com',
      icon: <Mail className="w-5 h-5 text-brand-text-primary" />
    },
    {
      label: "Office",
      value: officeLocationLabel,
      icon: <MapPin className="w-5 h-5 text-brand-text-primary" />
    },
    {
      label: "Rating",
      value: `${rating || "4.6"}/5`,
      icon: <Star className="w-5 h-5 text-brand-text-primary" fill="currentColor" />
    },
    {
      label: "Account Status",
      value: isDisabled ? "Disabled" : "Active",
      icon: <BadgeCheck className="w-5 h-5 text-brand-text-primary" />
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
      label: "Major",
      value: major || "UI/UX",
      icon: <Briefcase className="w-5 h-5 text-brand-text-primary" />
    },
    {
      label: "Faculty",
      value: university || "Computer Science",
      icon: <GraduationCap className="w-5 h-5 text-brand-text-primary" />
    },
    {
      label: "Email",
      value: email || 'oliviabrown@gmail.com',
      icon: <Mail className="w-5 h-5 text-brand-text-primary" />
    },
    ...(isOwnProfile ? [{
      label: "Saved Ideas",
      value: (
        <div className="flex items-center gap-2">
          <span className="text-brand-pink font-bold">{savedIdeasCount}</span>
          <ChevronRight className="w-5 h-5 text-brand-text-secondary" />
        </div>
      ),
      icon: <Bookmark className="w-5 h-5 text-brand-text-primary" />,
      onClick: () => setIsSavedIdeasOpen(true)
    }] : []),
    {
      label: "Account Status",
      value: isDisabled ? "Disabled" : "Active",
      icon: <BadgeCheck className="w-5 h-5 text-brand-text-primary" />
    }
  ]) as DetailRow[];

  const profileLinks = [
    githubUrl ? {
      href: githubUrl,
      label: "GitHub",
      icon: <Github className="w-4 h-4" />
    } : null,
    linkedInUrl ? {
      href: linkedInUrl,
      label: "LinkedIn",
      icon: <Linkedin className="w-4 h-4" />
    } : null,
  ].filter(Boolean) as { href: string; label: string; icon: JSX.Element }[]

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen w-full bg-linear-to-b from-brand-primary/20 via-brand-background to-brand-primary/10 pb-24 relative overflow-x-hidden">

        {/* Header */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-6 pb-12 pt-6 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-5">
              <BackButton />
              <h1 className="text-[32px] font-bold text-brand-text-primary">
                Profile
              </h1>
            </div>
            {isOwnProfile && <LogoutButton />}
          </div>
        </motion.div>

        {/* User Info Card */}
        <div className=" lg:w-[80dvw] max-w-5xl mx-auto">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-6 bg-brand-card rounded-3xl p-6 shadow-brand-card flex flex-col items-center text-center relative z-10"
          >
            {/* Profile Avatar overridden with inline style to be larger like UI */}
            <div className="mb-3">
              <ProfileAvatar
                imageUrl={profileImageUrl}
                name={displayName}
                style={{ width: '96px', height: '96px', fontSize: '32px' }}
              />
            </div>

            <h2 className="text-xl font-bold text-brand-text-primary mb-1">
              {displayName}
            </h2>
            {role === 'ta' ? (
              <div className="text-brand-text-secondary text-sm mb-4 leading-tight flex flex-col items-center gap-0.5">
                <p>Teaching Assistant @ {department || "CS"} dept</p>
                <p>{academicTitle || (major ? `${major} Engineer` : "AI Engineer")}</p>
                <p className="mt-0.5 select-none"><span className="text-brand-green font-medium">Capacity</span> Up to {maxSlots || 6} teams</p>
              </div>
            ) : (
              <>
                <p className="text-brand-text-secondary text-sm mb-1">
                  {displayId}
                </p>
              </>
            )}

            <p className="max-w-2xl text-sm text-brand-text-secondary leading-6 mb-4">
              {displayBio}
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {displaySkills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-full bg-brand-primary/60 px-3 py-1 text-xs font-medium text-brand-text-primary"
                >
                  {skill.name}
                </span>
              ))}
            </div>

            {profileLinks.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                {profileLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-brand-card bg-brand-background px-3 py-2 text-sm font-medium text-brand-text-primary shadow-sm transition-colors hover:bg-brand-primary/40"
                  >
                    {item.icon}
                    {item.label}
                  </a>
                ))}
              </div>
            )}

            {isOwnProfile && <EditProfileButton />}
          </motion.div>

          {/* Details Card */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-6 mt-6 bg-brand-card rounded-3xl overflow-hidden shadow-brand-card flex flex-col relative z-10"
          >
            {detailRows.map((item, index) => {
              const content = (
                <motion.div
                  custom={index}
                  variants={listItemVariants}
                  initial={shouldReduceMotion ? "visible" : "hidden"}
                  animate="visible"
                  className={`flex flex-row items-center justify-between gap-4 p-4 ${index !== detailRows.length - 1 ? 'border-b border-brand-grey/50' : ''} ${(item.link || item.onClick) ? 'hover:bg-black/5 transition-colors cursor-pointer' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-brand-text-primary font-medium">{item.label}</span>
                  </div>
                  <div className="text-brand-text-secondary text-sm text-right wrap-break-words">
                    {item.value}
                  </div>
                </motion.div>
              );

              if (item.link) {
                return (
                  <Link
                    to={item.link}
                    viewTransition
                    key={item.label}
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-text-primary focus-visible:z-10 relative"
                  >
                    {content}
                  </Link>
                );
              }

              if (item.onClick) {
                return (
                  <button
                    onClick={item.onClick}
                    key={item.label}
                    className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-text-primary focus-visible:z-10 relative cursor-pointer"
                  >
                    {content}
                  </button>
                );
              }

              return (
                <div key={item.label}>
                  {content}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <SavedIdeasDialog
        isOpen={isSavedIdeasOpen}
        onClose={() => setIsSavedIdeasOpen(false)}
      />
    </TooltipProvider>
  )
}

export default ProfilePage

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { SlidersHorizontal, Search } from "lucide-react";
import { ProfileAvatar } from "@/features/profile";
import { useProfileStore } from "@/features/profile";
import { ChatbotButton } from "@/features/chatbot";
import { NotificationDropdown } from "@/features/notifications";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import interactionSvg from "@/assets/imgs/svg/Interaction-between-members-of-team.svg";
import yourTeamsSvg from "@/assets/imgs/svg/your-teams.svg";
import communitySvg from "@/assets/imgs/svg/community.svg";
import recommendedTeamsSvg from "@/assets/imgs/svg/recommended-teams.svg";
import createTeamSvg from "@/assets/imgs/svg/create-new-team.svg";
import supervisionRequestsSvg from "@/assets/imgs/svg/supervision-requests.svg";
import trackTeamsSvg from "@/assets/imgs/svg/track-teams.svg";
import { useAuthStore } from "@/features/auth";

const HomePage = () => {
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const role = useProfileStore(state => state.role);
  const userId = useAuthStore(state => state.id);

  useEffect(() => {
    document.title = "EduBridge";
  }, []);

  const headerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const headerChildrenVariants = {
    hidden: { opacity: 0, y: -15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  const recentTeams = [
    { id: 1, name: 'Harmony', leader: 'Olivia Brown', subject: 'OS2', members: 5 },
    { id: 2, name: 'Innovators', leader: 'James Smith', subject: 'AI', members: 4 },
    { id: 3, name: 'Byte Me', leader: 'Emma Wilson', subject: 'Data Structures', members: 6 },
    { id: 4, name: 'Code Wizards', leader: 'Liam Davis', subject: 'Databases', members: 3 },
    { id: 5, name: 'Tech Titans', leader: 'Sophia Johnson', subject: 'Networks', members: 5 },
  ];

  return (
    <>
      <TooltipProvider delayDuration={300}>
        <div className="w-full bg-brand-background">
          <div className="min-h-screen lg:max-w-4/5 mx-auto pb-28 relative overflow-x-hidden">

            {/* Top Header Section */}
            <motion.div
              variants={headerVariants}
              initial="hidden"
              animate="visible"
              className="bg-brand-secondary text-white rounded-b-[40px] px-6 pt-12 pb-10 relative overflow-hidden shadow-md"
            >

              {/* Top App Bar */}
              <motion.div
                custom={0}
                variants={headerChildrenVariants}
                className="flex justify-between items-center z-10 relative"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => navigate("/settings", { viewTransition: true })}
                      className=" hover:bg-white/10 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <SlidersHorizontal className="w-[28px] h-[28px]" strokeWidth={1.5} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={8}>
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
                <div className="flex items-center space-x-4">
                  <NotificationDropdown
                    iconClassName="w-7 h-7 text-white"
                    buttonClassName="hover:bg-white/10 rounded-full"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => navigate(`/bridge/${userId}`, { viewTransition: true })}
                        className="cursor-pointer hover:ring-2 hover:ring-brand-pink transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded-full"
                      >
                        <ProfileAvatar />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={8}>
                      <p>Profile</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </motion.div>

              {/* Search Bar */}
              <motion.div
                custom={1}
                variants={headerChildrenVariants}
                className="mt-7 relative z-10 hover:opacity-90 transition-opacity"
              >
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-[22px] h-[22px] text-brand-text-secondary" strokeWidth={1.5} />
                  <input
                    type="text"
                    title="Search application"
                    placeholder="Search"
                    className="w-full h-14 bg-brand-card text-brand-text-secondary rounded-brand-input pl-12 pr-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-base"
                  />
                </div>
              </motion.div>

              {/* Hero Banner */}
              <motion.div
                custom={2}
                variants={headerChildrenVariants}
                className="mt-10 relative z-10 flex flex-col flex-wrap min-h-[160px]"
              >
                <div
                  className="lg:max-w-[30%] z-20"
                >
                  <h1 className="font-brand-teams  text-[32px] leading-[1.1] tracking-wide mb-2 uppercase max-w-[14ch]">
                    {role === 'ta' ? <>MANAGE YOUR <br /> TEAMS</> : "Your Team, One Tap Away!"}
                  </h1>

                  {/* Decorative lines */}
                  <div className="w-full h-1 bg-white mb-1 rounded-full"></div>
                  <div className="w-3/4 h-1 bg-white mb-5 rounded-full"></div>
                  <Link
                    to={role === 'ta' ? "/manage-teams" : "/teams"}
                    viewTransition
                    className="cursor-pointer text-brand-text-primary bg-linear-to-b from-brand-primary to-brand-pink text-brand-text font-bold text-[15px] px-5 py-2.5 rounded-brand-button hover:bg-opacity-90 hover:scale-[1.02] active:scale-95 shadow-sm transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 inline-block text-center"
                  >
                    {role === 'ta' ? "Start managing" : "Explore Teams"}
                  </Link>

                </div>

                {/* Hero Illustration overlaying the right side */}
                <img
                  src={interactionSvg}
                  alt="Team Interaction"
                  className="lg:absolute -right-8 -bottom-6 w-[280px] object-contain z-10"
                />
              </motion.div>
            </motion.div>

            {/* Content Section */}
            <div className="px-6 mt-8">
              <motion.h2
                initial={shouldReduceMotion ? {} : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-bold text-brand-text-primary mb-4"
              >
                Service categories
              </motion.h2>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-4 lg:px-10"
              >
                {role === 'ta' ? (
                  <>
                    {/* Supervision Requests */}
                    <motion.div variants={itemVariants}>
                      <Link
                        to="/supervision-requests"
                        viewTransition
                        title="Supervision Requests"
                        className="bg-brand-gradient-start rounded-brand-input shadow-brand-card p-4 pt-10 flex flex-col justify-end items-start relative overflow-visible h-[140px] group transition-all focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                      >
                        <img
                          src={supervisionRequestsSvg}
                          alt=""
                          className="absolute top-2 right-2 w-[55px] sm:w-[65px] lg:w-[85px] object-contain group-hover:-translate-y-1 transition-transform"
                        />
                        <span className="font-bold text-brand-text-primary text-left leading-tight text-base mt-auto z-10 w-full">
                          Supervision <br /> Requests
                        </span>
                      </Link>
                    </motion.div>

                    {/* Track Teams Card */}
                    <motion.div variants={itemVariants}>
                      <Link
                        to="/manage-teams"
                        viewTransition
                        title="Track Teams"
                        className="bg-brand-pink rounded-brand-input shadow-brand-card p-4 flex flex-col justify-end items-start relative overflow-visible h-[140px] group transition-all focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                      >
                        <div className="absolute top-4 right-1 flex items-end justify-end flex-col">
                          <img
                            src={trackTeamsSvg}
                            alt=""
                            className="w-[80px] lg:w-[110px] h-[75px] lg:h-[105px] object-contain group-hover:-translate-y-1 transition-transform"
                          />
                        </div>
                        <span className="font-bold text-brand-text-primary text-left leading-tight text-base mt-auto w-full">
                          Track Teams
                        </span>
                      </Link>
                    </motion.div>
                  </>
                ) : (
                  <>
                    {/* Your Teams Card */}
                    <motion.div variants={itemVariants}>
                      <Link
                        to="/my-teams"
                        viewTransition
                        title="View Your Teams"
                        className="bg-brand-card dark:bg-brand-secondary rounded-brand-input shadow-brand-card p-4 pt-10 flex flex-col justify-end items-start relative overflow-visible h-[140px] group transition-all focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                      >
                        <img
                          src={yourTeamsSvg}
                          alt=""
                          className="absolute top-[-10px] right-2 w-[120px] object-contain group-hover:-translate-y-1 transition-transform"
                        />
                        <span className="font-bold text-brand-text-primary text-left leading-tight text-base mt-2 z-10">
                          Your <br /> Teams
                        </span>
                      </Link>
                    </motion.div>

                    {/* Community Card */}
                    <motion.div variants={itemVariants}>
                      <Link
                        to="/library"
                        viewTransition
                        title="Visit Community"
                        className="bg-brand-card dark:bg-brand-secondary rounded-brand-input shadow-brand-card p-4 flex flex-col justify-end items-start relative overflow-visible h-[140px] group transition-all focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                      >
                        <img
                          src={communitySvg}
                          alt=""
                          className="absolute -top-3 right-0 w-[130px] object-contain group-hover:-translate-y-1 transition-transform"
                        />
                        <span className="font-bold text-brand-text-primary text-left leading-tight text-base z-10 mt-auto">
                          Community
                        </span>
                      </Link>
                    </motion.div>

                    {/* Recommended Teams Card */}
                    <motion.div variants={itemVariants}>
                      <Link
                        to="/teams"
                        viewTransition
                        title="Explore Recommended Teams"
                        className="bg-brand-card dark:bg-brand-secondary rounded-brand-input shadow-brand-card p-4 flex flex-col justify-end items-start relative overflow-visible h-[140px] group transition-all focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                      >
                        <div className="absolute -top-6 left-1/2 right-2 flex items-end justify-end flex-col">
                          <img
                            src={recommendedTeamsSvg}
                            alt=""
                            className="w-[85px] h-[85px] object-contain group-hover:-translate-y-1 transition-transform"
                          />
                        </div>
                        <span className="font-bold text-brand-text-primary text-left leading-tight text-base mt-auto">
                          Recommended <br /> teams
                        </span>
                      </Link>
                    </motion.div>

                    {/* Create a new team Card */}
                    <motion.div variants={itemVariants}>
                      <Link
                        to="/my-teams?create=true"
                        viewTransition
                        title="Create a New Team"
                        className="bg-brand-card dark:bg-brand-secondary rounded-brand-input shadow-brand-card p-4 flex flex-col justify-end items-start relative overflow-visible h-[140px] group transition-all focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                      >
                        <img
                          src={createTeamSvg}
                          alt=""
                          className="absolute -top-4 right-3 w-[65px] h-[65px] object-contain group-hover:-translate-y-1 transition-transform"
                        />
                        <span className="font-bold text-brand-text-primary text-left leading-tight text-base mt-auto">
                          Create a new <br /> team
                        </span>
                      </Link>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </div>

            {/* Recent Ongoing teams for TA */}
            {role === 'ta' && (
              <div className="px-6 mt-8 mb-4">
                <motion.h2
                  initial={shouldReduceMotion ? {} : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xl font-bold text-brand-text-primary mb-4"
                >
                  Recent Ongoing teams
                </motion.h2>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {recentTeams.map((team) => (
                    <motion.div
                      key={team.id}
                      variants={itemVariants}
                      className="bg-brand-card rounded-brand-input p-5 shadow-brand-card flex flex-col relative z-10 border border-brand-grey/20 w-full"
                    >
                      <h3 className="text-lg font-bold text-brand-text-primary mb-2">{team.name}</h3>
                      <div className="flex flex-col gap-1 text-sm text-brand-text-secondary mb-4 grow">
                        <p>Team leader : <span className="font-semibold text-brand-text-primary">{team.leader}</span></p>
                        <p>Subject : <span className="font-semibold text-brand-text-primary">{team.subject}</span></p>
                        <p>Number of members : <span className="font-semibold text-brand-text-primary">{team.members}</span></p>
                      </div>
                      <div className="flex justify-end mt-auto">
                        <Link
                          to={`/teams/${team.name.toLowerCase().replace(' ', '-')}`}
                          viewTransition
                          className="bg-brand-primary text-brand-text-primary text-sm font-semibold px-4 py-2 flex items-center justify-center rounded-brand-button hover:bg-brand-primary/80 transition-colors w-full sm:w-auto"
                        >
                          View details
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Floating Chatbot Button */}
            {role !== "ta" && (
              <ChatbotButton />
            )}
          </div>
        </div>
      </TooltipProvider>
    </>
  );
};

export default HomePage;
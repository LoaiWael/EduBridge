import { motion, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { SlidersHorizontal, Bell, Search } from "lucide-react";
import { ProfileAvatar } from "@/features/profile";
import { ChatbotButton } from "@/features/chatbot";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import interactionSvg from "@/assets/imgs/svg/Interaction-between-members-of-team.svg";
import yourTeamsSvg from "@/assets/imgs/svg/your-teams.svg";
import communitySvg from "@/assets/imgs/svg/community.svg";
import recommendedTeamsSvg from "@/assets/imgs/svg/recommended-teams.svg";
import createTeamSvg from "@/assets/imgs/svg/create-new-team.svg";

const HomePage = () => {
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();

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

  return (
    <>
      <title>EduBridge - Home</title>
      <TooltipProvider delayDuration={300}>
        <div className="w-full bg-[#F5F7FB]">
          <div className="min-h-screen lg:max-w-4/5 mx-auto pb-28 relative overflow-x-hidden">

            {/* Top Header Section */}
            <motion.div
              variants={headerVariants}
              initial="hidden"
              animate="visible"
              className="bg-brand-secondary rounded-b-[40px] px-6 pt-12 pb-10 relative overflow-hidden shadow-md"
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
                      className="text-white hover:bg-white/10 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <SlidersHorizontal className="w-[28px] h-[28px]" strokeWidth={1.5} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={8}>
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
                <div className="flex items-center space-x-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="text-white hover:bg-white/10 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      >
                        <Bell className="w-7 h-7" strokeWidth={1.5} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={8}>
                      <p>Notifications</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => navigate("/:userName", { viewTransition: true })}
                        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded-full"
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
                  <Search className="absolute left-4 w-[22px] h-[22px] text-[#444444]" strokeWidth={1.5} />
                  <input
                    type="text"
                    title="Search application"
                    placeholder="Search"
                    className="w-full h-14 bg-[#F2F4F7] text-[#444444] rounded-brand-input pl-12 pr-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-base"
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
                  <h1 className="font-brand-teams text-white text-[32px] leading-[1.1] tracking-wide mb-2 uppercase max-w-[14ch]">
                    Your Team, One Tap Away!
                  </h1>

                  {/* Decorative lines */}
                  <div className="w-full h-1 bg-white mb-1 rounded-full"></div>
                  <div className="w-3/4 h-1 bg-white mb-5 rounded-full"></div>
                  <Link
                    to="/teams"
                    viewTransition
                    className="cursor-pointer bg-linear-to-b from-brand-primary to-brand-pink text-brand-secondary font-bold text-[15px] px-5 py-2.5 rounded-brand-button hover:bg-opacity-90 hover:scale-[1.02] active:scale-95 shadow-sm transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                  >
                    Explore Teams
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
                {/* Your Teams Card */}
                <motion.div variants={itemVariants}>
                  <Link
                    to="/my-teams"
                    viewTransition
                    title="View Your Teams"
                    className="bg-brand-card rounded-brand-input shadow-brand-card p-4 pt-10 flex flex-col justify-end items-start relative overflow-visible h-[140px] group transition-all focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                  >
                    <img
                      src={yourTeamsSvg}
                      alt=""
                      className="absolute top-[-10px] right-2 w-[120px] object-contain group-hover:-translate-y-1 transition-transform"
                    />
                    <span className="font-bold text-[#000000] text-left leading-tight text-base mt-2 z-10">
                      Your <br /> Teams
                    </span>
                  </Link>
                </motion.div>

                {/* Community Card */}
                <motion.div variants={itemVariants}>
                  <Link
                    to="/ideas-lib"
                    viewTransition
                    title="Visit Community"
                    className="bg-brand-card rounded-brand-input shadow-brand-card p-4 flex flex-col justify-end items-start relative overflow-visible h-[140px] group transition-all focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                  >
                    <img
                      src={communitySvg}
                      alt=""
                      className="absolute -top-3 right-0 w-[130px] object-contain group-hover:-translate-y-1 transition-transform"
                    />
                    <span className="font-bold text-[#000000] text-left leading-tight text-base z-10 mt-auto">
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
                    className="bg-brand-card rounded-brand-input shadow-brand-card p-4 flex flex-col justify-end items-start relative overflow-visible h-[140px] group transition-all focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                  >
                    <div className="absolute -top-6 left-1/2 right-2 flex items-end justify-end flex-col">
                      <img
                        src={recommendedTeamsSvg}
                        alt=""
                        className="w-[85px] h-[85px] object-contain group-hover:-translate-y-1 transition-transform"
                      />
                    </div>
                    <span className="font-bold text-[#000000] text-left leading-tight text-base mt-auto">
                      Recommended <br /> teams
                    </span>
                  </Link>
                </motion.div>

                {/* Create a new team Card */}
                <motion.div variants={itemVariants}>
                  <Link
                    to="/teams?create=true"
                    viewTransition
                    title="Create a New Team"
                    className="bg-brand-card rounded-brand-input shadow-brand-card p-4 flex flex-col justify-end items-start relative overflow-visible h-[140px] group transition-all focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                  >
                    <img
                      src={createTeamSvg}
                      alt=""
                      className="absolute -top-4 right-3 w-[65px] h-[65px] object-contain group-hover:-translate-y-1 transition-transform"
                    />
                    <span className="font-bold text-[#000000] text-left leading-tight text-base mt-auto">
                      Create a new <br /> team
                    </span>
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Floating Chatbot Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <ChatbotButton />
              </TooltipTrigger>
              <TooltipContent side="left" sideOffset={8}>
                <p>Talk to EduBridge Chatbot</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
};

export default HomePage;
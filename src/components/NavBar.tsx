import { useLocation, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { Home, Library, Users, User } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { id: "home", icon: Home, label: "Home", path: "/" },
  { id: "idea-library", icon: Library, label: "Idea Library", path: "/ideas-lib" },
  { id: "teams", icon: Users, label: "Teams", path: "/teams" },
  { id: "profile", icon: User, label: "Profile", path: "/bridge/:userId" },
];

const shouldReduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion() || shouldReduceMotion;

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  }

  const handleNavigation = (path: string, id: string) => {
    if (!isActive(navItems.find((item) => item.id === id)?.path || "")) {
      navigate(path, { viewTransition: true });
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full lg:max-w-[70dvh] lg:px-6">
        <nav className="relative mx-auto flex h-[72px] items-center justify-evenly rounded-t-2xl bg-brand-secondary shadow-brand-card">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => handleNavigation(item.path, item.id)}
                    className="relative flex h-full w-[68px] items-center justify-center focus:outline-none group"
                    aria-label={item.label}
                    aria-current={active ? "page" : undefined}
                    whileTap={reduceMotion ? {} : { scale: 0.92 }}
                    transition={{ duration: 0.15 }}
                  >
                    {active && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 z-0 flex items-center justify-center"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      >
                        <div className="absolute -top-3 left-1/2 h-[72px] w-[72px] -translate-x-1/2 rounded-full border-4 border-brand-background bg-brand-secondary shadow-sm">
                        </div>
                      </motion.div>
                    )}

                    <Icon
                      className={cn(
                        "relative z-10 transition-all duration-300",
                        active
                          ? "h-7 w-7 text-brand-background -translate-y-3"
                          : "h-[22px] w-[22px] text-brand-background/70 group-hover:text-brand-background group-hover:-translate-y-1"
                      )}
                      strokeWidth={active ? 2 : 1.5}
                    />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  sideOffset={16}
                  className="bg-brand-secondary text-brand-background border border-brand-background/20 rounded-xl px-3 py-1.5 shadow-brand-card font-semibold animate-in zoom-in-95 data-[state=closed]:zoom-out-95"
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </div>
    </TooltipProvider>
  );
};

export default NavBar;
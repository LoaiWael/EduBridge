import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { forwardRef, type MouseEventHandler } from "react";
import { useNavigate } from "react-router-dom";
import { motion, type HTMLMotionProps } from "framer-motion";

type ChatbotButtonProps = Omit<HTMLMotionProps<"button">, "onClick"> & {
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const ChatbotButton = forwardRef<HTMLButtonElement, ChatbotButtonProps>(({ className, ...props }, ref) => {
  const navigate = useNavigate();

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    props.onClick?.(e);
    navigate('/chatbot', { viewTransition: true });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          ref={ref}
          {...props}
          onClick={handleClick}
          className="fixed bottom-[100px] right-6 w-14 h-14 rounded-full flex items-center justify-center text-white z-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-pink/50 overflow-hidden"
          aria-label="Open Chatbot"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 bg-linear-to-br from-brand-primary via-brand-pink to-brand-primary"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ backgroundSize: "200% 200%" }}
          />
          {/* Shadow layer */}
          <motion.div
            className="absolute inset-0 rounded-full shadow-[0px_4px_20px_rgba(211,140,210,0.5)]"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Glow effect on hover */}
          <motion.div
            className="absolute inset-0 rounded-full bg-white/20 blur-md"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          {/* Icon container */}
          <div className="relative z-10 w-[30px] h-[30px] rounded-[10px] border-[2.5px] border-white flex flex-col justify-center items-center opacity-90">
            <div className="w-[14px] h-[2.5px] bg-white rounded-full mt-0.5"></div>
            <div className="absolute -bottom-[2.5px] -right-[2px] w-[6px] h-[6px] bg-white transform rotate-45 rounded-sm"></div>
          </div>
        </motion.button>
      </TooltipTrigger>
      <TooltipContent
        side="left"
        sideOffset={8}
        className="p-0 overflow-hidden border-0"
        hideArrow={true}
      >
        <motion.div
          className="relative px-4 py-2.5 bg-linear-to-r from-brand-primary via-brand-pink to-brand-primary"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ backgroundSize: "200% 200%" }}
        >
          {/* Shimmer overlay */}
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.p
            className="relative text-white font-medium text-sm"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Talk to EduBridge Chatbot
          </motion.p>
        </motion.div>
      </TooltipContent>
    </Tooltip>
  );
});

ChatbotButton.displayName = "ChatbotButton";
export default ChatbotButton;

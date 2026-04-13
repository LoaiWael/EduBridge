import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";

const ChatbotButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => {
  const navigate = useNavigate();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          ref={ref}
          {...props}
          onClick={() => navigate('/chatbot', { viewTransition: true })}
          className="fixed bottom-[100px] right-6 w-14 h-14 rounded-full bg-linear-to-b from-brand-primary to-brand-pink shadow-[0px_4px_16px_rgba(211,140,210,0.4)] flex items-center justify-center text-white hover:scale-105 transition-transform z-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-pink/50"
          aria-label="Open Chatbot"
        >
          <div className="w-[30px] h-[30px] rounded-[10px] border-[2.5px] border-white flex flex-col justify-center items-center opacity-90 relative">
            <div className="w-[14px] h-[2.5px] bg-white rounded-full mt-0.5"></div>
            {/* Chat tail */}
            <div className="absolute -bottom-[2.5px] -right-[2px] w-[6px] h-[6px] bg-white transform rotate-45 rounded-sm"></div>
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent side="left" sideOffset={8}>
        <p>Talk to EduBridge Chatbot</p>
      </TooltipContent>
    </Tooltip >
  );
});

ChatbotButton.displayName = "ChatbotButton";
export default ChatbotButton;

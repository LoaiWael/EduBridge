import React from "react";
import { motion } from "framer-motion";
import { type ChatMessageData } from "../store/useChatbotStore";

const ChatMessage: React.FC<Omit<ChatMessageData, "id">> = ({ text, isBot, timestamp, senderName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col mb-4 max-w-[85%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-md w-fit ${isBot ? "self-start" : "self-end"}`}
    >
      <div
        className={`px-5 py-3.5 rounded-brand-input ${isBot
          ? "bg-brand-card text-brand-text-primary rounded-bl-sm"
          : "bg-brand-secondary text-white rounded-br-sm overflow-clip"
          }`}
      >
        <p className="text-brand-body-sm font-medium leading-relaxed">{text}</p>
      </div>

      <div
        className={`mt-1.5 flex items-center gap-1.5 px-1 ${isBot ? "self-start" : "self-end"
          }`}
      >
        <span className="text-[11px] font-semibold text-brand-dark-grey opacity-80">
          {senderName}
        </span>
        <span className="text-[11px] font-medium text-brand-dark-grey opacity-70">
          {timestamp}
        </span>
      </div>
    </motion.div>
  );
};

export default ChatMessage;

import React, { useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [text, setText] = useState("");

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (text.trim() && !isLoading) {
      onSend(text.trim());
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <form
      onSubmit={handleSend}
      className="flex items-center w-full bg-brand-card rounded-brand-input pl-2 pr-2 shadow-[0_2px_20px_rgba(0,0,0,0.085)]"
    >
      <input
        type="text"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent border-none focus:ring-0 outline-none px-4 py-3.5 h-full text-brand-body-sm text-brand-text-primary placeholder:text-brand-dark-grey/60 disabled:opacity-50"
        disabled={isLoading}
      />

      <div className="flex items-center gap-1 pl-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              disabled={isLoading}
              className="p-2 text-brand-dark-grey/70 hover:text-brand-text-primary transition-colors focus:outline-none"
              aria-label="Attach file"
            >
              <Paperclip size={18} strokeWidth={2} className="opacity-80" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">Attach file (Coming soon)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="submit"
              disabled={isLoading || !text.trim()}
              className="p-2 text-brand-dark-grey/70 hover:text-brand-text-primary transition-colors focus:outline-none disabled:opacity-50"
              aria-label="Send message"
            >
              <Send size={18} strokeWidth={2.5} className="opacity-80 -ml-0.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">Send message</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </form>
  );
};

export default ChatInput;

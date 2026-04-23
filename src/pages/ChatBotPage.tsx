import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfileStore } from "@/features/profile";
import { ChatMessage, ChatInput, useChatbotStore } from "@/features/chatbot";
import BackButton from "@/components/BackButton";
import { TooltipProvider } from "@/components/ui/tooltip";

const ChatBotPage = () => {
  const userName = useProfileStore(state => state.firstName) || "Olivia";

  const messages = useChatbotStore(state => state.messages);
  const addMessage = useChatbotStore(state => state.addMessage);
  const isTyping = useChatbotStore(state => state.isTyping);
  const setIsTyping = useChatbotStore(state => state.setIsTyping);
  const clearMessages = useChatbotStore(state => state.clearMessages);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "EduBridge - Ask anything";
    // Optional: Clear on mount
    return () => clearMessages()
  }, [clearMessages]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();

    // 1. Send User Message
    addMessage({
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp,
      senderName: userName
    });

    setIsTyping(true);

    // 2. Simulate Bot Delay
    setTimeout(() => {
      const botTimestamp = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
      addMessage({
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm still under mentainance i can't help you right now.",
        isBot: true,
        timestamp: botTimestamp,
        senderName: "EduBridge"
      });
      setIsTyping(false);
    }, 500);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative min-h-screen w-full overflow-hidden flex flex-col bg-brand-background"
      >
        {/* Cool Animated Gradient Background spanning full screen purely behind UI */}
        <motion.div
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 z-0 opacity-40 bg-[linear-gradient(45deg,var(--brand-primary),var(--brand-background),var(--brand-pink),var(--brand-background),var(--brand-primary))] bg-size-[300%_300%]"
        />

        <div className="relative z-10 flex flex-col h-screen w-full">
          {/* Top Navigation - Unconstrained Full Width */}
          <div className="flex items-center w-full px-6 py-6 pb-2 relative shrink-0">
            <div className="absolute left-6 z-20">
              <BackButton />
            </div>

            <h1 className="w-full text-center font-bold text-lg text-brand-text-primary">
              Ask anything
            </h1>
          </div>

          {/* Constrained Chat Area */}
          <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto overflow-hidden relative">

            {/* Messaging Scroll Area */}
            <div className="flex-1 overflow-y-auto px-6 pt-10 pb-6 hide-scrollbar relative">
              <AnimatePresence>
                {messages.length === 0 ? (
                  // Empty State
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 flex flex-col items-center justify-center -mt-20 pointer-events-none"
                  >
                    <h2 className="text-[28px] leading-tight font-bold text-[#868A9A] text-center">
                      Need help?<br />I'm here for you
                    </h2>
                  </motion.div>
                ) : (
                  // Active Messages
                  <motion.div
                    key="messages"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col relative z-20 min-h-full justify-end"
                  >
                    <div className="w-full flex flex-col">
                      {messages.map((msg) => (
                        <motion.div key={msg.id} layout className="w-full flex flex-col">
                          <ChatMessage {...msg} />
                        </motion.div>
                      ))}

                      {/* Typing Indicator / Skeleton Mock */}
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="self-start mb-4"
                        >
                          <div className="bg-brand-card rounded-brand-input rounded-bl-sm px-4 py-3.5 flex gap-1.5 items-center w-fit">
                            <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-brand-dark-grey/50 rounded-full" />
                            <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-brand-dark-grey/50 rounded-full" />
                            <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-brand-dark-grey/50 rounded-full" />
                          </div>
                        </motion.div>
                      )}

                      <div ref={endOfMessagesRef} className="h-2" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sticky Input Footer */}
            <div className="px-5 pb-6 pt-2 shrink-0 relative z-20">
              <ChatInput onSend={handleSendMessage} isLoading={isTyping} />
            </div>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export default ChatBotPage;
import { create } from "zustand";

export interface ChatMessageData {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
  senderName: string;
}

interface ChatbotState {
  messages: ChatMessageData[];
  isTyping: boolean;
  addMessage: (message: ChatMessageData) => void;
  setIsTyping: (typing: boolean) => void;
  clearMessages: () => void;
}

export const useChatbotStore = create<ChatbotState>((set) => ({
  messages: [],
  isTyping: false,
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setIsTyping: (typing) => set({ isTyping: typing }),
  clearMessages: () => set({ messages: [] }),
}));

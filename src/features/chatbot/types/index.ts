/**
 * Chat message
 */
export interface Message {
  id: string;
  sessionId: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: Date;
}

/**
 * Chat session
 */
export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
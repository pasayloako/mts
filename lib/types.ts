// lib/types.ts

export type MessageSender = "bot" | "user";

export interface ChatMessage {
  id: string;
  text: string;
  sender: MessageSender;
  timestamp: Date;
}

export interface ChatSession {
  id: number;
  title: string;
  messages: ChatMessage[];
}

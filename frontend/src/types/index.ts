export type Role = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  streaming?: boolean;
  error?: string;
  attachments?: FileAttachment[];
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface KnowledgeDoc {
  filename: string;
  size?: number;
  chunks?: number;
  indexed_at?: string;
  status?: string;
  [key: string]: unknown;
}

export interface Settings {
  temperature: number;
  topP: number;
  maxTokens: number;
  streaming: boolean;
  model: string;
}

export type ConnectionStatus = "online" | "offline" | "checking";



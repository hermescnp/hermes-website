// 1. Message types
export type MessageType = 'user' | 'system' | 'agent' | 'admin'

// 2. Message object
export interface BotMessage {
  type: MessageType
  content: string
}

export type MessageDirection = "outgoing" | "incoming";

export type ChatMessage = {
  id: string;
  body: string;
  direction: MessageDirection;
  timestamp: number;
};

export type ConnectionStatus = "idle" | "connecting" | "connected" | "disconnected" | "error";

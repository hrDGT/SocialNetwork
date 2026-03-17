export type MessageDirection = "outgoing" | "incoming";

export type ChatMessage = {
  id: number;
  body: string;
  direction: MessageDirection;
  timestamp: number;
};

export type ConnectionStatus = "idle" | "connecting" | "connected" | "disconnected" | "error";

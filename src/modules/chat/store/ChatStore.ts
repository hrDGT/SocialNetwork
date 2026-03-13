import { makeAutoObservable, runInAction } from "mobx";
import type { ChatMessage, ConnectionStatus } from "../types";

const WS_URL = "wss://ws.ifelse.io";

class ChatStore {
  messages: Record<number, ChatMessage[]> = {};
  status: ConnectionStatus = "idle";
  activeUserId: number | null = null;

  private socket: WebSocket | null = null;
  private pendingEchoBodies: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get currentMessages(): ChatMessage[] {
    if (this.activeUserId === null) return [];
    return this.messages[this.activeUserId] ?? [];
  }

  get isConnected(): boolean {
    return this.status === "connected";
  }

  connect(userId: number) {
    if (
      this.socket &&
      this.socket.readyState === WebSocket.OPEN &&
      this.activeUserId === userId
    ) return;

    this.disconnect();
    this.activeUserId = userId;
    this.status = "connecting";

    if (!this.messages[userId]) {
      this.messages[userId] = [];
    }

    const ws = new WebSocket(WS_URL);
    this.socket = ws;

    ws.onopen = () => {
      runInAction(() => { this.status = "connected"; });
    };

    ws.onmessage = (event: MessageEvent) => {
      const body = typeof event.data === "string" ? event.data.trim() : "";
      if (!body || this.activeUserId === null) return;

      runInAction(() => {
        if (this.activeUserId === null) return;

        const idx = this.pendingEchoBodies.indexOf(body);
        if (idx === -1) return;

        this.pendingEchoBodies.splice(idx, 1);

        const incoming: ChatMessage = {
          id: `in-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          body,
          direction: "incoming",
          timestamp: Date.now(),
        };

        this.messages[this.activeUserId] = [
          ...(this.messages[this.activeUserId] ?? []),
          incoming,
        ];
      });
    };

    ws.onerror = () => {
      runInAction(() => { this.status = "error"; });
    };

    ws.onclose = () => {
      runInAction(() => {
        if (this.status !== "idle") this.status = "disconnected";
      });
    };
  }

  send(body: string) {
    const trimmed = body.trim();
    if (!trimmed || !this.socket || !this.activeUserId) return;
    if (this.socket.readyState !== WebSocket.OPEN) return;

    const outgoing: ChatMessage = {
      id: `out-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      body: trimmed,
      direction: "outgoing",
      timestamp: Date.now(),
    };

    this.messages[this.activeUserId] = [
      ...(this.messages[this.activeUserId] ?? []),
      outgoing,
    ];

    this.pendingEchoBodies.push(trimmed);
    this.socket.send(trimmed);
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
    this.status = "idle";
    this.pendingEchoBodies = [];
  }
}

export const chatStore = new ChatStore();

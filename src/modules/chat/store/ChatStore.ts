import { makeAutoObservable, runInAction } from "mobx";
import type { ChatMessage, ConnectionStatus } from "../types";

const WS_URL = "wss://ws.ifelse.io";
const msgId = (() => { let n = 0; return () => n++; })();

class ChatStore {
  messages: Record<number, ChatMessage[]> = {};
  status: ConnectionStatus = "idle";
  activeUserId: number | null = null;
  private socket: WebSocket | null = null;
  private pendingEchoes: string[] = [];

  constructor() { makeAutoObservable(this); }

  get currentMessages(): ChatMessage[] {
    return this.activeUserId !== null ? (this.messages[this.activeUserId] ?? []) : [];
  }

  get isConnected(): boolean { return this.status === "connected"; }

  connect(userId: number) {
    if (this.socket?.readyState === WebSocket.OPEN && this.activeUserId === userId) return;
    this.disconnect();
    this.activeUserId = userId;
    this.status = "connecting";
    this.messages[userId] ??= [];

    const ws = (this.socket = new WebSocket(WS_URL));

    ws.onopen = () => runInAction(() => { this.status = "connected"; });
    ws.onerror = () => runInAction(() => { this.status = "error"; });
    ws.onclose = () => runInAction(() => { if (this.status !== "idle") this.status = "disconnected"; });

    ws.onmessage = ({ data }: MessageEvent) => {
      const body = typeof data === "string" ? data.trim() : "";
      const idx = body ? this.pendingEchoes.indexOf(body) : -1;
      if (idx === -1 || this.activeUserId === null) return;

      runInAction(() => {
        this.pendingEchoes.splice(idx, 1);
        this.messages[this.activeUserId!].push({
          id: msgId(), body, direction: "incoming", timestamp: Date.now(),
        });
      });
    };
  }

  send(body: string) {
    const trimmed = body.trim();
    if (!trimmed || this.socket?.readyState !== WebSocket.OPEN || !this.activeUserId) return;

    this.messages[this.activeUserId].push({
      id: msgId(), body: trimmed, direction: "outgoing", timestamp: Date.now(),
    });
    this.pendingEchoes.push(trimmed);
    this.socket.send(trimmed);
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
    this.status = "idle";
    this.pendingEchoes = [];
  }
}

export const chatStore = new ChatStore();
export { ChatStore };

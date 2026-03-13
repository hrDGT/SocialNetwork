import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { Avatar, CircularProgress, IconButton, TextField } from "@mui/material";
import { Link } from "@tanstack/react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import { useUserDetail } from "../../../users/hooks/useUserDetail";
import { chatStore } from "../../store/ChatStore";
import { authStore } from "../../../auth";
import styles from "./ChatWindow.module.css";

type ChatWindowProps = { chatId: number };

export default observer(function ChatWindow({ chatId }: ChatWindowProps) {
  const { data: user } = useUserDetail(chatId);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chatId) return;
    chatStore.connect(chatId);
    return () => { chatStore.disconnect(); };
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ behavior: "smooth" });
  });

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    chatStore.send(trimmed);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const canSend = chatStore.isConnected && input.trim().length > 0;

  const interlocutorInitials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "?";

  const myInitials = authStore.user
    ? `${authStore.user.firstName[0]}${authStore.user.lastName[0]}`.toUpperCase()
    : "?";

  return (
    <div className={styles.wrapper}>

      <div className={styles["top-bar"]}>
        <div className={styles["top-bar-inner"]}>
          <Link to="/users/$userId" params={{ userId: String(chatId) }} className={styles.back}>
            <ArrowBackIcon sx={{ fontSize: 20 }} />
          </Link>
          <Avatar src={user?.image} sx={{ width: 36, height: 36, fontSize: 13, bgcolor: "primary.main" }}>
            {interlocutorInitials}
          </Avatar>
          <div>
            <p className={styles["top-name"]}>
              {user ? `${user.firstName} ${user.lastName}` : "…"}
            </p>
            <div className={styles["status-row"]}>
              <span className={
                chatStore.status === "connected" ? styles["dot-connected"]
                : chatStore.status === "connecting" ? styles["dot-connecting"]
                : styles["dot-disconnected"]
              } />
              <span className={styles["status-label"]}>
                {chatStore.status === "connected" ? "online"
                : chatStore.status === "connecting" ? "connecting…"
                : chatStore.status === "error" ? "error"
                : "offline"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles["messages-area"]}>
        <div className={styles["messages-inner"]}>
          {chatStore.status === "connecting" && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <CircularProgress size={24} />
            </div>
          )}

          {chatStore.currentMessages.length === 0 && chatStore.isConnected && (
            <p className={styles["empty-hint"]}>Send a message to start the conversation</p>
          )}

          {chatStore.currentMessages.map((msg) => {
            const isOut = msg.direction === "outgoing";
            return (
              <div key={msg.id} className={isOut ? styles["message-row-out"] : styles["message-row"]}>
                <Avatar
                  src={isOut ? undefined : user?.image}
                  sx={{ width: 28, height: 28, fontSize: 11, bgcolor: "primary.main", flexShrink: 0 }}
                >
                  {isOut ? myInitials : interlocutorInitials}
                </Avatar>
                <div className={isOut ? styles["bubble-out"] : styles["bubble-in"]}>
                  <p className={styles["bubble-text"]}>{msg.body}</p>
                  <p className={styles["bubble-time"]}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className={styles["input-bar"]}>
        <div className={styles["input-inner"]}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            size="small"
            placeholder={chatStore.isConnected ? "Message… (Enter to send)" : "Connecting…"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ bgcolor: "background.default" }}
          />
          <IconButton onClick={handleSend} disabled={!canSend}>
            <SendIcon sx={{ fontSize: 20, color: canSend ? "primary.main" : "text.disabled" }} />
          </IconButton>
        </div>
      </div>

    </div>
  );
});

import { ChatWindow } from "../../modules/chat";

type ChatPageProps = {
  chatId: number;
};

export default function ChatPage({ chatId }: ChatPageProps) {
  return <ChatWindow chatId={chatId} />;
}

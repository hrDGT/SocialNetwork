import { createFileRoute, redirect } from "@tanstack/react-router";
import ChatPage from "../../pages/ChatPage/ChatPage";
import { authStore } from "../../modules/auth";

export const Route = createFileRoute("/chat/$chatId")({
  beforeLoad: () => {
    if (!authStore.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: ChatRoute,
});

function ChatRoute() {
  const { chatId } = Route.useParams();
  return <ChatPage chatId={Number(chatId)} />;
}

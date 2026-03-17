import { createFileRoute } from "@tanstack/react-router";
import UserPage from "../../pages/UserPage/UserPage";

export const Route = createFileRoute("/users/$userId")({
  component: UserDetailRoute,
});

function UserDetailRoute() {
  const { userId } = Route.useParams();
  return <UserPage userId={Number(userId)} />;
}

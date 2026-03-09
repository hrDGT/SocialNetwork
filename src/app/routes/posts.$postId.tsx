import { createFileRoute } from "@tanstack/react-router";
import PostPage from "../../pages/PostPage/PostPage";

export const Route = createFileRoute("/posts/$postId")({
  component: PostDetailRoute,
});

function PostDetailRoute() {
  const { postId } = Route.useParams();
  return <PostPage postId={Number(postId)} />;
}
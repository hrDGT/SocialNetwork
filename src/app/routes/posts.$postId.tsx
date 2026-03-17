import { createFileRoute } from "@tanstack/react-router";
import { PostPage } from "../../pages";

export const Route = createFileRoute("/posts/$postId")({
  component: PostPageRoute,
});

function PostPageRoute() {
  const { postId } = Route.useParams();
  return <PostPage postId={Number(postId)} />;
}

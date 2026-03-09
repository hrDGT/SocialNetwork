import PostDetail from "../../modules/posts/components/PostDetail/PostDetail";

type PostPageProps = {
  postId: number;
};

export default function PostPage({ postId }: PostPageProps) {
  return <PostDetail postId={postId} />;
}

import { useQuery } from "@tanstack/react-query";
import { postsApi } from "../api/postsApi";

export function usePostComments(postId: number, limit?: number) {
  return useQuery({
    queryKey: ["posts", postId, "comments", limit],
    queryFn: () => postsApi.fetchComments({ postId, limit }),
    enabled: postId > 0,
  });
}

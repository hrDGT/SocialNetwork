import { useQuery } from "@tanstack/react-query";
import { postsApi } from "../api/postsApi";

export function usePostDetail(postId: number) {
  return useQuery({
    queryKey: ["posts", postId],
    queryFn: () => postsApi.fetchById(postId),
    enabled: postId > 0,
  });
}

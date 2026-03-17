import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "../api/postsApi";
import type { CreateCommentPayload } from "../types";

export function useCreateComment(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCommentPayload) => postsApi.createComment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", postId, "comments"] });
    },
  });
}

import type {
  Comment,
  CommentsResponse,
  CreateCommentPayload,
  FetchCommentsParams,
  FetchPostsParams,
  Post,
  PostsResponse,
} from "../types";

const BASE_URL = "https://dummyjson.com";

export const postsApi = {
  fetchPage: async ({ limit, skip }: FetchPostsParams): Promise<PostsResponse> => {
    const response = await fetch(`${BASE_URL}/posts?limit=${limit}&skip=${skip}`);
    if (!response.ok) throw new Error(`Failed to fetch posts: ${response.statusText}`);
    return response.json();
  },

  fetchById: async (id: number): Promise<Post> => {
    const response = await fetch(`${BASE_URL}/posts/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch post: ${response.statusText}`);
    return response.json();
  },

  fetchComments: async ({ postId, limit, skip = 0 }: FetchCommentsParams): Promise<CommentsResponse> => {
    const params = new URLSearchParams({ skip: String(skip) });
    if (limit !== undefined) params.set("limit", String(limit));
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments?${params}`);
    if (!response.ok) throw new Error(`Failed to fetch comments: ${response.statusText}`);
    return response.json();
  },

  createComment: async (payload: CreateCommentPayload): Promise<Comment> => {
    const response = await fetch(`${BASE_URL}/comments/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Failed to create comment: ${response.statusText}`);
    return response.json();
  },
};

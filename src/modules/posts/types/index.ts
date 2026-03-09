export type PostReactions = {
  likes: number;
  dislikes: number;
};

export type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: PostReactions;
  views: number;
};

export type PostsResponse = {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
};

export type FetchPostsParams = {
  limit: number;
  skip: number;
};

export type CommentUser = {
  id: number;
  username: string;
  fullName: string;
};

export type Comment = {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: CommentUser;
};

export type CommentsResponse = {
  comments: Comment[];
  total: number;
  skip: number;
  limit: number;
};

export type FetchCommentsParams = {
  postId: number;
  limit?: number;
  skip?: number;
};

export type CreateCommentPayload = {
  body: string;
  postId: number;
  userId: number;
};

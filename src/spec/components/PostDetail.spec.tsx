import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { authStore } from "../../modules/auth/store/AuthStore";
import { usePostDetail } from "../../modules/posts/hooks/usePostDetail";
import { usePostComments } from "../../modules/posts/hooks/usePostComments";
import PostDetail from "../../modules/posts/components/PostDetail/PostDetail";
import type { Post, CommentsResponse } from "../../modules/posts/types";
import type { AuthUser } from "../../modules/auth/types";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, className }: any) => (
    <a href={to} className={className}>{children}</a>
  ),
}));

vi.mock("../../modules/posts/hooks/usePostDetail", () => ({
  usePostDetail: vi.fn(),
}));

vi.mock("../../modules/posts/hooks/usePostComments", () => ({
  usePostComments: vi.fn(),
}));

vi.mock("../../modules/posts/components/CommentForm/CommentForm", () => ({
  default: () => <div data-testid="comment-form" />,
}));

vi.mock("../../modules/posts/components/CommentCard/CommentCard", () => ({
  default: ({ comment }: any) => <div data-testid="comment-card">{comment.body}</div>,
}));

const mockPost: Post = {
  id: 5,
  title: "A great article",
  body: "Lots of interesting content here.",
  userId: 1,
  tags: ["tech", "react"],
  reactions: { likes: 20, dislikes: 2 },
  views: 500,
};

const mockComments: CommentsResponse = {
  comments: [
    { id: 1, body: "Nice post!", postId: 5, likes: 3, user: { id: 1, username: "alice", fullName: "Alice" } },
  ],
  total: 1,
  skip: 0,
  limit: 10,
};

const mockUser: AuthUser = {
  id: 1, username: "u", firstName: "A", lastName: "B",
  email: "a@b.com", image: "", token: "t",
};

describe("PostDetail", () => {
  beforeEach(() => {
    authStore.logout();
  });

  describe("while loading", () => {
    beforeEach(() => {
      vi.mocked(usePostDetail).mockReturnValue({ isLoading: true, isError: false, data: undefined } as any);
      vi.mocked(usePostComments).mockReturnValue({ isLoading: true, isError: false, data: undefined } as any);
      render(<PostDetail postId={5} />);
    });

    it("does not render the post title", () => {
      expect(screen.queryByText("A great article")).toBeNull();
    });

    it("renders the back link", () => {
      expect(screen.queryByText(/back to feed/i)).not.toBeNull();
    });
  });

  describe("when loading fails", () => {
    beforeEach(() => {
      vi.mocked(usePostDetail).mockReturnValue({
        isLoading: false, isError: true,
        error: { message: "Post not found" }, refetch: vi.fn(), data: undefined,
      } as any);
      vi.mocked(usePostComments).mockReturnValue({ isLoading: false, isError: false, data: undefined } as any);
      render(<PostDetail postId={5} />);
    });

    it("renders the error message", () => {
      expect(screen.queryByText("Post not found")).not.toBeNull();
    });
  });

  describe("when post loads successfully", () => {
    beforeEach(() => {
      vi.mocked(usePostDetail).mockReturnValue({ isLoading: false, isError: false, data: mockPost } as any);
      vi.mocked(usePostComments).mockReturnValue({ isLoading: false, isError: false, data: mockComments } as any);
      render(<PostDetail postId={5} />);
    });

    it("renders the post title", () => {
      expect(screen.queryByText("A great article")).not.toBeNull();
    });

    it("renders the post id", () => {
      expect(screen.queryByText("#005")).not.toBeNull();
    });

    it("renders the view count", () => {
      expect(screen.queryByText(/500 views/)).not.toBeNull();
    });

    it("renders the like count", () => {
      expect(screen.queryByText(/20 likes/)).not.toBeNull();
    });

    it("renders the post body", () => {
      expect(screen.queryByText("Lots of interesting content here.")).not.toBeNull();
    });

    it("renders the tags", () => {
      expect(screen.queryByText("tech")).not.toBeNull();
      expect(screen.queryByText("react")).not.toBeNull();
    });

    it("renders the comment", () => {
      expect(screen.queryByText("Nice post!")).not.toBeNull();
    });

    it("renders the comment count in the heading", () => {
      expect(screen.queryByText("Comments (1)")).not.toBeNull();
    });
  });

  describe("comment form — unauthenticated user", () => {
    beforeEach(() => {
      vi.mocked(usePostDetail).mockReturnValue({ isLoading: false, isError: false, data: mockPost } as any);
      vi.mocked(usePostComments).mockReturnValue({ isLoading: false, isError: false, data: mockComments } as any);
      render(<PostDetail postId={5} />);
    });

    it("does not render the comment form", () => {
      expect(screen.queryByTestId("comment-form")).toBeNull();
    });

    it("renders the sign in prompt", () => {
      expect(screen.queryByText(/to leave a comment/i)).not.toBeNull();
    });

    it("renders a link to /login", () => {
      expect(screen.queryByText("Sign in")?.closest("a")).toHaveAttribute("href", "/login");
    });
  });

  describe("comment form — authenticated user", () => {
    beforeEach(() => {
      authStore.setUser(mockUser);
      vi.mocked(usePostDetail).mockReturnValue({ isLoading: false, isError: false, data: mockPost } as any);
      vi.mocked(usePostComments).mockReturnValue({ isLoading: false, isError: false, data: mockComments } as any);
      render(<PostDetail postId={5} />);
    });

    it("renders the comment form", () => {
      expect(screen.queryByTestId("comment-form")).not.toBeNull();
    });

    it("does not render the sign in prompt", () => {
      expect(screen.queryByText(/to leave a comment/i)).toBeNull();
    });
  });
});

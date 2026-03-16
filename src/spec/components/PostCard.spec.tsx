import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { authStore } from "../../modules/auth/store/AuthStore";
import { likesStore } from "../../modules/likes";
import type { Post } from "../../modules/posts/types";
import type { AuthUser } from "../../modules/auth/types";

const mockNavigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, className, params }: any) => (
    <a href={`${to}/${params?.postId ?? ""}`} className={className}>{children}</a>
  ),
  useNavigate: () => mockNavigate,
}));

vi.mock("../../modules/posts/components/CommentsPreview/CommentsPreview", () => ({
  default: ({ postId }: { postId: number }) => (
    <div data-testid="comments-preview" data-post-id={postId} />
  ),
}));

import PostCard from "../../modules/posts/components/PostCard/PostCard";

const mockPost: Post = {
  id: 1,
  title: "How to test React components",
  body: "Testing is important for software quality.",
  userId: 1,
  tags: ["testing", "react"],
  reactions: { likes: 42, dislikes: 3 },
  views: 1200,
};

const mockUser: AuthUser = {
  id: 5, username: "user", firstName: "A", lastName: "B",
  email: "a@b.com", image: "", token: "t",
};

describe("PostCard", () => {
  beforeEach(() => {
    localStorage.clear();
    likesStore.likedPosts.clear();
    authStore.logout();
    mockNavigate.mockClear();
  });

  describe("content rendering", () => {
    beforeEach(() => {
      render(<PostCard post={mockPost} index={0} />);
    });

    it("renders the post title", () => {
      expect(screen.queryByText("How to test React components")).not.toBeNull();
    });

    it("renders the post id padded to 3 digits", () => {
      expect(screen.queryByText("#001")).not.toBeNull();
    });

    it("renders the view count", () => {
      expect(screen.queryByText(/1.?200/)).not.toBeNull();
    });

    it("renders the tags", () => {
      expect(screen.queryByText("testing")).not.toBeNull();
      expect(screen.queryByText("react")).not.toBeNull();
    });

    it("renders the comments preview", () => {
      expect(screen.queryByTestId("comments-preview")).not.toBeNull();
    });

    it("renders a link to the post detail page", () => {
      expect(screen.getByText(/view post/i).closest("a"))
        .toHaveAttribute("href", "/posts/$postId/1");
    });
  });

  describe("like button — unauthenticated user", () => {
    beforeEach(() => {
      render(<PostCard post={mockPost} index={0} />);
    });

    it("shows the original like count", () => {
      expect(screen.queryByText("42")).not.toBeNull();
    });

    it("redirects to /login when clicked", async () => {
      await userEvent.click(screen.getByText("42").closest("button")!);

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/login" });
    });

    it("does not add the post to likes", async () => {
      await userEvent.click(screen.getByText("42").closest("button")!);

      expect(likesStore.isLiked(mockPost.id)).toBe(false);
    });
  });

  describe("like button — authenticated user", () => {
    beforeEach(() => {
      authStore.setUser(mockUser);
      render(<PostCard post={mockPost} index={0} />);
    });

    describe("when liking a post", () => {
      beforeEach(async () => {
        await userEvent.click(screen.getByText("42").closest("button")!);
      });

      it("adds the post to likes", () => {
        expect(likesStore.isLiked(mockPost.id)).toBe(true);
      });

      it("increments the like count", () => {
        expect(screen.queryByText("43")).not.toBeNull();
      });

      it("does not navigate to /login", () => {
        expect(mockNavigate).not.toHaveBeenCalledWith({ to: "/login" });
      });
    });

    describe("when unliking an already liked post", () => {
      beforeEach(async () => {
        const btn = screen.getByText("42").closest("button")!;
        await userEvent.click(btn);
        await userEvent.click(btn);
      });

      it("removes the post from likes", () => {
        expect(likesStore.isLiked(mockPost.id)).toBe(false);
      });

      it("decrements the like count back to original", () => {
        expect(screen.queryByText("42")).not.toBeNull();
      });
    });
  });
});

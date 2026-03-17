import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Post } from "../../modules/posts";

vi.mock("../../modules/posts/hooks/usePostsFeed", () => ({
  usePostsFeed: vi.fn(),
}));

vi.mock("../../modules/posts/components/PostCard/PostCard", () => ({
  default: ({ post }: { post: Post }) => <div data-testid="post-card">{post.title}</div>,
}));

import { usePostsFeed } from "../../modules/posts/hooks/usePostsFeed";
import { Feed } from "../../modules/posts/components/Feed/Feed";

const makePosts = (count: number): Post[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Post title ${i + 1}`,
    body: "Body",
    userId: 1,
    tags: [],
    reactions: { likes: 0, dislikes: 0 },
    views: 0,
  }));

describe("Feed", () => {
  describe("while loading", () => {
    beforeEach(() => {
      vi.mocked(usePostsFeed).mockReturnValue({
        posts: [], hasMore: false, isLoading: true, isLoadingMore: false,
        isError: false, error: "", loadMore: vi.fn(), retry: vi.fn(), total: 0,
      } as unknown as ReturnType<typeof usePostsFeed>);
      render(<Feed />);
    });

    it("renders the loading spinner", () => {
      expect(screen.queryByText("Loading posts…")).not.toBeNull();
    });

    it("does not render any post cards", () => {
      expect(screen.queryAllByTestId("post-card")).toHaveLength(0);
    });
  });

  describe("when loading fails", () => {
    const retry = vi.fn();

    beforeEach(() => {
      vi.mocked(usePostsFeed).mockReturnValue({
        posts: [], hasMore: false, isLoading: false, isLoadingMore: false,
        isError: true, error: "Network error", loadMore: vi.fn(), retry, total: 0,
      } as unknown as ReturnType<typeof usePostsFeed>);
      render(<Feed />);
    });

    it("renders the error message", () => {
      expect(screen.queryByText("Network error")).not.toBeNull();
    });

    it("renders a retry button", () => {
      expect(screen.queryByRole("button", { name: /retry/i })).not.toBeNull();
    });

    it("calls retry when the button is clicked", async () => {
      await userEvent.click(screen.getByRole("button", { name: /retry/i }));

      expect(retry).toHaveBeenCalledOnce();
    });
  });

  describe("when posts load successfully", () => {
    beforeEach(() => {
      vi.mocked(usePostsFeed).mockReturnValue({
        posts: makePosts(3), hasMore: true, isLoading: false, isLoadingMore: false,
        isError: false, error: "", loadMore: vi.fn(), retry: vi.fn(), total: 3,
      } as unknown as ReturnType<typeof usePostsFeed>);
      render(<Feed />);
    });

    it("renders a card for each post", () => {
      expect(screen.queryAllByTestId("post-card")).toHaveLength(3);
    });

    it("renders the first post title", () => {
      expect(screen.queryByText("Post title 1")).not.toBeNull();
    });

    it("renders the third post title", () => {
      expect(screen.queryByText("Post title 3")).not.toBeNull();
    });

    it("does not render the end-of-feed message while there are more posts", () => {
      expect(screen.queryByText("You're all caught up")).toBeNull();
    });
  });

  describe("when all posts have been loaded", () => {
    beforeEach(() => {
      vi.mocked(usePostsFeed).mockReturnValue({
        posts: makePosts(2), hasMore: false, isLoading: false, isLoadingMore: false,
        isError: false, error: "", loadMore: vi.fn(), retry: vi.fn(), total: 2,
      } as unknown as ReturnType<typeof usePostsFeed>);
      render(<Feed />);
    });

    it("renders the end-of-feed message", () => {
      expect(screen.queryByText("You're all caught up")).not.toBeNull();
    });
  });

  describe("when loading more posts", () => {
    beforeEach(() => {
      vi.mocked(usePostsFeed).mockReturnValue({
        posts: makePosts(2), hasMore: true, isLoading: false, isLoadingMore: true,
        isError: false, error: "", loadMore: vi.fn(), retry: vi.fn(), total: 10,
      } as unknown as ReturnType<typeof usePostsFeed>);
      render(<Feed />);
    });

    it("renders the loading more spinner", () => {
      expect(screen.queryByText("Loading more…")).not.toBeNull();
    });
  });
});

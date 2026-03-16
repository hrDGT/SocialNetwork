import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { CommentsResponse } from "../../modules/posts/types";

vi.mock("../../modules/posts/hooks/usePostComments", () => ({
  usePostComments: vi.fn(),
}));

import { usePostComments } from "../../modules/posts/hooks/usePostComments";
import CommentsPreview from "../../modules/posts/components/CommentsPreview/CommentsPreview";

const mockComments: CommentsResponse = {
  comments: [
    { id: 1, body: "First comment", postId: 1, likes: 3, user: { id: 1, username: "alice", fullName: "Alice Smith" } },
    { id: 2, body: "Second comment", postId: 1, likes: 1, user: { id: 2, username: "bob", fullName: "Bob Jones" } },
  ],
  total: 2,
  skip: 0,
  limit: 3,
};

describe("CommentsPreview", () => {
  describe("while loading", () => {
    beforeEach(() => {
      vi.mocked(usePostComments).mockReturnValue({ data: undefined, isLoading: true, isError: false } as any);
      render(<CommentsPreview postId={1} />);
    });

    it("does not render comment text", () => {
      expect(screen.queryByText("First comment")).toBeNull();
    });
  });

  describe("when loading fails", () => {
    beforeEach(() => {
      vi.mocked(usePostComments).mockReturnValue({ data: undefined, isLoading: false, isError: true } as any);
      render(<CommentsPreview postId={1} />);
    });

    it("renders an error message", () => {
      expect(screen.queryByText("Failed to load comments")).not.toBeNull();
    });
  });

  describe("when comments load successfully", () => {
    beforeEach(() => {
      vi.mocked(usePostComments).mockReturnValue({ data: mockComments, isLoading: false, isError: false } as any);
      render(<CommentsPreview postId={1} />);
    });

    it("renders the section heading", () => {
      expect(screen.queryByText("Comments")).not.toBeNull();
    });

    it("renders the total comment count", () => {
      expect(screen.queryByText("2")).not.toBeNull();
    });

    it("renders the first comment body", () => {
      expect(screen.queryByText("First comment")).not.toBeNull();
    });

    it("renders the second comment body", () => {
      expect(screen.queryByText("Second comment")).not.toBeNull();
    });
  });

  describe("when there are no comments", () => {
    beforeEach(() => {
      vi.mocked(usePostComments).mockReturnValue({
        data: { ...mockComments, comments: [], total: 0 },
        isLoading: false,
        isError: false,
      } as any);
      render(<CommentsPreview postId={1} />);
    });

    it("renders an empty state message", () => {
      expect(screen.queryByText("No comments yet")).not.toBeNull();
    });
  });
});
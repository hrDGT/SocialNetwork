import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { CommentCard } from "../../modules/posts";
import type { Comment } from "../../modules/posts";

const mockComment: Comment = {
  id: 1,
  body: "This is a great post!",
  postId: 1,
  likes: 7,
  user: { id: 10, username: "alice", fullName: "Alice Smith" },
};

describe("CommentCard", () => {
  describe("in full mode (default)", () => {
    beforeEach(() => {
      render(<CommentCard comment={mockComment} />);
    });

    it("renders the user's full name", () => {
      expect(screen.queryByText("Alice Smith")).not.toBeNull();
    });

    it("renders the comment body", () => {
      expect(screen.queryByText("This is a great post!")).not.toBeNull();
    });

    it("renders the like count", () => {
      expect(screen.queryByText("7")).not.toBeNull();
    });

    it("renders the user's initials in the avatar", () => {
      expect(screen.queryByText("AS")).not.toBeNull();
    });
  });

  describe("in compact mode", () => {
    beforeEach(() => {
      render(<CommentCard comment={mockComment} compact />);
    });

    it("renders the user's full name", () => {
      expect(screen.queryByText("Alice Smith")).not.toBeNull();
    });

    it("renders the comment body", () => {
      expect(screen.queryByText("This is a great post!")).not.toBeNull();
    });

    it("renders the like count", () => {
      expect(screen.queryByText("7")).not.toBeNull();
    });
  });
});

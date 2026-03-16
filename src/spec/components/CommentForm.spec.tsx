import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import CommentForm from "../../modules/posts/components/CommentForm/CommentForm";

const mockMutate = vi.fn();

vi.mock("../../modules/posts/hooks/useCreateComment", () => ({
  useCreateComment: () => ({
    mutate: mockMutate,
    isPending: false,
    isSuccess: false,
    isError: false,
    reset: vi.fn(),
  }),
}));

describe("CommentForm", () => {
  beforeEach(() => {
    mockMutate.mockClear();
    render(<CommentForm postId={1} />);
  });

  describe("initial state", () => {
    it("renders the label", () => {
      expect(screen.queryByText("Leave a comment")).not.toBeNull();
    });

    it("renders the textarea", () => {
      expect(screen.queryByPlaceholderText("Write something…")).not.toBeNull();
    });

    it("renders the char counter at 0", () => {
      expect(screen.queryByText("0 / 500")).not.toBeNull();
    });

    it("renders the submit button", () => {
      expect(screen.queryByRole("button", { name: /submit/i })).not.toBeNull();
    });
  });

  describe("when typing in the textarea", () => {
    beforeEach(async () => {
      await userEvent.type(screen.getByPlaceholderText("Write something…"), "Hello");
    });

    it("updates the char counter", () => {
      expect(screen.queryByText("5 / 500")).not.toBeNull();
    });
  });

  describe("when submitting with valid text", () => {
    beforeEach(async () => {
      await userEvent.type(screen.getByPlaceholderText("Write something…"), "Great post!");
      await userEvent.click(screen.getByRole("button", { name: /submit/i }));
    });

    it("calls mutate with the correct postId", () => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({ body: "Great post!", postId: 1 }),
        expect.any(Object)
      );
    });

    it("calls mutate exactly once", () => {
      expect(mockMutate).toHaveBeenCalledOnce();
    });
  });

  describe("when the textarea is empty", () => {
    it("the submit button is disabled", () => {
      expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
    });
  });

  describe("when the textarea contains only whitespace", () => {
    beforeEach(async () => {
      await userEvent.type(screen.getByPlaceholderText("Write something…"), "   ");
    });

    it("the submit button remains disabled", () => {
      expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
    });
  });
});

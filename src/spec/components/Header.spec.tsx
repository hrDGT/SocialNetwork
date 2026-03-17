import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { authStore } from "../../modules/auth";
import { Header } from "../../components";
import type { AuthUser } from "../../modules/auth";
import type { LinkProps } from "../types";

const mockNavigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, className, params }: LinkProps) => {
    const href = params?.userId ? `/users/${params.userId}` : to;
    return <a href={href} className={className}>{children}</a>;
  },
  useNavigate: () => mockNavigate,
}));

const mockUser: AuthUser = {
  id: 7, username: "johnd", firstName: "John", lastName: "Doe",
  email: "john@example.com", image: "", token: "tok",
};

describe("Header", () => {
  beforeEach(() => {
    authStore.logout();
    mockNavigate.mockClear();
  });

  describe("when the user is not authenticated", () => {
    beforeEach(() => {
      render(<Header />);
    });

    it("renders the SN logo", () => {
      expect(screen.queryByText("SN")).not.toBeNull();
    });

    it("renders the Sign in button", () => {
      expect(screen.queryByRole("button", { name: /sign in/i })).not.toBeNull();
    });

    it("does not render the Profile link", () => {
      expect(screen.queryByText("Profile")).toBeNull();
    });

    it("does not render the Exit button", () => {
      expect(screen.queryByRole("button", { name: /exit/i })).toBeNull();
    });

    it("navigates to /login when Sign in is clicked", async () => {
      await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/login" });
    });
  });

  describe("when the user is authenticated", () => {
    beforeEach(() => {
      authStore.setUser(mockUser);
      render(<Header />);
    });

    it("renders the Profile link", () => {
      expect(screen.queryByText("Profile")).not.toBeNull();
    });

    it("renders the Exit button", () => {
      expect(screen.queryByRole("button", { name: /exit/i })).not.toBeNull();
    });

    it("does not render the Sign in button", () => {
      expect(screen.queryByRole("button", { name: /sign in/i })).toBeNull();
    });

    it("Profile link points to the user's profile page", () => {
      expect(screen.getByText("Profile").closest("a")).toHaveAttribute("href", `/users/${mockUser.id}`);
    });

    it("logs out and navigates to / when Exit is clicked", async () => {
      await userEvent.click(screen.getByRole("button", { name: /exit/i }));

      expect(authStore.isAuthenticated).toBe(false);
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
    });
  });
});

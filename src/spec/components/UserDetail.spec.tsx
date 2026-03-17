import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UseQueryResult } from "@tanstack/react-query";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { authStore } from "../../modules/auth/store/AuthStore";
import { LikesStore } from "../../modules/likes/store/LikesStore";
import * as likesModule from "../../modules/likes/store/LikesStore";
import { useUserDetail } from "../../modules/users/hooks/useUserDetail";
import UserDetail from "../../modules/users/components/UserDetail/UserDetail";
import type { User } from "../../modules/users/types";
import type { AuthUser } from "../../modules/auth/types";
import type { Post } from "../../modules/posts/types";

const mockNavigate = vi.fn();

type LinkProps = {
  to: string;
  children: React.ReactNode;
  className?: string;
  params?: Record<string, string | number>;
};

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, className, params }: LinkProps) => {
    const href = params?.["postId"] ? `/posts/${params["postId"]}` : to;
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  },
  useNavigate: () => mockNavigate,
}));

vi.mock("../../modules/users/hooks/useUserDetail", () => ({
  useUserDetail: vi.fn(),
}));

const mockUser: User = {
  id: 2,
  firstName: "Jane",
  lastName: "Doe",
  maidenName: "",
  age: 28,
  gender: "female",
  email: "jane@example.com",
  phone: "+1 555-0100",
  username: "janed",
  birthDate: "1996-01-01",
  image: "",
  address: {
    address: "1 Main St",
    city: "Springfield",
    state: "IL",
    stateCode: "IL",
    postalCode: "62701",
    coordinates: { lat: 0, lng: 0 },
    country: "US",
  },
  university: "State University",
  company: {
    department: "Engineering",
    name: "Acme Corp",
    title: "Developer",
    address: {
      address: "2 Corp Ave",
      city: "Chicago",
      state: "IL",
      stateCode: "IL",
      postalCode: "60601",
      coordinates: { lat: 0, lng: 0 },
      country: "US",
    },
  },
  role: "user",
};

const authUser: AuthUser = {
  id: 99,
  username: "me",
  firstName: "Me",
  lastName: "User",
  email: "me@example.com",
  image: "",
  token: "t",
};

const likedPost: Post = {
  id: 10,
  title: "Liked post title",
  body: "body",
  userId: 1,
  tags: ["tag1"],
  reactions: { likes: 5, dislikes: 0 },
  views: 100,
};

describe("UserDetail", () => {
  let localLikesStore: LikesStore;

  beforeEach(() => {
    localStorage.clear();
    localLikesStore = new LikesStore();
    vi.spyOn(likesModule, "likesStore", "get").mockReturnValue(localLikesStore);
    authStore.logout();
    mockNavigate.mockClear();
  });

  describe("while loading", () => {
    beforeEach(() => {
      vi.mocked(useUserDetail).mockReturnValue({
        isLoading: true,
        isError: false,
        data: undefined,
      } as unknown as UseQueryResult<User>);
      render(<UserDetail userId={2} />);
    });

    it("renders the loading spinner", () => {
      expect(screen.queryByText("Loading profile…")).not.toBeNull();
    });
  });

  describe("when loading fails", () => {
    beforeEach(() => {
      vi.mocked(useUserDetail).mockReturnValue({
        isLoading: false,
        isError: true,
        error: { message: "User not found" },
        refetch: vi.fn(),
        data: undefined,
      } as unknown as UseQueryResult<User>);
      render(<UserDetail userId={2} />);
    });

    it("renders the error message", () => {
      expect(screen.queryByText("User not found")).not.toBeNull();
    });
  });

  describe("when user loads successfully", () => {
    beforeEach(() => {
      vi.mocked(useUserDetail).mockReturnValue({
        isLoading: false,
        isError: false,
        data: mockUser,
        refetch: vi.fn(),
      } as unknown as UseQueryResult<User>);
      render(<UserDetail userId={2} />);
    });

    it("renders the user's full name", () => {
      expect(screen.queryByText("Jane Doe")).not.toBeNull();
    });

    it("renders the username", () => {
      expect(screen.queryByText("@janed")).not.toBeNull();
    });

    it("renders age", () => {
      expect(screen.queryByText("28 y.o.")).not.toBeNull();
    });

    it("renders the role badge", () => {
      expect(screen.queryByText("user")).not.toBeNull();
    });

    it("renders the email", () => {
      expect(screen.queryByText("jane@example.com")).not.toBeNull();
    });

    it("renders the university", () => {
      expect(screen.queryByText("State University")).not.toBeNull();
    });

    it("renders the empty liked posts message", () => {
      expect(screen.queryByText(/no liked posts yet/i)).not.toBeNull();
    });
  });

  describe("liked posts section", () => {
    beforeEach(() => {
      vi.mocked(useUserDetail).mockReturnValue({
        isLoading: false,
        isError: false,
        data: mockUser,
        refetch: vi.fn(),
      } as unknown as UseQueryResult<User>);
      localLikesStore.toggle(likedPost);
      render(<UserDetail userId={2} />);
    });

    it("renders the liked post title", () => {
      expect(screen.queryByText("Liked post title")).not.toBeNull();
    });

    it("renders a link to the liked post", () => {
      expect(
        screen.queryByText("Liked post title")?.closest("a"),
      ).toHaveAttribute("href", "/posts/10");
    });

    it("shows the liked post count in the section heading", () => {
      expect(screen.queryByText("Liked posts (1)")).not.toBeNull();
    });
  });

  describe("Message button — viewing another user's profile while authenticated", () => {
    beforeEach(() => {
      authStore.setUser(authUser);
      vi.mocked(useUserDetail).mockReturnValue({
        isLoading: false,
        isError: false,
        data: mockUser,
        refetch: vi.fn(),
      } as unknown as UseQueryResult<User>);
      render(<UserDetail userId={2} />);
    });

    it("renders the Message button", () => {
      expect(screen.queryByRole("button", { name: /message/i })).not.toBeNull();
    });

    it("navigates to the chat when Message is clicked", async () => {
      await userEvent.click(screen.getByRole("button", { name: /message/i }));

      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/chat/$chatId",
        params: { chatId: "2" },
      });
    });
  });

  describe("Message button — viewing own profile", () => {
    beforeEach(() => {
      authStore.setUser({ ...authUser, id: 2 });
      vi.mocked(useUserDetail).mockReturnValue({
        isLoading: false,
        isError: false,
        data: mockUser,
        refetch: vi.fn(),
      } as unknown as UseQueryResult<User>);
      render(<UserDetail userId={2} />);
    });

    it("does not render the Message button", () => {
      expect(screen.queryByRole("button", { name: /message/i })).toBeNull();
    });
  });

  describe("Message button — unauthenticated user", () => {
    beforeEach(() => {
      vi.mocked(useUserDetail).mockReturnValue({
        isLoading: false,
        isError: false,
        data: mockUser,
        refetch: vi.fn(),
      } as unknown as UseQueryResult<User>);
      render(<UserDetail userId={2} />);
    });

    it("does not render the Message button", () => {
      expect(screen.queryByRole("button", { name: /message/i })).toBeNull();
    });
  });
});

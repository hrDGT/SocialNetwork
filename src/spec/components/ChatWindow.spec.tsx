import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UseQueryResult } from "@tanstack/react-query";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { authStore } from "../../modules/auth";
import { useUserDetail } from "../../modules/users";
import { ChatWindow } from "../../modules/chat";
import type { User } from "../../modules/users";
import type { AuthUser } from "../../modules/auth";
import type { ChatMessage, ConnectionStatus } from "../../modules/chat";
import type { LinkProps } from "../types";

const { mockStore } = vi.hoisted(() => {
  const mockStore = {
    status: "idle" as ConnectionStatus,
    activeUserId: null as number | null,
    messages: {} as Record<number, ChatMessage[]>,
    get currentMessages(): ChatMessage[] {
      return this.activeUserId !== null
        ? (this.messages[this.activeUserId] ?? [])
        : [];
    },
    get isConnected(): boolean {
      return this.status === "connected";
    },
    connect: vi.fn(),
    disconnect: vi.fn(),
    send: vi.fn(),
  };
  return { mockStore };
});

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, className, params }: LinkProps) => {
    const href = params?.userId ? `/users/${params.userId}` : to;
    return <a href={href} className={className}>{children}</a>;
  },
}));

vi.mock("../../modules/users/hooks/useUserDetail", () => ({
  useUserDetail: vi.fn(),
}));

vi.mock("../../modules/chat/store/ChatStore", () => ({
  chatStore: mockStore,
  ChatStore: class {},
}));

const authUser: AuthUser = {
  id: 1, username: "me", firstName: "Alice", lastName: "Brown",
  email: "alice@example.com", image: "", token: "t",
};

describe("ChatWindow", () => {
  beforeEach(() => {
    authStore.setUser(authUser);
    mockStore.status = "idle";
    mockStore.activeUserId = null;
    mockStore.messages = {};
    mockStore.connect.mockClear();
    mockStore.disconnect.mockClear();
    mockStore.send.mockClear();

    vi.mocked(useUserDetail).mockReturnValue({
      data: { firstName: "Bob", lastName: "Smith", image: "" },
    } as never as UseQueryResult<User>);
  });

  describe("top bar", () => {
    beforeEach(() => {
      render(<ChatWindow chatId={3} />);
    });

    it("renders the interlocutor name", () => {
      expect(screen.queryByText("Bob Smith")).not.toBeNull();
    });

    it("renders a back link to the user's profile", () => {
      expect(screen.queryByRole("link")?.getAttribute("href")).toBe("/users/3");
    });
  });

  describe("connection status", () => {
    describe("when connecting", () => {
      beforeEach(() => {
        mockStore.status = "connecting";
        render(<ChatWindow chatId={3} />);
      });

      it("shows connecting status label", () => {
        expect(screen.queryByText("connecting…")).not.toBeNull();
      });

      it("input placeholder indicates connecting", () => {
        expect(screen.queryByPlaceholderText("Connecting…")).not.toBeNull();
      });
    });

    describe("when connected", () => {
      beforeEach(() => {
        mockStore.status = "connected";
        render(<ChatWindow chatId={3} />);
      });

      it("shows online status label", () => {
        expect(screen.queryByText("online")).not.toBeNull();
      });

      it("shows the empty hint", () => {
        expect(screen.queryByText("Send a message to start the conversation")).not.toBeNull();
      });

      it("input placeholder shows message prompt", () => {
        expect(screen.queryByPlaceholderText("Message… (Enter to send)")).not.toBeNull();
      });
    });

    describe("when disconnected", () => {
      beforeEach(() => {
        mockStore.status = "disconnected";
        render(<ChatWindow chatId={3} />);
      });

      it("shows offline status label", () => {
        expect(screen.queryByText("offline")).not.toBeNull();
      });
    });

    describe("when connection errored", () => {
      beforeEach(() => {
        mockStore.status = "error";
        render(<ChatWindow chatId={3} />);
      });

      it("shows error status label", () => {
        expect(screen.queryByText("error")).not.toBeNull();
      });
    });
  });

  describe("messages", () => {
    beforeEach(() => {
      mockStore.status = "connected";
      mockStore.activeUserId = 3;
      mockStore.messages = {
        3: [
          { id: "1", body: "Hello there!", direction: "outgoing", timestamp: Date.now() },
          { id: "2", body: "Hey, how are you?", direction: "incoming", timestamp: Date.now() },
        ],
      };
      render(<ChatWindow chatId={3} />);
    });

    it("renders the outgoing message", () => {
      expect(screen.queryByText("Hello there!")).not.toBeNull();
    });

    it("renders the incoming message", () => {
      expect(screen.queryByText("Hey, how are you?")).not.toBeNull();
    });
  });

  describe("send button", () => {
    beforeEach(() => {
      mockStore.status = "connected";
      mockStore.activeUserId = 3;
      render(<ChatWindow chatId={3} />);
    });

    it("is disabled when input is empty", () => {
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("becomes enabled when text is typed", async () => {
      await userEvent.type(
        screen.getByPlaceholderText("Message… (Enter to send)"),
        "Hi!"
      );

      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    it("sends the message and clears the input when clicked", async () => {
      const input = screen.getByPlaceholderText("Message… (Enter to send)");
      await userEvent.type(input, "Test message");
      await userEvent.click(screen.getByRole("button"));

      expect(mockStore.send).toHaveBeenCalledWith("Test message");
      expect((input as HTMLInputElement).value).toBe("");
    });

    it("sends the message on Enter key", async () => {
      const input = screen.getByPlaceholderText("Message… (Enter to send)");
      await userEvent.type(input, "Enter message{Enter}");

      expect(mockStore.send).toHaveBeenCalledWith("Enter message");
    });
  });
});

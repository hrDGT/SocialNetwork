import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import Spinner from "../../ui/Spinner/Spinner";

describe("Spinner", () => {
  describe("with default label", () => {
    beforeEach(() => {
      render(<Spinner />);
    });

    it("renders the default loading text", () => {
      expect(screen.queryByText("Loading…")).not.toBeNull();
    });
  });

  describe("with a custom label", () => {
    beforeEach(() => {
      render(<Spinner label="Fetching posts…" />);
    });

    it("renders the custom label", () => {
      expect(screen.queryByText("Fetching posts…")).not.toBeNull();
    });

    it("does not render the default label", () => {
      expect(screen.queryByText("Loading…")).toBeNull();
    });
  });
});

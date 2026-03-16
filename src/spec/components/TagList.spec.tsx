import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import TagList from "../../ui/TagList/TagList";

describe("TagList", () => {
  describe("when given a list of tags", () => {
    let container: HTMLElement;

    beforeEach(() => {
      ({ container } = render(<TagList tags={["tag1", "tag2", "tag3"]} />));
    });

    it("renders every tag", () => {
      expect(screen.queryByText("tag1")).not.toBeNull();
      expect(screen.queryByText("tag2")).not.toBeNull();
      expect(screen.queryByText("tag3")).not.toBeNull();
    });

    it("renders the correct number of items", () => {
      expect(container.querySelectorAll("li").length).toBe(3);
    });
  });

  describe("when given an empty list", () => {
    let container: HTMLElement;

    beforeEach(() => {
      ({ container } = render(<TagList tags={[]} />));
    });

    it("renders no items", () => {
      expect(container.querySelectorAll("li").length).toBe(0);
    });
  });
});

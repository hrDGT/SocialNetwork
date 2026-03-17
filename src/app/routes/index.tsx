import { createFileRoute } from "@tanstack/react-router";
import { default as FeedPage } from "../../pages/FeedPage/FeedPage";
 
export const Route = createFileRoute("/")({
  component: FeedPage,
});

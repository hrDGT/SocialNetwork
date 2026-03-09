import { makeAutoObservable, runInAction } from "mobx";
import { postsApi } from "../api/postsApi";
import type { Post } from "../types";

const PAGE_SIZE = 12;

type Status = "idle" | "loading" | "loadingMore" | "success" | "error";

class PostsStore {
  posts: Post[] = [];
  status: Status = "idle";
  error: string | null = null;
  skip = 0;
  total = 0;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoading() {
    return this.status === "loading";
  }

  get isLoadingMore() {
    return this.status === "loadingMore";
  }

  get hasError() {
    return this.status === "error";
  }

  get hasMore() {
    return this.posts.length < this.total;
  }

  async loadInitial() {
    if (this.status === "loading") return;

    this.status = "loading";
    this.error = null;
    this.skip = 0;
    this.posts = [];

    try {
      const data = await postsApi.fetchPage({ limit: PAGE_SIZE, skip: 0 });
      runInAction(() => {
        this.posts = data.posts;
        this.total = data.total;
        this.skip = data.posts.length;
        this.status = "success";
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : "Unknown error";
        this.status = "error";
      });
    }
  }

  async loadMore() {
    if (this.status === "loading" || this.status === "loadingMore") return;
    if (!this.hasMore) return;

    this.status = "loadingMore";

    try {
      const data = await postsApi.fetchPage({ limit: PAGE_SIZE, skip: this.skip });
      runInAction(() => {
        this.posts.push(...data.posts);
        this.skip += data.posts.length;
        this.status = "success";
      });
    } catch (err) {
      runInAction(() => {
        this.error = err instanceof Error ? err.message : "Unknown error";
        this.status = "error";
      });
    }
  }
}

export const postsStore = new PostsStore();

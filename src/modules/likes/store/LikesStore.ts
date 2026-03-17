import { makeAutoObservable } from "mobx";
import type { Post } from "../../posts/types";

const STORAGE_KEY = "sn_liked_posts";

class LikesStore {
  likedPosts: Map<number, Post> = new Map();

  constructor() {
    makeAutoObservable(this);
    this.restore();
  }

  isLiked(postId: number): boolean {
    return this.likedPosts.has(postId);
  }

  toggle(post: Post) {
    if (this.likedPosts.has(post.id)) {
      this.likedPosts.delete(post.id);
    } else {
      this.likedPosts.set(post.id, post);
    }
    this.persist();
  }

  getLikedCount(postId: number): number {
    const post = this.likedPosts.get(postId);
    return post ? post.reactions.likes + 1 : 0;
  }

  get likedPostsList(): Post[] {
    return Array.from(this.likedPosts.values());
  }

  private persist() {
    const data = Array.from(this.likedPosts.entries());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  private restore() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const entries: [number, Post][] = JSON.parse(raw);
      this.likedPosts = new Map(entries);
    }
  }
}

export const likesStore = new LikesStore();
export { LikesStore };

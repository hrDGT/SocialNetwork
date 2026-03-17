import { makeAutoObservable } from "mobx";
import type { AuthUser } from "../types";

const STORAGE_KEY = "sn_auth_user";

class AuthStore {
  user: AuthUser | null = null;

  constructor() {
    makeAutoObservable(this);
    this.restore();
  }

  get isAuthenticated() {
    return this.user !== null;
  }

  get displayName() {
    if (!this.user) return null;
    return `${this.user.firstName} ${this.user.lastName}`;
  }

  setUser(user: AuthUser) {
    this.user = user;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  logout() {
    this.user = null;
    sessionStorage.removeItem(STORAGE_KEY);
  }

  private restore() {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) this.user = JSON.parse(raw) as AuthUser;
  }
}

export const authStore = new AuthStore();

import { defineStore } from "pinia";
import { authService } from "@/services/authService";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "@/types/JwtPayload";
import type { Customer } from "@/types/Customer";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => state.token !== "",
  },

  actions: {
    async login(email: string, password: string) {
      try {
        const token = await authService.login(email, password);
        this.token = token;
        localStorage.setItem("token", token);
      } catch (error) {
        throw error instanceof Error ? error : new Error("Login failed.");
      }
    },

    async register(fields: Customer) {
      return await authService.register(fields);
    },

    async isTokenValid(token: string) {
      await authService.validateToken(token);
    },

    async logout() {
      this.token = "";
      this.initialized = false;
      localStorage.clear();
    },

    async initialize() {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        this.token = savedToken;

        try {
          await this.isTokenValid(savedToken);
        } catch {
          this.logout();
        }
      }

      this.initialized = true;
    },

    getPayload() {
      const token = localStorage.getItem("token");
      return token ? jwtDecode<JwtPayload>(token) : null;
    },
  },
});

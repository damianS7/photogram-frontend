import { defineStore } from "pinia";
import { authService } from "@/services/authService";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "@/types/JwtPayload";
import type { CustomerRegistration } from "@/types/CustomerRegistration";

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
        throw error;
      }
    },

    async register(fields: CustomerRegistration) {
      return await authService.register(fields);
    },

    async isTokenValid(token: string): Promise<boolean> {
      return await authService.validateToken(token);
    },

    async logout() {
      this.token = "";
      this.initialized = false;
      localStorage.clear();
    },

    async initialize() {
      const savedToken = localStorage.getItem("token") || "";

      try {
        await this.isTokenValid(savedToken);
        this.token = savedToken;
        this.initialized = true;
      } catch {
        this.logout();
      }
    },

    getPayload() {
      const token = localStorage.getItem("token");
      return token ? jwtDecode<JwtPayload>(token) : null;
    },
  },
});

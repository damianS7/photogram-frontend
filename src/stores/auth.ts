import { defineStore } from "pinia";
import { authService } from "@/services/authService";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "@/types/JwtPayload";
import type { CustomerRegistration } from "@/types/CustomerRegistration";
import { computed, ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref("");
  const initialized = ref(false);

  const isAuthenticated = computed(() => token.value !== "");

  async function initialize() {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      return;
    }

    if (!authService.validateToken(storedToken)) {
      logout();
      return;
    }

    token.value = storedToken;
    initialized.value = true;
  }

  async function login(email: string, password: string) {
    try {
      const jwtToken = await authService.login(email, password);
      token.value = jwtToken;
      localStorage.setItem("token", jwtToken);
    } catch (error) {
      throw error;
    }
  }

  async function register(fields: CustomerRegistration) {
    return await authService.register(fields);
  }

  async function isTokenValid(token: string): Promise<boolean> {
    return await authService.validateToken(token);
  }

  async function logout() {
    token.value = "";
    initialized.value = false;
    localStorage.clear();
  }

  function getPayload() {
    const token = localStorage.getItem("token");
    return token ? jwtDecode<JwtPayload>(token) : null;
  }

  return {
    token,
    initialized,
    isAuthenticated,
    login,
    register,
    logout,
    initialize,
    getPayload,
    isTokenValid,
  };
});

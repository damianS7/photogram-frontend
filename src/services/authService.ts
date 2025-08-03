import type { Customer } from "@/types/Customer";

const API = import.meta.env.VITE_APP_API_URL;

export const authService = {
  async login(email: string, password: string) {
    const response = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Invalid credentials.");
    }

    const data = await response.json();
    return data.token;
  },

  async register(fields: Customer) {
    const response = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });

    if (response.status !== 201) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed.");
    }

    return await response.json();
  },

  async validateToken(token: string) {
    const response = await fetch(`${API}/auth/token/validate`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Token invalid.");
    }
  },
};

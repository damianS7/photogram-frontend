import type { CustomerRegistration } from "@/types/CustomerRegistration";
import type { JsonResponse } from "@/types/JsonResponse";
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
      throw new Error(error.message || "Login failed.");
    }

    const data = await response.json();
    return data.token;
  },

  async register(fields: CustomerRegistration) {
    const response = await fetch(`${API}/accounts/register`, {
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

  async validateToken(token: string): Promise<boolean> {
    const response = await fetch(`${API}/auth/token/validate`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Token validation failed.");
    }
    return true;
  },
  async activateAccount(token: string): Promise<JsonResponse> {
    const response = await fetch(`${API}/accounts/activate/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Token validation failed.");
    }
    return (await response.json()) as JsonResponse;
  },
  async resendAccountActivation(email: string): Promise<JsonResponse> {
    const response = await fetch(`${API}/accounts/resend-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send activation email.");
    }

    return (await response.json()) as JsonResponse;
  },

  async resetPasswordRequest(email: string): Promise<JsonResponse> {
    const response = await fetch(`${API}/accounts/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send reset password email.");
    }

    return (await response.json()) as JsonResponse;
  },
  async resetPasswordSet(password: string, token: string): Promise<JsonResponse> {
    const response = await fetch(`${API}/accounts/reset-password/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to reset password.");
    }
    return (await response.json()) as JsonResponse;
  },
};

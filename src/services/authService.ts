import { ApiError } from "@/types/ApiError";
import type { ApiResponse } from "@/types/ApiResponse";
import type { CustomerRegistration } from "@/types/CustomerRegistration";
const API = import.meta.env.VITE_APP_API_URL;

export const authService = {
  async login(email: string, password: string) {
    const response = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiError(json.message || "Failed to login.", response.status, json.errors);
    }

    return json.token;
  },

  async register(fields: CustomerRegistration) {
    const response = await fetch(`${API}/accounts/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });

    const json = await response.json();

    if (response.status !== 201) {
      throw new ApiError(json.message || "Registration failed.", response.status, json.errors);
    }

    return json;
  },

  async validateToken(token: string): Promise<boolean> {
    const response = await fetch(`${API}/auth/token/validate`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      const json = await response.json();
      throw new ApiError(json.message || "Token validation failed.", response.status, json.errors);
    }

    return true;
  },
  async activateAccount(token: string): Promise<ApiResponse> {
    const response = await fetch(`${API}/accounts/verification/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiError(json.message || "Cannot activate account.", response.status, json.errors);
    }

    return json;
    // return (await response.json()) as ApiResponse;
  },
  async resendAccountActivation(email: string): Promise<ApiResponse> {
    const response = await fetch(`${API}/accounts/resend-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiError(
        json.message || "Failed to send activation email.",
        response.status,
        json.errors
      );
    }

    return json;
    // return (await response.json()) as ApiResponse;
  },

  async resetPasswordRequest(email: string): Promise<ApiResponse> {
    const response = await fetch(`${API}/accounts/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiError(
        json.message || "Failed to send reset password email.",
        response.status,
        json.errors
      );
    }

    return json;

    // return (await response.json()) as ApiResponse;
  },
  async resetPasswordSet(password: string, token: string): Promise<ApiResponse> {
    const response = await fetch(`${API}/accounts/reset-password/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiError(json.message || "Failed reset password.", response.status, json.errors);
    }

    return json;

    // return (await response.json()) as ApiResponse;
  },
};

// services/customerService.ts
import { ApiError } from "@/types/ApiError";
import type { Customer } from "@/types/Customer";
import type { Profile } from "@/types/Profile";

const API = import.meta.env.VITE_APP_API_URL;
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const customerService = {
  async getCustomer(): Promise<Customer> {
    const response = await fetch(`${API}/customers`, {
      method: "GET",
      headers: authHeader(),
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiError(json.message || "Failed to fetch customer.", response.status, json.errors);
    }

    return json;
  },

  async patchProfile(
    currentPassword: string,
    fieldsToUpdate: Record<string, any>
  ): Promise<Profile> {
    const response = await fetch(`${API}/customers/profile`, {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ currentPassword, fieldsToUpdate }),
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiError(json.message || "Failed to update profile.", response.status, json.errors);
    }

    return json;
  },

  async patchEmail(currentPassword: string, newEmail: string): Promise<Customer> {
    const response = await fetch(`${API}/customers/email`, {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ currentPassword, newEmail }),
    });

    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiError(json.message || "Failed to update email.", response.status, json.errors);
    }

    return json;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await fetch(`${API}/accounts/customers/password`, {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (response.status !== 200) {
      const json = await response.json();
      throw new ApiError(
        json.message || "Failed to update password.",
        response.status,
        json.errors
      );
    }
  },

  async getProfileImage(customerId: number): Promise<Blob> {
    const response = await fetch(`${API}/customers/${customerId}/profile/image`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.status !== 200) {
      const json = await response.json();
      throw new ApiError(
        json.message || "Failed to fetch profile image.",
        response.status,
        json.errors
      );
    }

    return await response.blob();
  },

  async uploadProfileImage(currentPassword: string, file: File): Promise<Blob> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("currentPassword", currentPassword);

    const response = await fetch(`${API}/customers/profile/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (response.status !== 201) {
      const json = await response.json();
      throw new ApiError(json.message || "Failed to upload image.", response.status, json.errors);
    }

    return await response.blob();
  },

  async usernameExists(username: string): Promise<boolean> {
    const response = await fetch(`${API}/customers/profile/username/${username}/exists`, {
      method: "GET",
      headers: authHeader(),
    });

    if (response.status === 200) {
      return true;
    }

    return false;
  },
};

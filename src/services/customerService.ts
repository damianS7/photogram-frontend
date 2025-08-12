// services/customerService.ts
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
    const response = await fetch(`${API}/customers/me`, {
      method: "GET",
      headers: authHeader(),
    });

    if (response.status !== 200) {
      const json = await response.json();
      throw new Error(json.message || "Failed to fetch customer.");
    }

    return await response.json();
  },

  async patchProfile(
    currentPassword: string,
    fieldsToUpdate: Record<string, any>
  ): Promise<Profile> {
    const response = await fetch(`${API}/customers/me/profile`, {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ currentPassword, fieldsToUpdate }),
    });

    if (response.status !== 200) {
      throw new Error("Failed to update profile.");
    }

    return await response.json();
  },

  async patchEmail(currentPassword: string, newEmail: string): Promise<Customer> {
    const response = await fetch(`${API}/customers/me/email`, {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ currentPassword, newEmail }),
    });

    if (response.status !== 200) {
      throw new Error("Failed to update email.");
    }

    return await response.json();
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await fetch(`${API}/auth/customers/password`, {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (response.status !== 200) {
      throw new Error("Failed to change password.");
    }
  },

  async getPhoto(filename: string): Promise<Blob> {
    const response = await fetch(`${API}/customers/profile/photo/${filename}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to get photo.");
    }

    return await response.blob();
  },

  async uploadPhoto(currentPassword: string, file: File): Promise<Blob> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("currentPassword", currentPassword);

    const response = await fetch(`${API}/customers/me/profile/photo`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (response.status !== 201) {
      throw new Error("Failed to upload photo.");
    }

    return await response.blob();
  },

  async usernameExists(username: string): Promise<boolean> {
    const response = await fetch(`${API}/customers/profile/check-username/${username}`, {
      method: "GET",
      headers: authHeader(),
    });

    if (response.status === 200) {
      return true;
    }

    return false;
  },
};

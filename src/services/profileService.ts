// services/customerService.ts
import { ApiError } from "@/types/ApiError";
import type { Profile } from "@/types/Profile";

const API = import.meta.env.VITE_APP_API_URL;
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const profileService = {
  async getProfileImage(customerId: number): Promise<Blob> {
    const response = await fetch(`${API}/customers/${customerId}/profile/image`, {
      method: "GET",
      headers: authHeader(),
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
      headers: authHeader(),
      body: formData,
    });

    if (response.status !== 201) {
      const json = await response.json();
      throw new ApiError(json.message || "Failed to upload image.", response.status, json.errors);
    }

    return await response.blob();
  },

  async updateProfile(
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
};

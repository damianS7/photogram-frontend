import { ApiError } from "@/types/ApiError";
import type { Setting } from "@/types/Setting";

const API = import.meta.env.VITE_APP_API_URL;

export const settingService = {
  async fetchSettings(token: string): Promise<Setting[]> {
    const response = await fetch(`${API}/settings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // json response
    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiError(json.message || "Failed to fetch settings.", response.status, json.errors);
    }

    return json;
  },

  async updateSetting(id: number, setting: Setting, token: string): Promise<Setting> {
    const response = await fetch(`${API}/settings/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(setting),
    });

    // json response
    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiError(json.message || "Failed to update setting.", response.status, json.errors);
    }

    return json;
  },

  async updateSettings(settings: Record<number, string>, token: string): Promise<Setting[]> {
    const response = await fetch(`${API}/settings`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ settings }),
    });

    // json response
    const json = await response.json();

    if (response.status !== 200) {
      throw new ApiError(
        json.message || "Failed to update settings.",
        response.status,
        json.errors
      );
    }

    return json;
  },
};

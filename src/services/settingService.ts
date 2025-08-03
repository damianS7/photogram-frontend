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

    if (!response.ok) {
      const error = await response.json();
      throw new Error("Failed to fetch settings. " + error.message);
    }

    return await response.json();
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

    if (!response.ok) {
      throw new Error("Failed to update setting.");
    }

    return await response.json();
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

    if (!response.ok) {
      throw new Error("Failed to update settings.");
    }

    return await response.json();
  },
};

import { defineStore } from "pinia";
import type { Setting } from "@/types/Setting";
import { settingService } from "@/services/settingService";

export const useSettingStore = defineStore("setting", {
  state: () => ({
    settings: {} as Record<string, Setting>,
    initialized: false,
  }),

  getters: {
    getSettings: (state) => state.settings,
  },

  actions: {
    async fetchSettings(): Promise<void> {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const fetchedSettings = await settingService.fetchSettings(token);
        fetchedSettings.forEach((setting: Setting) => {
          this.settings[setting.key] = setting;
        });
      } catch (error: unknown) {
        if (error instanceof Error) throw error;
        throw new Error("Failed to fetch settings.");
      }
    },

    async updateSetting(id: number, setting: Setting): Promise<Setting> {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const updatedSetting = await settingService.updateSetting(id, setting, token);
        this.settings[updatedSetting.key] = updatedSetting;
        return updatedSetting;
      } catch (error: unknown) {
        if (error instanceof Error) throw error;
        throw new Error("Failed to update setting.");
      }
    },

    async updateSettings(settings: Record<number, string>): Promise<void> {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const updatedSettings = await settingService.updateSettings(settings, token);
        updatedSettings.forEach((setting: Setting) => {
          this.settings[setting.key] = setting;
        });
      } catch (error: unknown) {
        if (error instanceof Error) throw error;
        throw new Error("Failed to update settings.");
      }
    },

    async initialize() {
      const token = localStorage.getItem("token");
      if (!token) return;

      await this.fetchSettings().catch((error) => {
        console.error(error);
      });

      this.initialized = true;
    },
  },
});

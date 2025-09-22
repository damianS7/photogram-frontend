import { defineStore } from "pinia";
import type { Setting } from "@/types/Setting";
import { settingService } from "@/services/settingService";
import { ref } from "vue";

export const useSettingStore = defineStore("setting", () => {
  const initialized = ref(false);
  const settings = ref<Record<string, Setting>>({} as Record<string, Setting>);

  async function fetchSettings(): Promise<void> {
    const fetchedSettings = await settingService.fetchSettings();
    fetchedSettings.forEach((setting: Setting) => {
      settings.value[setting.key] = setting;
    });
  }

  async function updateSetting(id: number, setting: Setting): Promise<Setting> {
    const updatedSetting = await settingService.updateSetting(id, setting);
    settings.value[updatedSetting.key] = updatedSetting;
    return updatedSetting;
  }

  async function updateSettings(settingsRecord: Record<number, string>): Promise<void> {
    const updatedSettings = await settingService.updateSettings(settingsRecord);
    updatedSettings.forEach((setting: Setting) => {
      settings.value[setting.key] = setting;
    });
  }

  async function initialize() {
    await fetchSettings().then(() => {
      initialized.value = true;
    });
  }

  return { initialized, fetchSettings, updateSetting, updateSettings, initialize };
});

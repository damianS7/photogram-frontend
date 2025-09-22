// stores/customerStore.ts
import { defineStore } from "pinia";
import type { Customer } from "@/types/Customer";
import { customerService } from "@/services/customerService";
import { computed, ref } from "vue";
import { profileService } from "@/services/profileService";

export const useCustomerStore = defineStore("customer", () => {
  const customer = ref({} as Customer);
  const initialized = ref(false);

  const getLoggedCustomer = computed(() => customer.value);
  const getFullName = computed(
    () => `${customer.value?.profile?.firstName ?? ""} ${customer.value?.profile?.lastName ?? ""}`
  );

  async function initialize() {
    // Set default avatar if not present
    // if (customer.value.profile.avatarFilename === null) {
    //   localStorage.setItem("profilePhotoURL", "/public/default-avatar.png");
    //   // TODO return?
    // }

    try {
      customer.value = await customerService.fetchCustomer();

      await profileService
        .fetchProfileImage(customer.value.id)
        .then((blob: Blob) => {
          localStorage.setItem("profilePhotoURL", URL.createObjectURL(blob));
        })
        .catch(() => {
          localStorage.setItem("profilePhotoURL", "/public/default-avatar.png");
        });

      initialized.value = true;
    } catch (error) {
      throw new Error("Failed to fetch customer data.");
    }
  }

  async function updateProfile(currentPassword: string, updates: Record<string, any>) {
    const updatedProfile = await profileService.updateProfile(currentPassword, updates);
    customer.value.profile = updatedProfile;
  }

  async function updateEmail(currentPassword: string, newEmail: string) {
    const updatedCustomer = await customerService.updateEmail(currentPassword, newEmail);
    customer.value.email = updatedCustomer.email;
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    await customerService.updatePassword(currentPassword, newPassword);
  }

  async function uploadPhoto(currentPassword: string, file: File) {
    const blob = await profileService.uploadProfileImage(currentPassword, file);
    localStorage.setItem("profilePhotoURL", URL.createObjectURL(blob));
    return blob;
  }

  async function setPhoto(filename: any) {
    customer.value.profile.avatarFilename = filename;
  }

  return {
    customer,
    getFullName,
    getLoggedCustomer,
    initialized,
    initialize,
    updateProfile,
    updateEmail,
    changePassword,
    uploadPhoto,
    setPhoto,
  };
});

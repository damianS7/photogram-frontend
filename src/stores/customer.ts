// stores/customerStore.ts
import { defineStore } from "pinia";
import type { Customer } from "@/types/Customer";
import type { Profile } from "@/types/Profile";
import { customerService } from "@/services/customerService";

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customer: {} as Customer,
    initialized: false,
  }),

  getters: {
    getLoggedCustomer: (state) => state.customer,
    getFullName: (state) =>
      `${state.customer?.profile?.firstName ?? ""} ${state.customer?.profile?.lastName ?? ""}`,
  },

  actions: {
    async initialize() {
      const customer = await customerService.getCustomer();
      this.setCustomer(customer);

      // Set default avatar if not present
      if (customer.profile.avatarFilename === null) {
        localStorage.setItem("profilePhotoURL", "/public/default-avatar.png");
      }

      try {
        const photo = await customerService.getPhoto(customer.id);
        localStorage.setItem("profilePhotoURL", URL.createObjectURL(photo));
      } catch (error) {
        localStorage.setItem("profilePhotoURL", "/public/default-avatar.png");
      }

      this.initialized = true;
    },

    async updateProfile(currentPassword: string, updates: Record<string, any>) {
      const profile = await customerService.patchProfile(currentPassword, updates);
      this.setProfile(profile);
    },

    async updateEmail(currentPassword: string, newEmail: string) {
      const customer = await customerService.patchEmail(currentPassword, newEmail);
      this.setEmail(customer.email);
    },

    async changePassword(currentPassword: string, newPassword: string) {
      await customerService.changePassword(currentPassword, newPassword);
    },

    async uploadPhoto(currentPassword: string, file: File) {
      const blob = await customerService.uploadPhoto(currentPassword, file);
      localStorage.setItem("profilePhotoURL", URL.createObjectURL(blob));
      return blob;
    },

    setCustomer(customer: Customer) {
      this.customer = customer;
    },

    setEmail(email: string) {
      this.customer.email = email;
    },

    setProfile(profile: Profile) {
      this.customer.profile = profile;
    },
    async setPhoto(filename: any) {
      this.customer.profile.avatarFilename = filename;
    },
  },
});

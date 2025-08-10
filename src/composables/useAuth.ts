import { useCustomerStore } from "@/stores/customer";
import type { Customer } from "@/types/Customer";

// src/composables/useAuth.ts
export function useAuth() {
  const isCurrentUserOwner = (customerId: number) => {
    const customer: Customer = useCustomerStore().getLoggedCustomer;
    if (customer.id === customerId) {
      return true;
    }
    return false;
  };

  return {
    isCurrentUserOwner,
  };
}

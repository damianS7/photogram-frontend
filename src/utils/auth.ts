import { useCustomerStore } from "@/stores/customer";
import type { Customer } from "@/types/Customer";

export function authUtils() {
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

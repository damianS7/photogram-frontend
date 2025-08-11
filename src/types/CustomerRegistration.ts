import type { GenderType } from "./Profile";

export interface CustomerRegistration {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthdate: string;
  gender: GenderType;
}

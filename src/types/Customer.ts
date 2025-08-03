import type { Profile } from "./Profile";
export interface Customer {
  id: number;
  email: string;
  password: string;
  profile: Profile;
}

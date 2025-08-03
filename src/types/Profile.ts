export type GenderType = "MALE" | "FEMALE";
export interface Profile {
  id?: number;
  customerId?: number;
  firstName: string;
  lastName: string;
  phone: string;
  birthdate: string;
  gender: GenderType;
  avatarFilename: string;
}

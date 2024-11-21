import type { DBEntity } from "@modules/shared/types";

export interface IUser extends DBEntity {
  email: string;
  password: string;
  name: string;
  role: string;
}
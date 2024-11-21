import { UsersProvider } from '@modules/users/entities/users.entity';
import type { Schema } from "mongoose";

export enum ProvidersEnum {
	USERS = 'USERS',

}

export interface IProvider {
  name: ProvidersEnum;
  schema: Schema;
}

export const Providers: IProvider[] = [UsersProvider];

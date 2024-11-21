import type { IUsers } from "@modules/users/types/users";
import { type IProvider, ProvidersEnum } from "@shared/providers";
import {Types,Schema} from "mongoose"
export class UsersEntity implements IUsers {}
export const UsersSchema = new Schema<UsersEntity>({
_id: Types.ObjectId,
})
export const UsersProvider: IProvider = {
name: ProvidersEnum.USERS,
schema: UsersSchema
}
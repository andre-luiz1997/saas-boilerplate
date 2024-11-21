import type { Types } from "mongoose";

export interface DBEntity {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
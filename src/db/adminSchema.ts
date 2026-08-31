import { Document, Schema, model } from "mongoose";
import type { adminInterFace } from "../lib/type.js";

enum UserRole {
  ADMIN = "admin",
}
const adminSchema = new Schema<adminInterFace>(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    profilePhotoUrl: { type: String, required: true },
    role: {
      type: String,
      default: UserRole.ADMIN,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);
const adminInfo = model<adminInterFace>("adminInfo", adminSchema);
export default adminInfo;

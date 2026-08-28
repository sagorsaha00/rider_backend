import { Schema, model } from "mongoose";
import type { IRider } from "@/lib/type";

// Mongoose Schema
const riderSchema = new Schema<IRider>(
  {
    fullName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    phoneNumber: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    address: {
      street: { type: String },
      city: { type: String },
      postcode: { type: String },
    },
    profilePhotoUrl: { type: String },
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      relationship: { type: String },
    },
    workPreferences: {
      city: { type: String },
      deliveryZone: { type: String },
      preferredSchedule: [{ type: String }],
      vehicleType: {
        type: String,
        enum: ["bicycle", "e-bike", "moped", "motorcycle", "car"],
        required: true,
      },
    },
    documents: {
      identityDocumentUrl: { type: String },
    },
    verificationStatus: {
      type: String,
      default: "pending",
    },
    rejectionReason: { type: String },
  },
  {
    timestamps: true,
  },
);

const RiderInfo = model<IRider>("RiderInfo", riderSchema);

export default RiderInfo;

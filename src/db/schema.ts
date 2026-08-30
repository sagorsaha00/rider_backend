import { Schema, model, Document } from "mongoose";
import type { IRider } from "../lib/type.js";

enum UserRole {
  RIDER = "rider",
  ADMIN = "admin",
}

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
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      postcode: { type: String, required: true, trim: true },
      deliveryZone: { type: String, required: true, trim: true },
    },

    profilePhotoUrl: { type: String, required: true },

    emergencyContact: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      relationship: { type: String, required: true, trim: true },
    },

    workPreferences: {
      city: { type: String, required: true, trim: true },
      preferredSchedule: {
        type: [{ type: String }],
        validate: {
          validator: (v: string[]) => Array.isArray(v) && v.length > 0,
          message: "Select at least 1 preferred day",
        },
      },
      vehicleType: {
        type: String,
        enum: ["bicycle", "scooter", "car", "van"],
        required: true,
      },
    },

    documents: {
      identityDocumentUrl: { type: String, required: true },
      passportNumber: { type: String, required: true, trim: true },
      passportExpiryDate: { type: Date, required: true },
      visaNumber: { type: String, required: true, trim: true },
      residencyType: {
        type: String,
        enum: [
          "citizen",
          "permanent_resident",
          "work_visa",
          "student_visa",
          "other",
        ],
        required: true,
      },
      residencyImageFrontUrl: { type: String, required: true },
      residencyImageBackUrl: { type: String, required: true },
      drivingLicenseUrl: {
        type: String,
        validate: {
          validator: function (this: IRider, v: string | undefined) {
            if (this.workPreferences?.vehicleType === "bicycle") return true;
            return !!v;
          },
          message: "Driving license is required for your selected vehicle type",
        },
      },
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.RIDER,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const RiderInfo = model<IRider>("RiderInfo", riderSchema);

export default RiderInfo;

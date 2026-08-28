import type { Document } from "mongoose";

export type VehicleType = "bicycle" | "e-bike" | "motorcycle" | "car";
export type VerificationStatus =
  | "pending"
  | "action_required"
  | "passed"
  | "rejected";

export interface IRider extends Document {
  fullName: string;
  dateOfBirth: Date;
  phoneNumber: string;
  email: string;
  passwordHash: string;
  address: {
    street: string;
    city: string;
    postcode: string;
  };
  profilePhotoUrl?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  workPreferences: {
    city: string;
    deliveryZone: string;
    preferredSchedule: string[];
    vehicleType: VehicleType;
  };
  documents: {
    identityDocumentUrl?: string;
  };
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  role?: string;
}

import type { Document } from "mongoose";

export type VehicleType = "bicycle" | "scooter" | "car" | "van";

export type ResidencyType =
  | "citizen"
  | "permanent_resident"
  | "work_visa"
  | "student_visa"
  | "other";

export type VerificationStatus = "pending" | "approved" | "rejected";

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
    deliveryZone: string;
  };

  profilePhotoUrl?: string;

  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };

  workPreferences: {
    city: string;
    preferredSchedule: string[];
    vehicleType: VehicleType;
  };

  documents: {
    identityDocumentUrl?: string;
    passportNumber: string;
    passportExpiryDate: Date;
    visaNumber: string;
    residencyType: ResidencyType;
    residencyImageFrontUrl?: string;
    residencyImageBackUrl?: string;
    drivingLicenseUrl?: string;
  };

  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  role?: string;
}

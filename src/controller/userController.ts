import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import RiderInfo from "../db/schema.js";
export class RinderController {
  constructor(private riderInfo: typeof RiderInfo) {}
  createRider = async (req: Request, res: Response) => {
    try {
      const {
        fullName,
        dateOfBirth,
        phoneNumber,
        email,
        password,
        address,
        profilePhotoUrl,
        emergencyContact,
        workPreferences,
        documents,
      } = req.body;
      console.log("req body", req.body);

      if (!fullName || !dateOfBirth || !phoneNumber || !email || !password) {
        return res.status(400).json({
          message: "something missing",
        });
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newRider = await this.riderInfo.create({
        fullName,
        dateOfBirth: new Date(dateOfBirth),
        phoneNumber,
        email,
        passwordHash: hashedPassword,
        address,
        profilePhotoUrl,
        emergencyContact,
        workPreferences,
        documents,
      });

      // 4. Return success response
      return res.status(201).json({
        success: true,
        message: "Rider registered successfully",
        data: newRider,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to create rider",
      });
    }
  };
  loginRider = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // 1. Validate request body
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide both email and password.",
        });
      }

      const rider = await this.riderInfo.findOne({ email });
      if (!rider) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      // 3. Compare hashed password
      const isPasswordMatch = await bcrypt.compare(
        password,
        rider.passwordHash,
      );
      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }
      //  fullName: data.fullName,
      //         email: data.email,
      //         phoneNumber: data.phoneNumber,
      //         dateOfBirth: data.dateOfBirth,
      //         imageUrl: data.profilePhotoUrl,
      //         role: data.role,
      //         RegisterTime: data.createdAt,
      //         status: data.verificationStatus,
      return res.status(200).json({
        success: true,
        message: "Login successful",
        rider: rider,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };
  updateVerificationStatus = async (req: Request, res: Response) => {
    const { riderId, status, rejectionReason } = req.body;
    if (status === "rejected" && !rejectionReason) {
      return res.status(400).json({
        success: false,
        message:
          "A rejection reason is required when setting status to rejected.",
      });
    }

    const updatedRider = await this.riderInfo.findByIdAndUpdate(
      riderId,
      {
        verificationStatus: status,
        rejectionReason: status === status ? rejectionReason : null,
      },
      { new: true },
    );
    return res.status(200).json({ success: true, data: updatedRider });
  };
  singleData = async (req: Request, res: Response) => {
    const { riderId } = req.query;

    try {
      const responseData = await this.riderInfo.findById(riderId);

      if (!responseData) {
        return res.status(404).json({
          success: false,
          message: "Rider not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Rider data retrieved successfully",
        data: responseData,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve rider data",
        error,
      });
    }
  };
}

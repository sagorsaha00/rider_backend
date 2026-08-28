import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { RiderInfo } from "@/db/schema";
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

      if (!fullName || !dateOfBirth || !phoneNumber || !email || !password) {
        return res.status(400).json({
          message:
            "fullName, dateOfBirth, phoneNumber, email, and password are required.",
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
}

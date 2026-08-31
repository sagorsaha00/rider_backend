import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import RiderInfo from "../db/schema.js";
import AdminInfo from "../db/adminSchema.js";
export class adminController {
  constructor(
    private riderInfo: typeof RiderInfo,
    private adminInfo: typeof AdminInfo,
  ) {}

  createAdmin = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { fullName, email, password, profilePhotoUrl } = req.body;

      console.log("req body:", req.body);

      // 1. Validate required fields
      if (!fullName || !email || !password || !profilePhotoUrl) {
        return res.status(400).json({
          success: false,
          message: "Full name, email, password and profile photo are required",
        });
      }

      // 2. Check if admin already exists
      const existingAdmin = await this.adminInfo.findOne({
        email: email.toLowerCase().trim(),
      });

      if (existingAdmin) {
        return res.status(409).json({
          success: false,
          message: "Admin with this email already exists",
        });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 4. Create admin
      const newAdmin = await this.adminInfo.create({
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        passwordHash: hashedPassword,
        profilePhotoUrl,
      });

      const adminResponse = newAdmin.toObject();
      delete adminResponse.passwordHash;

      // 6. Success response
      return res.status(201).json({
        success: true,
        message: "Admin registered successfully",
        data: adminResponse,
      });
    } catch (error: any) {
      console.error("Create admin error:", error);

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "Admin with this email already exists",
        });
      }

      return res.status(500).json({
        success: false,
        message: error.message || "Failed to create admin",
      });
    }
  };
  loginAdmin = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide both email and password.",
        });
      }

      const admin = await this.adminInfo.findOne({ email });
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      // 3. Compare hashed password
      const isPasswordMatch = await bcrypt.compare(
        password,
        admin?.passwordHash,
      );
      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Login successful",
        admin: admin,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: (error as Error).message,
      });
    }
  };
  getALlRiderInfo = async (req: Request, res: Response) => {
    try {
      const allRiderInfo = await this.riderInfo
        .find({})
        .select("-passwordHash");
      if (!allRiderInfo) {
        return res.status(500).json({
          success: false,
          message: "Some thing Problem please refresh and try agaian",
        });
      }
      return res.status(200).json({
        success: true,
        data: allRiderInfo,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "faild To fetch the error",
        error: (error as Error).message,
      });
    }
  };
  deleteRider = async (req: Request, res: Response) => {
    try {
      console.log("delete api hit");
      const { riderId } = req.params;
      console.log("id", riderId);
      const deletedRider = await this.riderInfo.findByIdAndDelete(riderId);
      console.log("deleteRider", deletedRider);

      if (!deletedRider) {
        return res.status(404).json({
          success: false,
          message: "Rider not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Rider deleted successfully.",
        data: { id: deletedRider._id, email: deletedRider.email },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete rider.",
        error: (error as Error).message,
      });
    }
  };
  updateVerificationStatus = async (req: Request, res: Response) => {
    try {
      const { riderId, status, rejectionReason } = req.body;
      console.log("allData", riderId, status, rejectionReason);
      // 1. Validate required fields
      if (!riderId || !status) {
        return res.status(400).json({
          success: false,
          message: "Both riderId and status are required.",
        });
      }

      // 2. Validate rejection reason requirement
      if (status === "rejected" && !rejectionReason?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "A rejection reason is required when setting status to rejected.",
        });
      }

      // 3. Update database cleanly (clears rejectionReason if approved or pending)
      const updatedRider = await this.riderInfo.findByIdAndUpdate(
        riderId,
        {
          verificationStatus: status,
          rejectionReason: status === "rejected" ? rejectionReason : null,
        },
        { new: true, runValidators: true },
      );

      if (!updatedRider) {
        return res.status(404).json({
          success: false,
          message: "Rider record not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: `Rider status updated to ${status} successfully.`,
        data: updatedRider,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error.",
      });
    }
  };
}

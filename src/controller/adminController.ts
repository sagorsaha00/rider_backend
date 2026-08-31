import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import RiderInfo from "../db/schema.js";
import AdminInfo from "../db/adminSchema.js";
export class adminController {
  constructor(
    private riderInfo: typeof RiderInfo,
    private adminInfo: typeof AdminInfo,
  ) {}
  loginRider = async (req: Request, res: Response) => {
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
      const { id } = req.params;

      // Find by _id and delete from MongoDB
      const deletedRider = await this.riderInfo.findByIdAndDelete(id);

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
}

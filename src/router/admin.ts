import express, { Router } from "express";
import RiderInfo from "../db/schema.js";
import adminInfo from "../db/adminSchema.js";
import { adminController } from "../controller/adminController.js";

const router: Router = express.Router();
const adminControllerInstance = new adminController(RiderInfo, adminInfo);

router.post("/createAdmin", adminControllerInstance.createAdmin);
router.post("/loginAdmin", adminControllerInstance.loginAdmin);
router.get("/getAllRiderInfo", adminControllerInstance.getALlRiderInfo);
router.patch(
  "/updateVerificationStatus",
  adminControllerInstance.updateVerificationStatus,
);
router.delete("/riderDeleteInfo/:riderId", adminControllerInstance.deleteRider);

export const adminRouter = router;

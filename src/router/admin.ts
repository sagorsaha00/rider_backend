import express, { Router } from "express";
import RiderInfo from "../db/schema.js";
import adminInfo from "../db/adminSchema.js";
import { adminController } from "../controller/adminController.js";



const router: Router = express.Router();
const adminControllerInstance = new adminController(RiderInfo, adminInfo);

router.post("/loginAdmin", adminControllerInstance.loginRider);
router.get("/getAllRiderInfo", adminControllerInstance.getALlRiderInfo);
router.delete("/riderDeleteInfo/:riderId", adminControllerInstance.deleteRider);

export const adminRouter = router;

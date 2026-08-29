import express, { Router } from "express";
import RiderInfo from "@/db/schema";
import { adminController } from "@/controller/adminController";

const router: Router = express.Router();
const adminControllerInstance = new adminController(RiderInfo);

router.get("/getAllRiderInfo", adminControllerInstance.getALlRiderInfo);
router.delete("/riderDeleteInfo/:riderId", adminControllerInstance.deleteRider);

export const adminRouter = router;

import express, { Router } from "express";
import RiderInfo from "../db/schema.js";
import { adminController } from "../controller/adminController.js";

const router: Router = express.Router();
const adminControllerInstance = new adminController(RiderInfo);

router.get("/getAllRiderInfo", adminControllerInstance.getALlRiderInfo);
router.delete("/riderDeleteInfo/:riderId", adminControllerInstance.deleteRider);

export const adminRouter = router;

import express, { Router } from "express";
import { RinderController } from "@/controller/userController";
import RiderInfo from "@/db/schema";

const router: Router = express.Router();
const riderController = new RinderController(RiderInfo);

router.post("/riderregister", riderController.createRider);
router.post("/riderLoginUser", riderController.loginRider);
router.post("/riderApprove", riderController.updateVerificationStatus);

export const riderRouter = router;

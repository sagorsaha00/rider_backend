import express from "express";
import { RinderController } from "@/controller/userController";
import { RiderInfo } from "@/db/schema";

const router = express.Router();

const riderInfo = new RiderInfo();
const riderController = new RinderController(riderInfo);

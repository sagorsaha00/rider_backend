import express from "express";
import dotenv from "dotenv";
import { db } from "@/db/index";



dotenv.config();
const PORT = 5000;

const app = express();
app.use(express.json());

async function startServer() {
  app.listen(PORT, async () => {
    await db();
    console.log("ok");
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();

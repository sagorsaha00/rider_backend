import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { db } from "@/db/index";
import { riderRouter } from "@/router/user";

dotenv.config();
const PORT = 5000;
var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};
const app = express();
app.use(express.json());
app.use(cors(corsOptions));

app.use("/api/user", riderRouter);
app.get("/", (req, res) => {
  res.status(200).json({
    message: "this server is ok",
  });
});

async function startServer() {
  app.listen(PORT, async () => {
    await db();
    console.log("ok");
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();

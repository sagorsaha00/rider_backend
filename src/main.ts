import express, { type Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "../src/db/index.js";
import { riderRouter } from "../src/router/user.js";

dotenv.config();
const PORT = 5000;
var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};
const app: Express = express();
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
    await connectDB();
    console.log("ok");
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();

export default app;

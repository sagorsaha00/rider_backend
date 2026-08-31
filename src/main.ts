import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "../src/db/index.js";
import { riderRouter } from "../src/router/user.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://rider-frontend-client-server.vercel.app",
  ],
  optionsSuccessStatus: 200,
};

const app: Express = express();

app.use(express.json());
app.use(cors(corsOptions));

// DB connection middleware — runs before every request
const dbMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("❌ DB middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
};

app.use(dbMiddleware);

app.use("/api/user", riderRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "this server is ok",
  });
});

// Only listen locally — Vercel invokes `app` directly as a handler
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log("ok");
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;

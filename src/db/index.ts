import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8"]);

// const uri: string = process.env.CONNECTION_URL as string;
const uri =
  "mongodb+srv://mrartimas24_db_user:rw4XedVRoSSeaThy@rider.atkggmt.mongodb.net/";

if (!uri) {
  throw new Error("CONNECTION_URL is not defined in environment variables.");
}

const options: mongoose.ConnectOptions = {
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 30000,
  connectTimeoutMS: 10000,
};

let isConnected = false;

export async function db() {
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(uri, options);
    isConnected = true;
    console.log("✅ MongoDB Connected via Mongoose");
    return conn.connection;
  } catch (error) {
    isConnected = false;
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
}

export default mongoose;

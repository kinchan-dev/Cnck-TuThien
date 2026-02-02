import mongoose from "mongoose";

export async function connectDB(DB_URL) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(DB_URL);
  console.log("✅ MongoDB connected");
}

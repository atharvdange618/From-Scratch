import mongoose from "mongoose";
import { env } from "@/lib/env";

const MONGODB_URI = env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: CachedConnection | undefined;
}

let cached: CachedConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connect to MongoDB using Mongoose
 * Uses connection caching in development to prevent hot reload issues
 */
async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (cached.promise) {
    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch (e) {
      cached.promise = null;
    }
  }

  const opts = {
    bufferCommands: false,
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  };

  cached.promise = mongoose.connect(MONGODB_URI as string, opts);

  try {
    cached.conn = await cached.promise;

    if (env.NODE_ENV !== "production") {
      console.log("✅ MongoDB connected successfully");

      mongoose.connection.on("error", (err) => {
        console.error("❌ MongoDB connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("⚠️ MongoDB disconnected");
      });
    }
  } catch (e) {
    cached.promise = null;
    console.error("❌ MongoDB connection failed:", e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;

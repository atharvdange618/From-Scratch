import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRateLimit extends Document {
  sessionId: string;
  eventCount: number;
  windowStart: Date;
}

const RateLimitSchema: Schema<IRateLimit> = new Schema({
  sessionId: {
    type: String,
    required: [true, "Session ID is required"],
    unique: true,
    index: true,
  },
  eventCount: {
    type: Number,
    required: true,
    default: 0,
  },
  windowStart: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

RateLimitSchema.index({ windowStart: 1 }, { expireAfterSeconds: 3600 });

const RateLimit: Model<IRateLimit> =
  mongoose.models.RateLimit ||
  mongoose.model<IRateLimit>("RateLimit", RateLimitSchema);

export default RateLimit;

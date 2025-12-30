import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnalyticsEvent extends Document {
  eventType: string;
  eventData: {
    [key: string]: any;
  };
  userId?: string;
  sessionId: string;
  timestamp: Date;
  ipAddress?: string;
  country?: string;
  city?: string;
  region?: string;
  timezone?: string;
  device?: string;
  browser?: string;
  os?: string;
}

const AnalyticsEventSchema: Schema<IAnalyticsEvent> = new Schema({
  eventType: {
    type: String,
    required: [true, "Event type is required"],
    index: true,
  },
  eventData: {
    type: Schema.Types.Mixed,
    default: {},
  },
  userId: {
    type: String,
    index: true,
  },
  sessionId: {
    type: String,
    required: [true, "Session ID is required"],
    index: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  ipAddress: {
    type: String,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  region: {
    type: String,
  },
  timezone: {
    type: String,
  },
  device: {
    type: String,
  },
  browser: {
    type: String,
  },
  os: {
    type: String,
  },
});

// Compound indexes for common queries
AnalyticsEventSchema.index({ eventType: 1, timestamp: -1 });
AnalyticsEventSchema.index({ sessionId: 1, timestamp: -1 });
AnalyticsEventSchema.index({ userId: 1, timestamp: -1 });

AnalyticsEventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

const AnalyticsEvent: Model<IAnalyticsEvent> =
  mongoose.models.AnalyticsEvent ||
  mongoose.model<IAnalyticsEvent>("AnalyticsEvent", AnalyticsEventSchema);

export default AnalyticsEvent;

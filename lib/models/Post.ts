import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPreviewToken {
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface IPost extends Document {
  title: string;
  slug: string;
  summary: string;
  content: string;
  readingTime?: string;
  category:
    | "JavaScript & Web APIs"
    | "Git & Version Control"
    | "Web Development"
    | "Frameworks & Tools"
    | "Software Engineering"
    | "Project Logs";
  tags: string[];
  linkedProject?: mongoose.Types.ObjectId;
  bannerImage?: string;
  isFeatured: boolean;
  publishedDate?: Date;
  isPublished: boolean;
  previewTokens: IPreviewToken[];
  author: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  resources?: Array<{
    title: string;
    url: string;
  }>;
  views?: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema<IPost> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      lowercase: true,
      trim: true,
      index: { unique: true },
    },
    summary: {
      type: String,
      required: [true, "Summary is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    readingTime: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "JavaScript & Web APIs",
        "Git & Version Control",
        "Web Development",
        "Frameworks & Tools",
        "Software Engineering",
        "Project Logs",
      ],
      required: [true, "Category is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
    linkedProject: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    bannerImage: {
      type: String,
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    publishedDate: {
      type: Date,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    previewTokens: [
      {
        token: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          required: true,
        },
        expiresAt: {
          type: Date,
          required: true,
        },
      },
    ],
    author: {
      type: String,
      default: "Atharv Dange",
    },
    seoTitle: {
      type: String,
      trim: true,
    },
    seoDescription: {
      type: String,
      trim: true,
    },
    seoKeywords: {
      type: [String],
      default: [],
    },
    resources: {
      type: [
        {
          title: {
            type: String,
            required: true,
            trim: true,
          },
          url: {
            type: String,
            required: true,
            trim: true,
          },
          _id: false,
        },
      ],
      default: [],
      validate: [
        {
          validator: function (v: any[]) {
            return v.length <= 10;
          },
          message: "Resources cannot exceed 10 items",
        },
      ],
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

PostSchema.index({ isPublished: 1, publishedDate: -1 });
PostSchema.index({ category: 1, isPublished: 1 });
PostSchema.index({ linkedProject: 1, isPublished: 1 });
PostSchema.index({
  title: "text",
  summary: "text",
  content: "text",
  category: "text",
  tags: "text",
});

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;

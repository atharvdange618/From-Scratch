import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICodeSnippet {
  description?: string;
  code?: string;
}

export interface IPost extends Document {
  title: string;
  slug: string;
  summary: string;
  content: string;
  category:
    | "Active Projects"
    | "Completed Projects"
    | "Learning Notes"
    | "Updates";
  tags: string[];
  linkedProject?: mongoose.Types.ObjectId;
  codeSnippets?: ICodeSnippet[];
  bannerImage?: string;
  publishedDate?: Date;
  isPublished: boolean;
  previewToken?: string;
  author: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
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
    category: {
      type: String,
      enum: [
        "Active Projects",
        "Completed Projects",
        "Learning Notes",
        "Updates",
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
    codeSnippets: [
      {
        description: { type: String },
        code: { type: String },
      },
    ],
    bannerImage: {
      type: String,
      trim: true,
    },
    publishedDate: {
      type: Date,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    previewToken: {
      type: String,
      index: { unique: true, sparse: true },
    },
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
  },
  {
    timestamps: true,
  }
);

// Add indexes for faster queries
PostSchema.index({ isPublished: 1, publishedDate: -1 });
PostSchema.index({ category: 1, isPublished: 1 });
PostSchema.index({ linkedProject: 1, isPublished: 1 });

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;

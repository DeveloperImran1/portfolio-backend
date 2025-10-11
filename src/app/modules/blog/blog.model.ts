import { Schema, model } from 'mongoose';
import { IBlog } from './blog.interface';

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: { type: String, unique: true, lowercase: true, trim: true },

    content: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorPhoto: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    reactionsCount: {
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      wow: { type: Number, default: 0 },
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// 🧠 1️⃣ Slug auto-generate before saving
blogSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

// ⚡ 2️⃣ Index category and tags for faster search
blogSchema.index({ category: 1, tags: 1 });

// ⏱️ Auto-calculate readTime based on content length
blogSchema.pre('save', function (next) {
  if (this.content) {
    const words = this.content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 50);
    this.readTime = `${minutes} min read`;
  }
  next();
});

export const Blog = model<IBlog>('Blog', blogSchema);

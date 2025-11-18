import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    uid: { type: String, unique: true, sparse: true },
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String },
    language: { type: String, default: "en" },
    theme: { type: String, default: "light" },
    provider: { type: String, default: "password" },
    role: { type: String, default: "user" },
    terms_privacy: { type: Boolean },
    isVerified: { type: Boolean, default: false },
    emailToken: { type: String, index: true },
    isBlocked: { type: Boolean, default: false },
    lastLogin: { type: Date, default: Date.now() },
    saleforceSync: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);

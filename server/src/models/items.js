import mongoose from "mongoose";

const itemSchema = mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("items", itemSchema);

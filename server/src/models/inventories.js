import mongoose from "mongoose";

const inventorySchema = mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, default: "" },
    createdBy: { type: String, required: true },
    items: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("inventories", inventorySchema);

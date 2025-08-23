import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  company: { type: String, required: true },
  address: { type: String },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  total_value: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// ✅ ES module export
export default mongoose.model("Customer", customerSchema);

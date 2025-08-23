import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  company: { type: String, required: true },
  address: String,
  status: { type: String, enum: ["cold", "warm", "hot"], default: "cold" },
  source: String,
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  notes: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.model("Lead", leadSchema);

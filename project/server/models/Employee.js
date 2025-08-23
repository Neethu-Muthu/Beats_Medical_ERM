import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ["CEO", "Director", "Employee"],
    default: "Employee",
  },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  member_id: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.model("Employee", employeeSchema);

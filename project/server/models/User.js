// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["CEO", "Director", "Employee"],
    default: "Employee",
  },
  department: { type: String, default: "" },
  designation: { type: String, default: "" },
  member_id: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);

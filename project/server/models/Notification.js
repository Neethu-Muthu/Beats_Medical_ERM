import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["task_assigned", "lead_assigned", "task_deadline", "lead_converted"],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  related_id: { type: mongoose.Schema.Types.ObjectId }, // lead_id or task_id
});

// ✅ ES module export
export default mongoose.model("Notification", notificationSchema);

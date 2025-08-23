import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/tasks", taskRoutes);
app.use("/employees", employeeRoutes);
app.use("/leads", leadRoutes);
app.use("/customers", customerRoutes);
app.use("/notifications", notificationRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// LoginHistory Schema
const loginHistorySchema = new mongoose.Schema({
  mobile: String,
  success: Boolean,
  ip: String,
  timestamp: { type: Date, default: Date.now },
});
const LoginHistory = mongoose.model("LoginHistory", loginHistorySchema);

// Routes
app.post("/login", async (req, res) => {
  const { mobile, password } = req.body;

  // ✅ Hardcoded credentials
  const isValid = mobile === "565225438" && password === "beats@123";

  // ✅ Save login attempt to MongoDB
  await LoginHistory.create({
    mobile,
    success: isValid,
    ip: req.ip,
  });

  if (isValid) {
    res.json({ success: true, message: "Login successful" });
  } else {
    res.json({ success: false, message: "Invalid credentials" });
  }
});



// Get login history (optional, for admin viewing)
app.get("/login-history", async (req, res) => {
  const history = await LoginHistory.find().sort({ timestamp: -1 });
  res.json(history);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


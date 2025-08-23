import mongoose from "mongoose";
import dotenv from "dotenv";
import employees from "./data/employee.js";
import Employee from "./models/Employee.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

(async () => {
  try {
    await Employee.deleteMany(); // optional: clear old data
    await Employee.insertMany(employees);
    console.log("✅ Employees seeded to MongoDB");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
})();

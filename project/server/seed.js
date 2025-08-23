import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedUser = async () => {
  try {
    await User.deleteMany(); // clear old users
    const user = await User.create({
      name: "MUHAMMAD RAFEEK KABEER",
      mobile: "565225438",
      password: "beats@123", // (later we’ll hash this)
      role: "CEO",
      department: "Executive",
      designation: "CEO",
      member_id: "BM16001",
    });
    console.log("✅ User created:", user);
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding user:", err);
  }
};

seedUser();

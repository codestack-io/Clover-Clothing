import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load environment variables from both .env and .env.local
dotenv.config({ path: [".env.local", ".env"] });

const MONGODB_URI = process.env.MONGODB_URI;

// Admin Credentials
const ADMIN_DETAILS = {
  name: "Site Owner",
  email: "admin@yourstore.com",
  password: "YourSecurePassword123!", // Change this to your password
  role: "admin",
};

// User Schema matching NextAuth structure
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function seedAdmin() {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI could not be loaded from .env or .env.local");
    process.exit(1);
  }

  try {
    console.log("Connecting to Database...");
    await mongoose.connect(MONGODB_URI);

    const existingAdmin = await User.findOne({ email: ADMIN_DETAILS.email });
    if (existingAdmin) {
      console.log("⚠️ Admin user already exists with this email.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(ADMIN_DETAILS.password, 10);

    await User.create({
      name: ADMIN_DETAILS.name,
      email: ADMIN_DETAILS.email,
      password: hashedPassword,
      role: ADMIN_DETAILS.role,
    });

    console.log("✅ Admin account created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
    process.exit(1);
  }
}

seedAdmin();
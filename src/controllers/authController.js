import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser, updateLastLogin } from "../models/userModel.js";
import { findRoleByName } from "../models/roleModel.js";

const JWT_SECRET = "your_jwt_secret_key";

export const login = async (req, res) => {
  try {
    console.log("📥 Login request body:", req.body);

    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    console.log("🔍 Found user:", user);

    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = password === user.password || await bcrypt.compare(password, user.password);
    console.log("🔑 Password match:", isMatch);

    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    if (user.status !== "active") {
      console.log("🚫 User is not active:", user.status);
      return res.status(403).json({ message: "Account is deactivated" });
    }

    // Get permissions
    const role = await findRoleByName(user.role);
    console.log("🎭 Role data:", role);

    const permissions = role ? JSON.parse(role.permissions) : [];
    console.log("✅ Permissions:", permissions);

    await updateLastLogin(user.id);
    console.log("🕒 Last login updated for user:", user.id);

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    console.log("🎫 Generated token:", token);

    res.json({
      ...user,
      permissions,
      token
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const register = async (req, res) => {
  try {
    console.log("📥 Register request body:", req.body);

    const { name, email, password, role = "Staff" } = req.body;

    const existing = await findUserByEmail(email);
    console.log("🔍 Existing user check:", existing);

    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    console.log("🔒 Hashed password:", hashed);

    const newUser = await createUser({ name, email, password: hashed, role });
    console.log("✅ New user created:", newUser);

    const roleData = await findRoleByName(role);
    console.log("🎭 Role data for new user:", roleData);

    const permissions = roleData ? JSON.parse(roleData.permissions) : [];
    console.log("✅ Permissions for new user:", permissions);

    const token = jwt.sign({ id: newUser.id, role }, JWT_SECRET, { expiresIn: "1h" });
    console.log("🎫 Generated token:", token);

    res.json({
      ...newUser,
      permissions,
      token
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: err.message });
  }
};

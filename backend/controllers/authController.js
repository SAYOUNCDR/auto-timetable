const Admin = require("../models/admin.model");
const Faculty = require("../models/faculty.model");
const Student = require("../models/student.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateTokens = (user) => {
  const payload = { id: user._id, role: user.role, email: user.email };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    let user;
    if (role === "admin") user = await Admin.findOne({ email });
    else if (role === "faculty") user = await Faculty.findOne({ email });
    else if (role === "student") user = await Student.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.hashedPassword);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const tokens = generateTokens(user);

    // Store Refresh Token in HttpOnly Cookie
    res.cookie("jwt", tokens.refreshToken, {
      httpOnly: true, // Accessible only by web server
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // Cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send Access Token in JSON
    res.json({ accessToken: tokens.accessToken });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.refresh = async (req, res) => {
  const refreshToken = req.cookies.jwt;

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Invalid Refresh Token." });

      let user;
      if (decoded.role === "admin") user = await Admin.findById(decoded.id);
      else if (decoded.role === "faculty")
        user = await Faculty.findById(decoded.id);
      else if (decoded.role === "student")
        user = await Student.findById(decoded.id);

      if (!user)
        return res
          .status(403)
          .json({ message: "User not found during refresh." });

      const newTokens = generateTokens(user);
      res.json({ accessToken: newTokens.accessToken });
    }
  );
};

exports.logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Cookie cleared" });
};

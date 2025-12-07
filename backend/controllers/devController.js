const Admin = require("../models/admin.model");
const bcrypt = require("bcrypt");

exports.createFirstAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const existing = await Admin.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Admin with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = await Admin.create({ name, email, hashedPassword });
        res.status(201).json({ message: "Admin created successfully", adminId: newAdmin._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

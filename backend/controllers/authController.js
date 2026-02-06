


const User = require("../db/models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//  REGISTER 
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    //  active user exists
    if (existingUser && existingUser.isActive) {
      return res.status(400).json({ message: "User already exists" });
    }

    //  deleted user exists
    if (existingUser && !existingUser.isActive) {
      return res.status(400).json({
        message:
          "This account was deleted. Please sign up using a different email.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isActive: true, 
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register ERROR:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// LOGIN 
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //  Only active users can login
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login ERROR:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// UPDATE PROFLE 
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;

    const updateData = { name, email, bio };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("updateProfile ERROR:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

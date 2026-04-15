const User = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/password.util");
const { generateToken } = require("../utils/jwt.util");

exports.registerUser = async ({ name, email, password, role }) => {
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const createdUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  const token = generateToken(createdUser);

  const user = createdUser.toObject();
  delete user.password;

  return { user, token };
};

exports.loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("All feilds are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user);

  const userOjb = user.toObject();
  delete userOjb.password;

  return { user: userOjb, token };
};

exports.getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

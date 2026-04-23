import User from "../user/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ApiError } from "../../utils/apiError.js";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const registerUserService = async (data) => {
  const exists = await User.findOne({ email: data.email });

  if (exists) {
    throw new ApiError(409, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    ...data,
    password: hashedPassword,
  });

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj };
};

export const loginUserService = async (data) => {
  const user = await User.findOne({ email: data.email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user);

  const userOjb = user.toObject();
  delete userOjb.password;

  return { user: userOjb, token };
};

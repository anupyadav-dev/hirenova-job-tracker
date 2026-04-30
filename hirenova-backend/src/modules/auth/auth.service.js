import User from "../user/user.model.js";
import bcrypt from "bcrypt";
import { ApiError } from "../../utils/apiError.js";
import { generateToken } from "../../utils/token.util.js";

export const registerUserService = async (data) => {
  if (!data.password) {
    throw new ApiError(400, "Password is required");
  }

  const email = data.email.toLowerCase();

  const exists = await User.findOne({ email });

  if (exists) {
    throw new ApiError(409, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    name: data.name,
    email,
    password: hashedPassword,
    role: data.role || "user",
  });

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj };
};

export const loginUserService = async (data) => {
  const email = data.email.toLowerCase();

  const user = await User.findOne({ email: data.email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!data.password || !user.password) {
    throw new ApiError(500, "Password missing");
  }

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user);

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

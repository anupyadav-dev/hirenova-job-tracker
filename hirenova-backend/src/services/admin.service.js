const User = require("../models/user.model");

exports.getAllUsers = async () => {
  return await User.find({ role: "user" }).select("-password");
};

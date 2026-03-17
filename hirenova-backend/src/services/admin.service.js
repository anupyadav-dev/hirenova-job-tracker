const User = require("../models/user.model");

exports.getAllUsers = async () => {
  return await User.find({ role: "user" }).select("-password");
};

exports.getAllRecruiters = async () => {
  return await User.find({ role: "recruiter" }).select("-password");
};

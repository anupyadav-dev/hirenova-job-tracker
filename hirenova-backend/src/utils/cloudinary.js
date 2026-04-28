import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.js";

cloudinary.config({
  cloud_name: env.cloudName,
  api_key: env.cloudKey,
  api_secret: env.cloudSecret,
});

export default cloudinary;

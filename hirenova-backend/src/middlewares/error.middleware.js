import multer from "multer";

const errorHandler = (err, req, res, next) => {
  console.log("ERROR TYPE:", err.constructor.name);
  console.log("ERROR MESSAGE:", err.message);

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: getMulterMessage(err),
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

const getMulterMessage = (err) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return "File too large";
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return "Unexpected file field";
  }

  return err.message;
};

export default errorHandler;

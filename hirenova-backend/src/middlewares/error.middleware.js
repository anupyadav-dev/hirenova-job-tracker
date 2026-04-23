const errorHandler = (err, req, res, next) => {
  console.log("ERROR TYPE:", err.constructor.name);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
  });
};

export default errorHandler;

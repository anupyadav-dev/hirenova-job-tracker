const { body } = require("express-validator");

exports.createJobValidation = [
  body("title").notEmpty().withMessage("Title is required").trim(),

  body("description").notEmpty().withMessage("Description required").trim(),

  body("location").notEmpty().trim(),

  body("salary")
    .optional()
    .isNumeric()
    .withMessage("Salary must be number")
    .trim(),
];

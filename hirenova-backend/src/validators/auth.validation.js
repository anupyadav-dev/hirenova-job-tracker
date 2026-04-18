import { body } from "express-validator";

export const registerValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 chars")
    .trim()
    .escape(),

  body("email").isEmail().withMessage("Valid email required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars")
    .matches(/[A-Z]/)
    .withMessage("Must include uppercase")
    .matches(/[0-9]/)
    .withMessage("Must include number"),

  body("role")
    .optional()
    .isIn(["user", "recruiter"])
    .withMessage("Invalid role"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];

import { body } from "express-validator";

export const createJobValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description required"),
  body("company").notEmpty().withMessage("Company required"),
  body("location").notEmpty().withMessage("Location required"),
  body("category").notEmpty().withMessage("Category required"),
];

export const updateJobValidation = [
  body("title").optional().notEmpty(),
  body("description").optional().notEmpty(),
];

import { body } from "express-validator";

export const createJobValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty(),
  body("company").notEmpty(),
  body("location").notEmpty(),
];

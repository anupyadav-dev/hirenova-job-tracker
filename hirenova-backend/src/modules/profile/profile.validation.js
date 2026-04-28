import { body } from "express-validator";

export const profileValidation = [
  body("bio")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Bio max 500 chars"),

  body("experience")
    .optional()
    .isString()
    .withMessage("Experience must be string"),

  body("phone").optional().isString().withMessage("Phone must be string"),

  body("skills")
    .optional()
    .custom((value) => {
      if (Array.isArray(value) || typeof value === "string") {
        return true;
      }
      throw new Error("Skills must be array or comma string");
    }),
];

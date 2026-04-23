import { body } from "express-validator";

export const profileValidation = [
  body("bio").optional().isString(),
  body("skills").optional().isArray(),
  body("experience").optional().isString(),
  body("phone").optional().isString(),
];

/**
 * Profile module — Zod schemas.
 *
 * The old profile.validation.ts used express-validator with a custom()
 * validator for the skills field. Zod's z.union() handles this cleanly:
 *   - string: "React, Node, TypeScript"
 *   - array: ["React", "Node", "TypeScript"]
 *
 * Notice how much simpler the Zod version is vs the custom() callback.
 */

import { z } from "zod";

export const profileSchema = z.object({
  bio: z.string().max(500, "Bio max 500 characters").trim().optional(),
  experience: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  skills: z
    .union([
      z.string().transform((s) => s.split(",").map((sk) => sk.trim()).filter(Boolean)),
      z.array(z.string().trim()),
    ])
    .optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

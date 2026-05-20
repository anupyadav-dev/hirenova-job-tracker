/**
 * Profile module — Zod schemas.
 *
 * skills accepts both formats via z.union():
 *   - comma string: "React, Node, TypeScript" → transformed to string[]
 *   - array: ["React", "Node", "TypeScript"]  → passed through as-is
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

import { z } from "zod";

export const signupSchema = z.object({
  name: z.string(),
  email: z.email(),
  role: z.enum(["creator", "contestee"]).default("contestee"),
  password: z.string(),
});

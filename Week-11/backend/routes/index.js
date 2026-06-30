import { password } from "bun";
import { z } from "zod";

export const signupSchema = z.object({
  username: z.email(),
  email: z.email(),
  firstName: z.string().min(1),
  lastName: z.string(),
  password: z
    .string()
    .min(6)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
});

export const signinSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

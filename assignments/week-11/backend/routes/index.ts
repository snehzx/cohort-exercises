import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(1),
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

export const updateSchema = signupSchema
  .omit({ email: true, password: true })
  .partial()
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "atleast one feild must be provided",
  });

export const transferSchema = z.object({
  to: z.string().min(1, "userid is required"),
  amount: z.number().positive("amount must be positive"),
});

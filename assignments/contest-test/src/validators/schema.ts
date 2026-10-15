import { z } from "zod";

export const signupSchema = z.object({
  name: z.string(),
  email: z.email(),
  role: z.enum(["creator", "contestee"]).default("contestee"),
  password: z.string(),
});

export const loginSchema = signupSchema.pick({
  email: true,
  password: true,
});

export const contestSchema = z.object({
  title: z.string(),
  description: z.string(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});

export const mcqsSchema = z.object({
  questionText: z.string(),
  options: z.array(z.string()).min(2),
  correctOptionIndex: z.number().int().min(0).max(4),
  points: z.number(),
});

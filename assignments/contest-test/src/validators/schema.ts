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

export const mcqsSubmitSchema = z.object({
  selectedOptionIndex: z.number().int().min(0),
});

export const dsaSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  points: z.number().int().positive().default(100),
  timeLimit: z.number().default(2000),
  memoryLimit: z.number().default(256),
  testCases: z
    .array(
      z.object({
        input: z.string(),
        expectedOutput: z.string(),
        isHidden: z.boolean().default(false),
      }),
    )
    .min(1),
});

export const dsaSubmitSchema = z.object({
  code: z.string().min(1),
  language: z.string(),
});

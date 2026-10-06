import z from "zod";

export const signupSchema = z.object({
  email: z.email(),
  name: z.string(),
  password: z.string().min(6),
  role: z.enum(["teacher", "student"]),
});

export const loginSchema = signupSchema.pick({
  email: true,
  password: true,
});

export const classSchema = z.object({
  className: z.string(),
});

export const addStudentSchema = z.object({
  studentId: z.string(),
});

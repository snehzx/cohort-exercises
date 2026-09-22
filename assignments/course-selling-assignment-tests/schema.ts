import { password } from "bun";
import { z } from "zod";

export const SignupSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string(),
  role: z.enum(["STUDENT", "INSTRUCTOR"]),
});

export const LoginSchema = SignupSchema.pick({
  email: true,
  password: true,
});

export const CreateCourseSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
});

export const UpdateCourseSchema = CreateCourseSchema.partial().refine(
  (data) => Object.values(data).some((v) => v !== undefined),
  {
    message: "atleast one feild must be provided",
  },
);

export const CreateLessonSchema = z.object({
  title: z.string(),
  content: z.string(),
  courseId: z.string(),
});

export const PurchaseCourseSchema = z.object({
  courseId: z.string(),
});

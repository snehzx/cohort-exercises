// These shapes mirror exactly what the Express + Prisma backend returns.
// Keeping them in one place means every component agrees on what a
// "Course" or "User" looks like.

export type Role = "STUDENT" | "INSTRUCTOR";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  price: number;
  instructorId: string;
  createdAt: string;
  updatedAt: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  courseId: string;
  createdAt: string;
}

export interface Purchase {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  createdAt: string;
  course: Course;
}

export interface CourseStats {
  totalPurchases: number;
  totalRevenue: number;
  price: number;
}

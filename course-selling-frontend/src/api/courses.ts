import { api } from "./axios";
import type { Course, CourseStats } from "../types";

interface CreateCoursePayload {
  title: string;
  description: string;
  price: number;
}

// GET /courses?page=&limit= -> Course[]  (public, no token needed)
export function getCourses(page = 1, limit = 10) {
  return api.get<Course[]>("/courses", { params: { page, limit } });
}

// GET /courses/:id -> Course & { lessons: Lesson[] }  (public)
export function getCourseById(id: string) {
  return api.get<Course>(`/courses/${id}`);
}

// POST /courses -> { id }  (requires INSTRUCTOR token)
export function createCourse(payload: CreateCoursePayload) {
  return api.post<{ id: string }>("/courses", payload);
}

// PATCH /courses/:id -> Course  (requires INSTRUCTOR token)
export function updateCourse(id: string, payload: Partial<CreateCoursePayload>) {
  return api.patch<Course>(`/courses/${id}`, payload);
}

// DELETE /courses/:id  (requires INSTRUCTOR token)
export function deleteCourse(id: string) {
  return api.delete(`/courses/${id}`);
}

// GET /courses/:id/stats -> { totalPurchases, totalRevenue, price }
export function getCourseStats(id: string) {
  return api.get<CourseStats>(`/courses/${id}/stats`);
}

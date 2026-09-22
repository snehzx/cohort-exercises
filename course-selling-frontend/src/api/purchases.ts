import { api } from "./axios";
import type { Course, Purchase } from "../types";

// POST /purchases -> Course  (requires STUDENT token)
export function purchaseCourse(courseId: string) {
  return api.post<Course>("/purchases", { courseId });
}

// GET /users/:id/purchases -> Purchase[]  (requires STUDENT token, id must match logged-in user)
export function getMyPurchases(userId: string) {
  return api.get<Purchase[]>(`/users/${userId}/purchases`);
}

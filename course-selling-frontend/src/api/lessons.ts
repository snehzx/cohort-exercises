import { api } from "./axios";
import type { Lesson } from "../types";

interface CreateLessonPayload {
  title: string;
  content: string;
  courseId: string;
}

// POST /lessons -> Lesson  (requires INSTRUCTOR token)
export function createLesson(payload: CreateLessonPayload) {
  return api.post<Lesson>("/lessons", payload);
}

// GET /courses/:courseId/lessons -> Lesson[]  (public)
export function getLessons(courseId: string) {
  return api.get<Lesson[]>(`/courses/${courseId}/lessons`);
}

import { Link } from "react-router-dom";
import type { Course } from "../types";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-4 transition hover:shadow-md"
    >
      <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-gray-500">
        {course.description || "No description."}
      </p>
      <p className="mt-3 font-semibold text-gray-900">${course.price}</p>
    </Link>
  );
}

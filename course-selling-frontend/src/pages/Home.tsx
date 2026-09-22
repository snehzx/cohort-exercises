import { useEffect, useState } from "react";
import { getCourses } from "../api/courses";
import { CourseCard } from "../components/CourseCard";
import type { Course } from "../types";

export function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // useEffect with an empty dependency array [] runs once, right after
  // the component first renders - the classic "fetch data on page load" pattern.
  useEffect(() => {
    getCourses()
      .then((res) => setCourses(res.data))
      .catch(() => setError("Failed to load courses."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-8 text-center text-gray-500">Loading courses...</p>;
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>;

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">All Courses</h1>

      {courses.length === 0 ? (
        <p className="text-gray-500">No courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

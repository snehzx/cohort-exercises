import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getCourseById, deleteCourse, getCourseStats } from "../api/courses";
import { createLesson } from "../api/lessons";
import { purchaseCourse } from "../api/purchases";
import { useAuth } from "../context/AuthContext";
import type { Course, CourseStats } from "../types";

export function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");

  const [stats, setStats] = useState<CourseStats | null>(null);

  const isOwner = user?.role === "INSTRUCTOR" && user.id === course?.instructorId;

  function loadCourse() {
    if (!id) return;
    setLoading(true);
    getCourseById(id)
      .then((res) => setCourse(res.data))
      .catch(() => setMessage("Failed to load course."))
      .finally(() => setLoading(false));
  }

  useEffect(loadCourse, [id]);

  async function handlePurchase() {
    if (!id) return;
    setMessage("");
    try {
      await purchaseCourse(id);
      setMessage("Purchased! Check 'My Purchases'.");
    } catch (err) {
      setMessage("Purchase failed (maybe you already own this course).");
    }
  }

  async function handleAddLesson(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    setMessage("");
    try {
      await createLesson({ title: lessonTitle, content: lessonContent, courseId: id });
      setLessonTitle("");
      setLessonContent("");
      loadCourse();
    } catch (err) {
      setMessage("Failed to add lesson.");
    }
  }

  async function handleDelete() {
    if (!id) return;
    if (!confirm("Delete this course?")) return;
    try {
      await deleteCourse(id);
      setMessage("Course deleted.");
      setCourse(null);
    } catch (err) {
      setMessage("Failed to delete course.");
    }
  }

  async function loadStats() {
    if (!id) return;
    try {
      const res = await getCourseStats(id);
      setStats(res.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setMessage("Stats route requires being logged in (see note below).");
      } else {
        setMessage("Failed to load stats.");
      }
    }
  }

  if (loading) return <p className="p-8 text-center text-gray-500">Loading...</p>;
  if (!course) return <p className="p-8 text-center text-gray-500">Course not found.</p>;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold text-gray-900">{course.title}</h1>
      <p className="mt-2 text-gray-600">{course.description}</p>
      <p className="mt-2 text-lg font-semibold text-gray-900">${course.price}</p>

      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}

      {user?.role === "STUDENT" && (
        <button
          onClick={handlePurchase}
          className="mt-4 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Buy this course
        </button>
      )}

      <div className="mt-8">
        <h2 className="mb-3 text-lg font-medium text-gray-900">Lessons</h2>
        {course.lessons && course.lessons.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {course.lessons.map((lesson) => (
              <li key={lesson.id} className="rounded-md border border-gray-200 bg-white p-3">
                <p className="font-medium text-gray-900">{lesson.title}</p>
                <p className="text-sm text-gray-600">{lesson.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No lessons yet.</p>
        )}
      </div>

      {isOwner && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="mb-3 text-lg font-medium text-gray-900">Instructor tools</h2>

          <form onSubmit={handleAddLesson} className="mb-6 flex flex-col gap-3">
            <input
              type="text"
              placeholder="Lesson title"
              required
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Lesson content"
              required
              value={lessonContent}
              onChange={(e) => setLessonContent(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              rows={3}
            />
            <button
              type="submit"
              className="self-start rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              Add lesson
            </button>
          </form>

          <div className="flex items-center gap-3">
            <button
              onClick={loadStats}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Load stats
            </button>
            <button
              onClick={handleDelete}
              className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
            >
              Delete course
            </button>
          </div>

          {stats && (
            <p className="mt-3 text-sm text-gray-700">
              {stats.totalPurchases} purchase(s), ${stats.totalRevenue} revenue.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

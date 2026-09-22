import { useEffect, useState } from "react";
import { getMyPurchases } from "../api/purchases";
import { useAuth } from "../context/AuthContext";
import type { Purchase } from "../types";
import { CourseCard } from "../components/CourseCard";

export function MyPurchases() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getMyPurchases(user.id)
      .then((res) => setPurchases(res.data))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <p className="p-8 text-center text-gray-500">Loading...</p>;

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">My Purchases</h1>

      {purchases.length === 0 ? (
        <p className="text-gray-500">You haven't purchased any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {purchases.map((p) => (
            <CourseCard key={p.id} course={p.course} />
          ))}
        </div>
      )}
    </div>
  );
}

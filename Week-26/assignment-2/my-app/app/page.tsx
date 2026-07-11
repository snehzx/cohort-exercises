import EventList from "@/components/EventList/EventList";

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg w-full p-6 bg-white border border-gray-200 rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center mb-4">Event List</h2>
        <EventList />
      </div>
    </div>
  );
}

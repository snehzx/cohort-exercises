import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { CourseDetail } from "./pages/CourseDetail";
import { CreateCourse } from "./pages/CreateCourse";
import { MyPurchases } from "./pages/MyPurchases";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/courses/:id" element={<CourseDetail />} />

        <Route
          path="/create-course"
          element={
            <ProtectedRoute role="INSTRUCTOR">
              <CreateCourse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-purchases"
          element={
            <ProtectedRoute role="STUDENT">
              <MyPurchases />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

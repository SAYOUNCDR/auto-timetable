import { Routes, Route } from "react-router-dom";
import Landing from "./pages/public/Landing";
import Dashboard from "./pages/admin/Dashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Landing />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Route>

        {/* Faculty Routes */}
        <Route element={<ProtectedRoute allowedRoles={["faculty"]} />}>
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        </Route>

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

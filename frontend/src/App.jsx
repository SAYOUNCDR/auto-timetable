import { Routes, Route } from "react-router-dom";
import Landing from "./pages/public/Landing";
import Dashboard from "./pages/admin/Dashboard";
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

        {/* Faculty Routes (Placeholder) */}
        <Route element={<ProtectedRoute allowedRoles={["faculty"]} />}>
          <Route
            path="/faculty/dashboard"
            element={<div>Faculty Dashboard</div>}
          />
        </Route>

        {/* Student Routes (Placeholder) */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route
            path="/student/dashboard"
            element={<div>Student Dashboard</div>}
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

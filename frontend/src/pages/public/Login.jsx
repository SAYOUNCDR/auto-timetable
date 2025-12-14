import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for redirection

const Login = ({ isOpen, onClose }) => {
  const navigate = useNavigate(); // Hook for navigation
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student", // Default role
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // 1. Save Access Token (In a real app, save to Context, not just console)
      console.log("Access Token:", data.accessToken);
      // setAuth({ token: data.accessToken, role: formData.role }); 

      // 2. Close Modal
      onClose();

      // 3. Redirect based on Role
      if (formData.role === "admin") navigate("/admin/dashboard");
      else if (formData.role === "faculty") navigate("/faculty/dashboard");
      else if (formData.role === "student") navigate("/student/dashboard");

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-yellow-400 transition-colors duration-200 z-10 cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Content */}
        <div className="relative p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold text-gray-900 mb-2 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm font-light">
              Please select your role to sign in
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="flex p-1 mb-8 bg-gray-100 rounded-full shadow-inner">
            {["student", "faculty", "admin"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleChange(role)}
                className={`flex-1 py-2 text-sm font-medium rounded-full capitalize transition-all duration-200 cursor-pointer ${
                  formData.role === role
                    ? "bg-white text-yellow-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors duration-300 text-sm"
                placeholder="Email Address"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors duration-300 text-sm"
                placeholder="Password"
                required
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <a href="#" className="text-xs text-gray-400 hover:text-yellow-500 transition-colors">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gray-900 text-white rounded-full font-medium text-sm hover:bg-gray-800 hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-xs text-gray-400">
                Don't have an account?{" "}
                <a href="#" className="text-yellow-500 hover:text-yellow-600 font-medium ml-1">
                  Contact Admin
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
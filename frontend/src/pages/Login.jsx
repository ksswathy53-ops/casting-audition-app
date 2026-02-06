

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../Components/Loader"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const res = await loginUser({ email, password });

      login(res.data.token, res.data.user);

      //  Navigate after login
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-gray-900 to-black px-4">
      <div className="w-full max-w-md p-8 bg-zinc-900 rounded-xl shadow-xl shadow-black/60 border border-zinc-800">

        {/* Heading */}
        <h1 className="text-3xl font-bold mb-6 text-white text-center">
          Welcome Back
        </h1>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-1 text-sm">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 mb-1 text-sm">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold flex justify-center items-center gap-2 transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? <Loader /> : "Login"}
          </button>
        </form>

        {/* Links */}
        <div className="mt-5 text-center space-y-2">
          <p className="text-gray-400 text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:text-blue-500">
              Sign up
            </Link>
          </p>

          <p className="text-gray-400 text-sm">
            Forgot your password?{" "}
            <Link
              to="/forgot-password"
              className="text-blue-400 hover:text-blue-500"
            >
              Reset here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

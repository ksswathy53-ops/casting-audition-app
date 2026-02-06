



import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-gray-900 to-black px-4">
      <div className="w-full max-w-md p-8 bg-zinc-900 rounded-xl shadow-xl border border-zinc-800">
        <h1 className="text-2xl font-bold text-white text-center mb-4">
          Forgot Password
        </h1>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-gray-400 text-sm text-center">
              Enter your email and we’ll help you reset your password
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center text-green-400">
             Reset link sent! (mock)
          </div>
        )}

        <p className="text-center text-sm text-gray-400 mt-6">
          Remembered your password?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

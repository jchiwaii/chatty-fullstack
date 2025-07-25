import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { MessageCircle, Github } from "lucide-react";
import toast from "react-hot-toast";

const Loginpage = () => {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const { login, isLoggingin } = useAuth();

  const validateForm = () => {
    const { email, password } = formData;
    if (!email || !password) {
      toast.error("All fields are required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      await login(formData);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white font-sans">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <MessageCircle className="mx-auto h-10 w-auto text-zinc-500" />
          <h2 className="mt-4 text-2xl font-medium tracking-tight">Sign In</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Enter your email below to login to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="block w-full px-3 py-2 bg-black border border-zinc-800 rounded-md text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition-colors"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-white hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              className="mt-1 block w-full px-3 py-2 bg-black border border-zinc-800 rounded-md text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition-colors"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-black bg-white hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-black transition-colors disabled:opacity-50"
            disabled={isLoggingin}
          >
            {isLoggingin ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black text-zinc-500">
              Or continue with
            </span>
          </div>
        </div>

        <div>
          <button className="w-full flex items-center justify-center py-2 px-4 border border-zinc-800 rounded-md text-sm font-medium text-white bg-transparent hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-700 focus:ring-offset-black transition-colors">
            <Github className="h-4 w-4 mr-2" />
            Sign in with GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-white hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Loginpage;

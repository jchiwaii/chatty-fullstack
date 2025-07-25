import React from "react";
import { useAuth } from "../store/useAuth";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { MessageCircle } from "lucide-react"; // Example icon
import GoogleIcon from "../components/GoogleIcon";

const Signuppage = () => {
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const { signup, isSigningup } = useAuth();

  const validateForm = () => {
    const { firstName, lastName, username, email, password } = formData;

    if (!firstName || !lastName || !username || !email || !password) {
      toast.error("All fields are required.");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
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
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const { googleSignIn } = useAuth();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      googleSignIn(tokenResponse.access_token);
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      toast.error("Google login failed");
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white font-sans">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <MessageCircle className="mx-auto h-10 w-auto text-zinc-500" />
          <h2 className="mt-4 text-2xl font-medium tracking-tight">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Welcome! Please fill in the details to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="firstName" className="sr-only">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                className="block w-full px-3 py-2 bg-black border border-zinc-800 rounded-md text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition-colors"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="lastName" className="sr-only">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                className="block w-full px-3 py-2 bg-black border border-zinc-800 rounded-md text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition-colors"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="block w-full px-3 py-2 bg-black border border-zinc-800 rounded-md text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition-colors"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full px-3 py-2 bg-black border border-zinc-800 rounded-md text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition-colors"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full px-3 py-2 bg-black border border-zinc-800 rounded-md text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition-colors"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-black bg-white hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-black transition-colors disabled:opacity-50"
              disabled={isSigningup}
            >
              {isSigningup ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
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
          <button
            onClick={() => handleGoogleLogin()}
            className="w-full flex items-center justify-center py-2 px-4 border border-zinc-800 rounded-md text-sm font-medium text-white bg-transparent hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-700 focus:ring-offset-black transition-colors"
          >
            <GoogleIcon className="h-4 w-4 mr-2" />
            Sign up with Google
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-white hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signuppage;

import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { useGoogleLogin } from "@react-oauth/google";
import { MessageCircle } from "lucide-react";
import GoogleIcon from "../components/GoogleIcon"; // Assuming you have this component
import toast from "react-hot-toast";

// Mock Chat Bubble Component for the visual effect
const ChatBubble = ({ avatar, name, time, isCode, children, delay }) => (
  <div
    className="flex animate-fade-in-up items-start gap-3"
    style={{ animationDelay: `${delay * 100}ms` }}
  >
    <img
      src={avatar}
      alt={name}
      className="h-9 w-9 rounded-full object-cover"
      onError={(e) => {
        e.target.src = `https://placehold.co/36x36/18181b/ffffff?text=${name.charAt(
          0
        )}`;
      }}
    />
    <div className="flex-1">
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-bold text-white">{name}</span>
        <span className="text-xs text-zinc-400">{time}</span>
      </div>
      {isCode ? (
        <div className="mt-1 overflow-x-auto rounded-lg bg-zinc-900 p-3 font-mono text-xs text-zinc-200">
          <pre>
            <code>{children}</code>
          </pre>
        </div>
      ) : (
        <p className="mt-1 text-sm text-zinc-300">{children}</p>
      )}
    </div>
  </div>
);

const Loginpage = () => {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const { login, isLoggingin, googleSignIn } = useAuth();

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
      toast.error("An error occurred during login.");
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      if (googleSignIn) {
        googleSignIn(tokenResponse.access_token);
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      toast.error("Google login failed");
    },
  });

  return (
    <div className="grid min-h-screen bg-black font-sans text-white lg:grid-cols-2">
      {/* Left Column: Visuals */}
      <div
        className="relative hidden items-center justify-center p-8 lg:flex"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none'%3e%3ccircle cx='16' cy='16' r='1.5' fill='%2327272a'/%3e%3c/svg%3e")`,
        }}
      >
        <div className="w-full max-w-lg space-y-6 rounded-2xl border border-zinc-800 bg-black/50 p-6 shadow-2xl backdrop-blur-lg">
          <ChatBubble
            avatar="https://randomuser.me/api/portraits/men/32.jpg"
            name="Alex"
            time="9:41 AM"
            delay={1}
          >
            I have been trying to center a div for three hours.
          </ChatBubble>
          <ChatBubble
            avatar="https://randomuser.me/api/portraits/women/44.jpg"
            name="Brenda"
            time="9:42 AM"
            delay={3}
            isCode
          >
            {`div {\n  margin: 0 auto;\n}`}
          </ChatBubble>
          <ChatBubble
            avatar="https://randomuser.me/api/portraits/men/32.jpg"
            name="Alex"
            time="9:43 AM"
            delay={5}
          >
            Doesn't work. I'm losing my mind.
          </ChatBubble>
          <ChatBubble
            avatar="https://randomuser.me/api/portraits/women/44.jpg"
            name="Brenda"
            time="9:44 AM"
            delay={7}
          >
            ...did you try adding `display: block;`?
          </ChatBubble>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <MessageCircle className="mx-auto h-10 w-auto text-zinc-500" />
            <h2 className="mt-4 text-2xl font-medium tracking-tight">
              Sign In
            </h2>
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
                className="block w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-sm placeholder-zinc-500 transition-colors focus:border-zinc-400 focus:outline-none"
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
                className="mt-1 block w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-sm placeholder-zinc-500 transition-colors focus:border-zinc-400 focus:outline-none"
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
              className="w-full flex justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50"
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
              <span className="bg-black px-2 text-zinc-500">
                Or continue with
              </span>
            </div>
          </div>

          <div>
            <button
              onClick={() => handleGoogleLogin()}
              className="w-full flex items-center justify-center rounded-md border border-zinc-800 bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:ring-offset-2 focus:ring-offset-black"
            >
              <GoogleIcon className="h-4 w-4 mr-2" />
              Sign in with Google
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-white hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;

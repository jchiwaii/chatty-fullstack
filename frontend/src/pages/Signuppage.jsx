import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { useAuth } from "../store/useAuth";
import toast from "react-hot-toast";

// You can create a reusable icon component for social logins
const GitHubIcon = () => (
  <svg
    className="h-5 w-5 mr-2"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.65.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z"
      clipRule="evenodd"
    />
  </svg>
);

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

const SignupPage = () => {
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
            avatar="https://randomuser.me/api/portraits/women/21.jpg"
            name="Elena"
            time="2:30 PM"
            delay={1}
          >
            Hey team, I'm stuck on this React hook. Any ideas?
          </ChatBubble>
          <ChatBubble
            avatar="https://randomuser.me/api/portraits/men/12.jpg"
            name="David"
            time="2:31 PM"
            delay={3}
            isCode
          >
            {`useEffect(() => {\n  // your logic here\n}, [dependencies]);`}
          </ChatBubble>
          <ChatBubble
            avatar="https://randomuser.me/api/portraits/women/25.jpg"
            name="Maria"
            time="2:32 PM"
            delay={5}
          >
            Make sure your dependency array is correct! That usually gets me.
          </ChatBubble>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <MessageSquare className="mx-auto h-10 w-auto text-zinc-500" />
            <h2 className="mt-4 text-2xl font-medium tracking-tight">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Join the conversation and start collaborating.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="First Name"
                required
                className="w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-sm placeholder-zinc-500 transition-colors focus:border-zinc-400 focus:outline-none"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Last Name"
                required
                className="w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-sm placeholder-zinc-500 transition-colors focus:border-zinc-400 focus:outline-none"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
            <input
              type="text"
              placeholder="Username"
              required
              className="block w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-sm placeholder-zinc-500 transition-colors focus:border-zinc-400 focus:outline-none"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              required
              className="block w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-sm placeholder-zinc-500 transition-colors focus:border-zinc-400 focus:outline-none"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="block w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-sm placeholder-zinc-500 transition-colors focus:border-zinc-400 focus:outline-none"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <button
              type="submit"
              disabled={isSigningup}
              className="w-full rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50"
            >
              {isSigningup ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-black px-2 text-zinc-500">Or</span>
            </div>
          </div>

          <button className="flex w-full items-center justify-center rounded-md border border-zinc-800 bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:ring-offset-2 focus:ring-offset-black">
            <GitHubIcon />
            Continue with GitHub
          </button>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-white hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

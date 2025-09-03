import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { useGoogleLogin } from "@react-oauth/google";
import { MessageCircle, Eye, EyeOff } from "lucide-react";
import GoogleIcon from "../components/GoogleIcon";
import toast from "react-hot-toast";

// Floating animation component
const FloatingElement = ({ children, delay = 0, className = "" }) => (
  <div
    className={`animate-float ${className}`}
    style={{
      animationDelay: `${delay}s`,
      animationDuration: "6s",
      animationIterationCount: "infinite",
    }}
  >
    {children}
  </div>
);

// Enhanced Chat Bubble Component
const ChatBubble = ({ avatar, name, time, isCode, children, delay }) => (
  <div
    className="flex items-start gap-3 opacity-0 animate-fade-in-up"
    style={{
      animationDelay: `${delay * 200}ms`,
      animationFillMode: "forwards",
    }}
  >
    <div className="relative">
      <img
        src={avatar}
        alt={name}
        className="h-10 w-10 rounded-full object-cover ring-2 ring-zinc-800"
        onError={(e) => {
          e.target.src = `https://ui-avatars.com/api/?name=${name}&background=18181b&color=ffffff&size=40`;
        }}
      />
      <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 ring-2 ring-black"></div>
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-sm font-semibold text-white">{name}</span>
        <span className="text-xs text-zinc-500">{time}</span>
      </div>
      {isCode ? (
        <div className="rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-800 p-3 font-mono text-xs border border-zinc-700">
          <pre className="text-zinc-200">
            <code>{children}</code>
          </pre>
        </div>
      ) : (
        <div className="bg-zinc-800/50 rounded-lg px-3 py-2 backdrop-blur-sm border border-zinc-700/50">
          <p className="text-sm text-zinc-200">{children}</p>
        </div>
      )}
    </div>
  </div>
);

const Loginpage = () => {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);

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
      // The login function in the auth store is expected to show a toast on error.
      console.error("Login error:", error);
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
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black font-sans text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Column: Form */}
        <div className="flex items-center justify-center p-6 sm:p-12 relative">
          {/* Floating background elements */}
          <FloatingElement
            delay={0}
            className="absolute top-20 left-10 w-2 h-2 bg-blue-500/20 rounded-full blur-sm"
          />
          <FloatingElement
            delay={2}
            className="absolute top-40 right-20 w-3 h-3 bg-purple-500/20 rounded-full blur-sm"
          />
          <FloatingElement
            delay={4}
            className="absolute bottom-32 left-16 w-1 h-1 bg-green-500/20 rounded-full blur-sm"
          />

          <div className="w-full max-w-md space-y-8 relative z-10">
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
                <MessageCircle className="relative mx-auto h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                  Welcome back
                </h1>
                <p className="mt-2 text-zinc-400">
                  Sign in to continue your conversation
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-zinc-300 mb-2"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="block w-full rounded-xl border border-zinc-700/50 bg-zinc-900/50 backdrop-blur-sm px-4 py-3 text-white placeholder-zinc-500 transition-all duration-200 focus:border-blue-500/50 focus:bg-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-zinc-300"
                    >
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="block w-full rounded-xl border border-zinc-700/50 bg-zinc-900/50 backdrop-blur-sm px-4 py-3 pr-12 text-white placeholder-zinc-500 transition-all duration-200 focus:border-blue-500/50 focus:bg-zinc-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-400 hover:text-white transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                disabled={isLoggingin}
              >
                {isLoggingin ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-700/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gradient-to-br from-black via-zinc-900 to-black px-4 text-zinc-500">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              onClick={() => handleGoogleLogin()}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-zinc-700/50 bg-zinc-900/30 backdrop-blur-sm px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-zinc-800/50 hover:border-zinc-600/50 focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:ring-offset-2 focus:ring-offset-black"
            >
              <GoogleIcon className="h-5 w-5" />
              Continue with Google
            </button>

            <p className="text-center text-sm text-zinc-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Right Column: Enhanced Visuals */}
        <div className="relative hidden items-center justify-center p-8 lg:flex overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-green-500/5"></div>

          {/* Floating particles */}
          <FloatingElement
            delay={0}
            className="absolute top-20 left-20 w-1 h-1 bg-blue-400/40 rounded-full"
          />
          <FloatingElement
            delay={1}
            className="absolute top-40 right-32 w-2 h-2 bg-purple-400/30 rounded-full"
          />
          <FloatingElement
            delay={2}
            className="absolute bottom-40 left-32 w-1 h-1 bg-green-400/40 rounded-full"
          />
          <FloatingElement
            delay={3}
            className="absolute top-60 left-40 w-1 h-1 bg-yellow-400/30 rounded-full"
          />

          {/* Chat interface mockup */}
          <div className="w-full max-w-lg space-y-6 rounded-2xl border border-zinc-800/50 bg-black/30 backdrop-blur-xl p-8 shadow-2xl relative z-10">
            <div className="flex items-center gap-3 pb-4 border-b border-zinc-800/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
              </div>
              <span className="text-zinc-400 text-sm ml-4">Developer Chat</span>
            </div>

            <div className="space-y-4">
              <ChatBubble
                avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                name="Alex"
                time="2:41 PM"
                delay={1}
              >
                Anyone know why my CSS grid isn't working? 😅
              </ChatBubble>
              <ChatBubble
                avatar="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
                name="Sarah"
                time="2:42 PM"
                delay={2}
                isCode
              >
                {`display: grid;\ngrid-template-columns: repeat(3, 1fr);\ngap: 1rem;`}
              </ChatBubble>
              <ChatBubble
                avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                name="Alex"
                time="2:43 PM"
                delay={3}
              >
                Perfect! That fixed it. Thanks! 🎉
              </ChatBubble>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;

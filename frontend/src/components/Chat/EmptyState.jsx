import React from "react";
import { MessageSquare, Send, Smile, Zap, Users, Shield } from "lucide-react";
import { motion } from "framer-motion";

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-start gap-4 p-4 rounded-xl bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50 hover:bg-white/80 dark:hover:bg-zinc-800/80 transition-all duration-300"
  >
    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
        {title}
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  </motion.div>
);

const FloatingElement = ({ children, delay = 0, className = "" }) => (
  <motion.div
    className={`absolute ${className}`}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration: 6,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
);

const EmptyState = () => {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-white via-zinc-50/50 to-white dark:from-zinc-900 dark:via-black/50 dark:to-zinc-900 relative overflow-hidden">
      {/* Floating background elements */}
      <FloatingElement
        delay={0}
        className="top-20 left-20 w-2 h-2 bg-blue-400/30 rounded-full blur-sm"
      />
      <FloatingElement
        delay={2}
        className="top-40 right-32 w-3 h-3 bg-purple-400/20 rounded-full blur-sm"
      />
      <FloatingElement
        delay={4}
        className="bottom-40 left-32 w-1 h-1 bg-green-400/40 rounded-full blur-sm"
      />
      <FloatingElement
        delay={1}
        className="top-60 right-20 w-2 h-2 bg-pink-400/25 rounded-full blur-sm"
      />

      <div className="text-center max-w-2xl px-8 relative z-10">
        {/* Main Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl scale-150"></div>
            <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
              <MessageSquare className="w-12 h-12 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
            Welcome to Chatty
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg mx-auto">
            Your conversations await. Select a chat from the sidebar to start
            messaging, or discover new connections.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <FeatureCard
            icon={Zap}
            title="Lightning Fast"
            description="Real-time messaging with instant delivery"
            delay={0.4}
          />
          <FeatureCard
            icon={Shield}
            title="Secure & Private"
            description="End-to-end encryption for your peace of mind"
            delay={0.5}
          />
          <FeatureCard
            icon={Smile}
            title="Rich Media"
            description="Share images, emojis, and express yourself"
            delay={0.6}
          />
          <FeatureCard
            icon={Users}
            title="Stay Connected"
            description="See who's online and never miss a message"
            delay={0.7}
          />
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-12"
        >
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            Ready to start chatting?
          </p>
          <div className="flex items-center justify-center gap-2 text-zinc-400 dark:text-zinc-500">
            <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
            <span className="text-sm">Select a conversation to begin</span>
            <div
              className="w-2 h-2 bg-current rounded-full animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmptyState;

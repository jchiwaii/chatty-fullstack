import React from "react";
import { useAuth } from "../store/useAuth";
import {
  LogOut,
  User,
  Settings,
  Sun,
  Globe,
  Users,
  MessagesSquare,
  BookUser,
  Bot, // Using Bot icon for the logo
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

// NavLink with Vercel-style aesthetics
const NavLink = ({ to, icon: Icon, text }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className="group relative flex justify-center">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-lg transition-colors duration-200
        ${
          isActive
            ? "bg-zinc-900 text-white" // Subtle active state
            : "text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white" // Clean hover state
        }`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div
        className="absolute left-full ml-4 hidden whitespace-nowrap rounded-md border
                   border-zinc-800 bg-black px-2 py-1 text-sm font-medium
                   text-white group-hover:block"
      >
        {text}
      </div>
    </Link>
  );
};

// NavButton with consistent Vercel-style aesthetics
const NavButton = ({ onClick, icon: Icon, text }) => {
  return (
    <button onClick={onClick} className="group relative flex justify-center">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-lg text-zinc-400 transition-colors
                   duration-200 group-hover:bg-zinc-900 group-hover:text-white"
      >
        <Icon className="h-6 w-6" />
      </div>
      <div
        className="absolute left-full ml-4 hidden whitespace-nowrap rounded-md border
                   border-zinc-800 bg-black px-2 py-1 text-sm font-medium
                   text-white group-hover:block"
      >
        {text}
      </div>
    </button>
  );
};

const Navbar = () => {
  const { authUser, logout } = useAuth();

  return (
    <nav className="fixed left-0 top-0 z-50 flex h-screen w-20 flex-col items-center bg-black py-4">
      {/* Logo */}
      <Link
        to="/"
        className="flex h-12 w-12 items-center justify-center rounded-lg transition-colors hover:bg-zinc-900"
      >
        <Bot className="h-7 w-7 text-white" />
      </Link>

      {/* Main navigation links (centered) */}
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <NavLink to="/profile" icon={User} text="Profile" />
        <NavLink to="/" icon={MessagesSquare} text="Chats" />
        <NavLink to="/groups" icon={Users} text="Groups" />
        <NavLink to="/contacts" icon={BookUser} text="Contacts" />
        <NavLink to="/settings" icon={Settings} text="Settings" />
      </div>

      {/* Bottom section with actions and user info */}
      <div className="flex flex-col items-center gap-4">
        <NavButton
          onClick={() => {
            /* Add language logic */
          }}
          icon={Globe}
          text="Change Language"
        />
        <NavButton
          onClick={() => {
            /* Add theme logic */
          }}
          icon={Sun}
          text="Toggle Theme"
        />

        {/* Divider */}
        <div className="my-2 h-px w-10 bg-zinc-800"></div>

        {/* User Avatar & Logout */}
        <div className="group relative">
          <img
            src={authUser?.profilePicture || "/avatar.png"}
            alt="User avatar"
            className="h-11 w-11 rounded-full object-cover"
            onError={(e) => {
              e.target.src = "https://placehold.co/44x44/18181b/ffffff?text=U";
            }}
          />
          <button
            onClick={logout}
            className="absolute left-full ml-4 hidden whitespace-nowrap rounded-md border
                       border-zinc-800 bg-black px-3 py-2 text-sm font-medium
                       text-white group-hover:flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

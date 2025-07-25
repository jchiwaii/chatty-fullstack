import React from "react";
import { useAuth } from "../store/useAuth";
import { LogOut, MessageSquare, User, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { authUser, logout } = useAuth();

  return (
    <header className="bg-black border-b border-zinc-800 fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-white hover:opacity-80 transition-opacity"
        >
          <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-zinc-400" />
          </div>
          <h1 className="text-lg font-semibold">Chatty</h1>
        </Link>

        {authUser && (
          <div className="flex items-center gap-4 text-sm font-medium text-zinc-400">
            <Link
              to="/settings"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

import React, { useState } from "react";
import { useAuth } from "../../store/useAuth";
import {
  MessageSquare,
  Users,
  Settings,
  User,
  LogOut,
  Search,
  Plus,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { authUser, logout } = useAuth();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = [
    { name: "Chats", href: "/", icon: MessageSquare },
    { name: "Contacts", href: "/contacts", icon: Users },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div className="h-full flex flex-col bg-gray-50 border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Chatty</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* New Chat Button */}
        <button className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <img
            src={authUser?.profilePicture || "/avatar.png"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              e.target.src = "https://placehold.co/40x40/f3f4f6/6b7280?text=U";
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {authUser?.username || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {authUser?.email || "user@example.com"}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

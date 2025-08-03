import React, {
  useState,
  createContext,
  useContext,
  useRef,
  useEffect,
} from "react";
import { useAuth } from "../../store/useAuth";
import {
  MessageSquare,
  Users,
  Settings,
  User,
  LogOut,
  UserPlus,
  Globe,
  Moon,
  Sun,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

// Context for sidebar state
const SidebarContext = createContext(undefined);

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// Utility function for class names
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

// User Avatar Dropdown Modal Component
const UserDropdown = ({ isOpen, onClose, position = "top" }) => {
  const { authUser, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState("EN");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleTheme = () => {
    setIsDark(!isDark);
    // Add your theme toggle logic here
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "absolute bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-56 py-2",
        position === "top"
          ? "bottom-full mb-2 left-full ml-2"
          : "bottom-full mb-2 right-0"
      )}
    >
      {/* User Info Section */}
      <div className="px-4 py-3 border-b border-gray-100">
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
        </div>
      </div>

      {/* Main Menu Items */}
      <div className="py-1">
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <User className="w-4 h-4" />
          Profile
        </Link>

        <Link
          to="/settings"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 my-1"></div>

      {/* Theme and Language Controls */}
      <div className="py-1">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
            {isDark ? "Light Mode" : "Dark Mode"}
          </div>
        </button>

        <button className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4" />
            Language
          </div>
          <span className="text-xs text-gray-500">{language}</span>
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 my-1"></div>

      {/* Logout */}
      <div className="py-1">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

// Sidebar Provider
const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Tooltip Component
const Tooltip = ({ children, text }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap z-50 hidden md:block">
          {text}
          <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
        </div>
      )}
    </div>
  );
};

// Desktop Sidebar Component
const DesktopSidebar = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "h-full px-3 py-4 hidden md:flex md:flex-col bg-white border-r border-gray-100 shrink-0 w-16",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Mobile Bottom Navigation Component
const MobileBottomNav = ({ children }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 z-50">
      <div className="flex items-center justify-around">{children}</div>
    </div>
  );
};

// Sidebar Body Component
const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileBottomNav {...props} />
    </>
  );
};

// Icon Link Component
const IconLink = ({ link, className, isActive, ...props }) => {
  return (
    <Tooltip text={link.label}>
      <Link
        to={link.href}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 group",
          isActive
            ? "bg-black text-white"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
          className
        )}
        {...props}
      >
        <link.icon className="w-5 h-5" />
      </Link>
    </Tooltip>
  );
};

// Theme Toggle Component
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    // Add your theme toggle logic here
  };

  return (
    <Tooltip text={isDark ? "Light Mode" : "Dark Mode"}>
      <button
        onClick={toggleTheme}
        className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </Tooltip>
  );
};

// Language Toggle Component
const LanguageToggle = () => {
  return (
    <Tooltip text="Change Language">
      <button className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200">
        <Globe className="w-5 h-5" />
      </button>
    </Tooltip>
  );
};

// User Profile Component with Dropdown
const UserProfile = () => {
  const { authUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-all duration-200"
      >
        <img
          src={authUser?.profilePicture || "/avatar.png"}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {
            e.target.src = "https://placehold.co/32x32/f3f4f6/6b7280?text=U";
          }}
        />
      </button>

      <UserDropdown
        isOpen={dropdownOpen}
        onClose={() => setDropdownOpen(false)}
        position="top"
      />
    </div>
  );
};

// Mobile User Profile Component (simplified for bottom nav)
const MobileUserProfile = () => {
  const { authUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-all duration-200"
      >
        <img
          src={authUser?.profilePicture || "/avatar.png"}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {
            e.target.src = "https://placehold.co/32x32/f3f4f6/6b7280?text=U";
          }}
        />
      </button>

      <UserDropdown
        isOpen={dropdownOpen}
        onClose={() => setDropdownOpen(false)}
        position="bottom"
      />
    </div>
  );
};

// Main Sidebar Component
// Main Sidebar Component
const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const navigation = [
    { label: "Chats", href: "/", icon: MessageSquare },
    { label: "Groups", href: "/groups", icon: Users },
    { label: "Contacts", href: "/contacts", icon: UserPlus },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={false}>
      <SidebarBody className="justify-between">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:flex-col md:h-full w-full">
          {/* Logo Section - Top */}
          <div className="flex flex-col items-center pt-4">
            <Tooltip text="Chatty">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </Tooltip>
          </div>

          {/* Top Navigation Icons: Profile, Chats, Groups, Contacts, Settings */}
          <div className="mt-32 flex flex-col items-center space-y-6">
            <IconLink
              link={{ label: "Profile", href: "/profile", icon: User }}
              isActive={isActive("/profile")}
            />
            {navigation.slice(0, 3).map((item) => (
              <IconLink
                key={item.label}
                link={item}
                isActive={isActive(item.href)}
              />
            ))}
            <IconLink
              link={navigation.find((item) => item.label === "Settings")}
              isActive={isActive("/settings")}
            />
          </div>

          {/* Push bottom section down */}
          <div className="flex-1" />

          {/* Bottom Section: Language, Theme, Avatar */}
          <div className=" mt-32 flex flex-col items-center space-y-4 pb-4">
            <LanguageToggle />
            <ThemeToggle />
            <UserProfile />
          </div>
        </div>

        {/* Mobile Bottom Navigation (No changes here) */}
        <div className="md:hidden flex items-center justify-between w-full px-2">
          {/* Main Navigation Icons */}
          <div className="flex items-center space-x-4">
            {navigation.slice(0, 3).map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200",
                  isActive(item.href)
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className="w-5 h-5" />
              </Link>
            ))}

            {/* Settings */}
            <Link
              to="/settings"
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200",
                isActive("/settings")
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>

          {/* User Controls */}
          <div className="flex items-center space-x-3">
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200">
              <Globe className="w-4 h-4" />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200">
              <Moon className="w-4 h-4" />
            </button>
            <MobileUserProfile />
          </div>
        </div>
      </SidebarBody>
    </SidebarProvider>
  );
};

export default Sidebar;

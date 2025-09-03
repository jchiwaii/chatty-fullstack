import React, {
  useState,
  createContext,
  useContext,
  useRef,
  useEffect,
} from "react";
import { useAuth } from "../../store/useAuth";
import { useLayout } from "../../store/useLayout.jsx";
import { useTheme } from "../../hooks/useTheme";
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
  Monitor,
} from "lucide-react";
import { Link } from "react-router-dom";

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
  const { setActivePanel } = useLayout();
  const { theme, setTheme } = useTheme();

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

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "absolute bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded shadow-lg z-50 w-48 py-2",
        position === "top"
          ? "bottom-full mb-2 left-full ml-2"
          : "bottom-full mb-2 right-0"
      )}
    >
      {/* User Info Section */}
      <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <img
            src={authUser?.profilePicture || "/avatar.png"}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${
                authUser?.username || "U"
              }&background=000000&color=ffffff&size=32`;
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-small text-black dark:text-white font-medium truncate">
              {authUser?.username || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {authUser?.email || "user@example.com"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Menu Items */}
      <div className="py-1">
        <button
          onClick={() => {
            setActivePanel("profile");
            onClose();
          }}
          className="flex items-center gap-3 w-full px-3 py-2 text-body text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-left"
        >
          <User className="w-4 h-4" />
          Profile
        </button>

        <button
          onClick={() => {
            setActivePanel("settings");
            onClose();
          }}
          className="flex items-center gap-3 w-full px-3 py-2 text-body text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-left"
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-800 my-1"></div>

      {/* Theme Control */}
      <div className="py-1">
        <button
          onClick={cycleTheme}
          className="flex items-center gap-3 w-full px-3 py-2 text-body text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
        >
          {theme === "light" && <Sun className="w-4 h-4" />}
          {theme === "dark" && <Moon className="w-4 h-4" />}
          {theme === "system" && <Monitor className="w-4 h-4" />}
          <span>Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-800 my-1"></div>

      {/* Logout */}
      <div className="py-1">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-body text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
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
        "h-full px-3 py-6 hidden md:flex md:flex-col bg-white border-r border-gray-200 shrink-0 w-16 dark:bg-black dark:border-gray-800",
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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50 dark:bg-black dark:border-gray-800">
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
const IconLink = ({ link, className, isActive, panelKey, ...props }) => {
  const { setActivePanel } = useLayout();

  const handleClick = (e) => {
    if (panelKey) {
      e.preventDefault();
      setActivePanel(panelKey);
    }
  };

  return (
    <Tooltip text={link.label}>
      <Link
        to={link.href}
        onClick={handleClick}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-md transition-all duration-200 group",
          isActive
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100",
          className
        )}
        {...props}
      >
        <link.icon className="w-4 h-4" />
      </Link>
    </Tooltip>
  );
};

// Theme Toggle Component
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const themeIcon =
    theme === "light" ? (
      <Sun className="w-4 h-4" />
    ) : theme === "dark" ? (
      <Moon className="w-4 h-4" />
    ) : (
      <Monitor className="w-4 h-4" />
    );

  const themeTooltip = `Theme: ${
    theme.charAt(0).toUpperCase() + theme.slice(1)
  }`;

  return (
    <Tooltip text={themeTooltip}>
      <button
        onClick={cycleTheme}
        className="flex items-center justify-center w-10 h-10 rounded-md text-gray-500 hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white transition-all duration-200"
      >
        {themeIcon}
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
  const { activePanel, setActivePanel } = useLayout();

  const navigation = [
    { label: "Chats", href: "/", icon: MessageSquare, panelKey: "chats" },
    { label: "Groups", href: "/groups", icon: Users, panelKey: "groups" },
    {
      label: "Contacts",
      href: "/contacts",
      icon: UserPlus,
      panelKey: "contacts",
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
      panelKey: "settings",
    },
  ];

  const isActive = (panelKey) => activePanel === panelKey;

  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={false}>
      <SidebarBody className="justify-between">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:flex-col md:h-full w-full">
          {/* Logo Section - Top */}
          <div className="flex flex-col items-center">
            <Tooltip text="Chatty">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-md flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white dark:text-black" />
              </div>
            </Tooltip>
          </div>

          {/* Top Navigation Icons: Profile, Chats, Groups, Contacts, Settings */}
          <div className="mt-8 flex flex-col items-center space-y-4">
            <IconLink
              link={{ label: "Profile", href: "/profile", icon: User }}
              panelKey="profile"
              isActive={isActive("profile")}
            />
            {navigation.slice(0, 3).map((item) => (
              <IconLink
                key={item.label}
                link={item}
                panelKey={item.panelKey}
                isActive={isActive(item.panelKey)}
              />
            ))}
            <IconLink
              link={navigation.find((item) => item.label === "Settings")}
              panelKey="settings"
              isActive={isActive("settings")}
            />
          </div>

          {/* Push bottom section down */}
          <div className="flex-1" />

          {/* Bottom Section: Language, Theme, Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <LanguageToggle />
            <ThemeToggle />
            <UserProfile />
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden flex items-center justify-between w-full px-4">
          {/* Profile Icon */}
          <button
            onClick={() => setActivePanel("profile")}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200",
              isActive("profile")
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <User className="w-5 h-5" />
          </button>

          {/* Main Navigation Icons */}
          {navigation.slice(0, 3).map((item) => (
            <button
              key={item.label}
              onClick={() => setActivePanel(item.panelKey)}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200",
                isActive(item.panelKey)
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="w-5 h-5" />
            </button>
          ))}

          {/* Settings */}
          <button
            onClick={() => setActivePanel("settings")}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200",
              isActive("settings")
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* User Avatar */}
          <MobileUserProfile />
        </div>
      </SidebarBody>
    </SidebarProvider>
  );
};

export default Sidebar;

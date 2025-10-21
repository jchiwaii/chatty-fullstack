import React, { useState } from "react";
import {
  Settings,
  User,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Bell,
  Moon,
  Globe,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../store/useAuth";
import { useTheme } from "../../hooks/useTheme";

const SettingsPanel = () => {
  const { authUser, logout, updateSettings } = useAuth();
  const { theme, setTheme } = useTheme();
  const [expandedSection, setExpandedSection] = useState(null);

  // Toggle states - initialize from authUser settings
  const [notifications, setNotifications] = useState(
    authUser?.settings?.notifications ?? true
  );
  const [readReceipts, setReadReceipts] = useState(
    authUser?.settings?.readReceipts ?? true
  );
  const [messageSound, setMessageSound] = useState(
    authUser?.settings?.messageSound ?? true
  );

  const toggleSection = (section) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  // Handler to save settings to backend
  const handleSettingChange = async (setting, value) => {
    try {
      await updateSettings({ [setting]: value });
    } catch (error) {
      console.error("Failed to update setting:", error);
    }
  };

  const handleNotificationChange = async (value) => {
    setNotifications(value);
    await handleSettingChange("notifications", value);
  };

  const handleReadReceiptsChange = async (value) => {
    setReadReceipts(value);
    await handleSettingChange("readReceipts", value);
  };

  const handleMessageSoundChange = async (value) => {
    setMessageSound(value);
    await handleSettingChange("messageSound", value);
  };

  const handleThemeChange = async (isDark) => {
    const newTheme = isDark ? "dark" : "light";
    console.log("Settings toggle:", isDark, "current theme:", theme);
    setTheme(newTheme);
    await handleSettingChange("theme", newTheme);
  };

  const ToggleSwitch = ({ value, onChange, label, description }) => (
    <div className="flex items-start justify-between py-3">
      <div className="flex-1">
        <span className="text-body text-black dark:text-white font-medium">
          {label}
        </span>
        {description && (
          <p className="text-small text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          value ? "bg-black dark:bg-white" : "bg-gray-300 dark:bg-gray-700"
        }`}
      >
        <span
          className={`inline-block h-3 w-3 transform rounded-full transition-transform ${
            value
              ? "translate-x-5 bg-white dark:bg-black"
              : "translate-x-1 bg-white dark:bg-gray-300"
          }`}
        />
      </button>
    </div>
  );

  const SettingSection = ({ icon: Icon, title, children, sectionKey }) => (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-body text-black dark:text-white font-medium">
            {title}
          </span>
        </div>
        {expandedSection === sectionKey ? (
          <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        )}
      </button>
      {expandedSection === sectionKey && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-800">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-black">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-h2 text-black dark:text-white">Settings</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Current theme: {theme}
        </p>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Account Section */}
        <SettingSection icon={User} title="Account" sectionKey="account">
          <div className="space-y-3 pt-3">
            <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800">
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
              <div>
                <p className="text-body text-black dark:text-white font-medium">
                  {authUser?.username || "User"}
                </p>
                <p className="text-small text-gray-500 dark:text-gray-400">
                  {authUser?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>
        </SettingSection>

        {/* Privacy Section */}
        <SettingSection icon={Shield} title="Privacy" sectionKey="privacy">
          <div className="space-y-1 pt-3">
            <ToggleSwitch
              value={readReceipts}
              onChange={handleReadReceiptsChange}
              label="Read Receipts"
              description="Let others know when you've read their messages"
            />
          </div>
        </SettingSection>

        {/* Notifications Section */}
        <SettingSection
          icon={Bell}
          title="Notifications"
          sectionKey="notifications"
        >
          <div className="space-y-1 pt-3">
            <ToggleSwitch
              value={notifications}
              onChange={handleNotificationChange}
              label="Push Notifications"
              description="Receive notifications for new messages"
            />
            <ToggleSwitch
              value={messageSound}
              onChange={handleMessageSoundChange}
              label="Message Sounds"
              description="Play sound when receiving new messages"
            />
          </div>
        </SettingSection>

        {/* Appearance Section */}
        <SettingSection icon={Moon} title="Appearance" sectionKey="appearance">
          <div className="space-y-1 pt-3">
            <ToggleSwitch
              value={theme === "dark"}
              onChange={handleThemeChange}
              label="Dark Mode"
              description="Use dark theme for the interface"
            />
          </div>
        </SettingSection>

        {/* Language Section */}
        <SettingSection icon={Globe} title="Language" sectionKey="language">
          <div className="pt-3">
            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800">
              <span className="text-body text-black dark:text-white">
                English
              </span>
              <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </SettingSection>

        {/* Help Section */}
        <SettingSection
          icon={HelpCircle}
          title="Help & Support"
          sectionKey="help"
        >
          <div className="space-y-2 pt-3">
            <button className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors">
              <span className="text-body text-black dark:text-white">FAQ</span>
            </button>
            <button className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors">
              <span className="text-body text-black dark:text-white">
                Contact Support
              </span>
            </button>
            <button className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors">
              <span className="text-body text-black dark:text-white">
                Privacy Policy
              </span>
            </button>
          </div>
        </SettingSection>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 p-3 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-body"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;

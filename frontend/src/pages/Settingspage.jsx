import React, { useState } from "react";
import MainLayout from "../components/Layout/MainLayout";
import { useAuth } from "../store/useAuth";
import { useTheme } from "../hooks/useTheme";
import { Bell, Shield, Moon, Volume2, Save } from "lucide-react";

const Settingspage = () => {
  const { authUser, updateSettings } = useAuth();
  const { theme, setTheme } = useTheme();

  // Initialize from authUser settings
  const [settings, setSettings] = useState({
    notifications: authUser?.settings?.notifications ?? true,
    readReceipts: authUser?.settings?.readReceipts ?? true,
    messageSound: authUser?.settings?.messageSound ?? true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings({ ...settings, theme });
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const ToggleSwitch = ({ value, onChange, label, description, icon: Icon }) => (
    <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex gap-3 flex-1">
        <div className="mt-1">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{label}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? "bg-black" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-full bg-gray-50 p-6">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            <p className="mt-2 text-gray-600">
              Manage your application preferences
            </p>
          </div>

          <div className="space-y-6">
            {/* Notifications */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Notifications
              </h2>
              <div className="space-y-3">
                <ToggleSwitch
                  value={settings.notifications}
                  onChange={() => handleToggle("notifications")}
                  label="Push Notifications"
                  description="Receive notifications for new messages"
                  icon={Bell}
                />
                <ToggleSwitch
                  value={settings.messageSound}
                  onChange={() => handleToggle("messageSound")}
                  label="Message Sounds"
                  description="Play sound when receiving new messages"
                  icon={Volume2}
                />
              </div>
            </div>

            {/* Privacy */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Privacy
              </h2>
              <ToggleSwitch
                value={settings.readReceipts}
                onChange={() => handleToggle("readReceipts")}
                label="Read Receipts"
                description="Let others know when you've read their messages"
                icon={Shield}
              />
            </div>

            {/* Appearance */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Appearance
              </h2>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex gap-3 mb-3">
                  <Moon className="w-5 h-5 text-gray-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Theme</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Choose your preferred color scheme
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleThemeChange("light")}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                      theme === "light"
                        ? "border-black bg-gray-100"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                      theme === "dark"
                        ? "border-black bg-gray-100"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => handleThemeChange("system")}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                      theme === "system"
                        ? "border-black bg-gray-100"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    System
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settingspage;

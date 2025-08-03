import React, { useState } from "react";
import {
  Settings,
  User,
  Bell,
  Shield,
  Moon,
  Globe,
  Smartphone,
  Volume2,
  Eye,
  Download,
} from "lucide-react";

const SettingsPanel = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [sounds, setSounds] = useState(true);

  const settingsCategories = [
    {
      title: "Account",
      icon: User,
      items: [
        {
          label: "Profile Settings",
          description: "Update your profile information",
        },
        {
          label: "Privacy",
          description: "Control who can see your information",
        },
        { label: "Security", description: "Password and security settings" },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        {
          label: "Push Notifications",
          description: "Receive notifications on this device",
          toggle: true,
          value: notifications,
          onChange: setNotifications,
        },
        {
          label: "Email Notifications",
          description: "Receive notifications via email",
        },
        {
          label: "Message Sounds",
          description: "Play sounds for new messages",
          toggle: true,
          value: sounds,
          onChange: setSounds,
        },
      ],
    },
    {
      title: "Appearance",
      icon: Eye,
      items: [
        {
          label: "Dark Mode",
          description: "Switch to dark theme",
          toggle: true,
          value: darkMode,
          onChange: setDarkMode,
        },
        { label: "Language", description: "Change app language" },
        { label: "Font Size", description: "Adjust text size" },
      ],
    },
    {
      title: "Advanced",
      icon: Settings,
      items: [
        { label: "Data Usage", description: "Monitor your data consumption" },
        { label: "Storage", description: "Manage app storage and cache" },
        { label: "Export Data", description: "Download your chat history" },
      ],
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto">
        {settingsCategories.map((category, index) => (
          <div key={index} className="border-b border-gray-100 last:border-b-0">
            {/* Category Header */}
            <div className="p-4 bg-gray-50">
              <div className="flex items-center gap-3">
                <category.icon className="w-5 h-5 text-gray-600" />
                <h3 className="font-medium text-gray-900">{category.title}</h3>
              </div>
            </div>

            {/* Category Items */}
            <div className="divide-y divide-gray-50">
              {category.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {item.label}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                    </div>

                    {item.toggle ? (
                      <button
                        onClick={() => item.onChange(!item.value)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          item.value ? "bg-black" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            item.value ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    ) : (
                      <div className="text-gray-400">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button className="w-full p-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
          Help & Support
        </button>
        <button className="w-full p-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
          About Chatty
        </button>
        <button className="w-full p-3 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;

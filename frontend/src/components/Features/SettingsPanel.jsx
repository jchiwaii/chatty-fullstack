import React, { useState } from "react";
import {
  Settings,
  User,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Camera,
  Clock,
  Mail,
  Users,
  Lock,
  MessageSquare,
  FileText,
  Phone,
  Edit3,
  Globe,
  Check,
} from "lucide-react";
import { useAuth } from "../../store/useAuth";

const SettingsPanel = () => {
  const { authUser } = useAuth();
  const [expandedSection, setExpandedSection] = useState(null); // Only one section open at a time

  // Toggle states
  const [lastSeen, setLastSeen] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [securityNotifications, setSecurityNotifications] = useState(true);

  // Dropdown states
  const [profilePhotoDropdown, setProfilePhotoDropdown] = useState(false);
  const [groupPrivacyDropdown, setGroupPrivacyDropdown] = useState(false);
  const [profilePhotoSetting, setProfilePhotoSetting] = useState("Everyone");
  const [groupPrivacySetting, setGroupPrivacySetting] = useState("My Contacts");

  const toggleSection = (section) => {
    setExpandedSection((prev) => (prev === section ? null : section));
    // Close all dropdowns when switching sections
    setProfilePhotoDropdown(false);
    setGroupPrivacyDropdown(false);
  };

  const ToggleSwitch = ({ value, onChange, label, description }) => (
    <div className="flex items-start justify-between py-3">
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
          value ? "bg-black" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  const ExpandableSection = ({ title, icon: Icon, children, sectionKey }) => {
    const isExpanded = expandedSection === sectionKey;

    return (
      <div className="border-b border-gray-100 last:border-b-0">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <Icon className="w-4 h-4 text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          <div
            className={`transform transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </button>

        {isExpanded && (
          <div className="px-4 pb-6 bg-gradient-to-b from-gray-50 to-white">
            <div className="space-y-3 pt-2">{children}</div>
          </div>
        )}
      </div>
    );
  };

  const InfoCard = ({ icon: Icon, label, value, action }) => (
    <div className="bg-white rounded-xl p-4 border border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <Icon className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {label}
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{value}</p>
          </div>
        </div>
        {action && (
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Edit3 className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );

  const DropdownSelector = ({
    isOpen,
    setIsOpen,
    currentValue,
    setValue,
    options,
    label,
    description,
    icon: Icon,
  }) => (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
          <Icon className="w-4 h-4 text-gray-600" />
        </div>
        <div className="flex-1">
          <span className="text-sm font-medium text-gray-900">{label}</span>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>

      <div className="relative ml-11">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors flex items-center justify-between"
        >
          <span className="text-sm text-gray-700">{currentValue}</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg z-10">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setValue(option);
                  setIsOpen(false);
                }}
                className="w-full text-left p-3 hover:bg-gray-50 transition-colors flex items-center justify-between first:rounded-t-lg last:rounded-b-lg"
              >
                <span className="text-sm text-gray-700">{option}</span>
                {currentValue === option && (
                  <Check className="w-4 h-4 text-gray-600" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const ActionButton = ({
    icon: Icon,
    label,
    description,
    onClick,
    variant = "default",
  }) => (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl transition-all ${
        variant === "danger"
          ? "bg-red-50 hover:bg-red-100 border border-red-100"
          : "bg-white hover:bg-gray-50 border border-gray-100"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            variant === "danger" ? "bg-red-100" : "bg-gray-100"
          }`}
        >
          <Icon
            className={`w-4 h-4 ${
              variant === "danger" ? "text-red-600" : "text-gray-600"
            }`}
          />
        </div>
        <div>
          <span
            className={`text-sm font-medium ${
              variant === "danger" ? "text-red-900" : "text-gray-900"
            }`}
          >
            {label}
          </span>
          {description && (
            <p
              className={`text-xs mt-1 ${
                variant === "danger" ? "text-red-600" : "text-gray-500"
              }`}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </button>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Enhanced Header with User Profile */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <img
              src={authUser?.profilePicture || "/avatar.png"}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/80x80/f3f4f6/6b7280?text=U";
              }}
            />
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {authUser?.username || "User"}
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              {authUser?.email || "user@example.com"}
            </p>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Personal Info Section */}
        <ExpandableSection
          title="Personal Info"
          icon={User}
          sectionKey="personalInfo"
        >
          <div className="space-y-1">
            <div className="p-3 hover:bg-gray-50 transition-colors rounded-lg flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Name
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {authUser?.username || "Patricia Smith"}
                </p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Edit3 className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="p-3 hover:bg-gray-50 transition-colors rounded-lg flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Email
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {authUser?.email || "adc@123.com"}
                </p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Edit3 className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="p-3 hover:bg-gray-50 transition-colors rounded-lg">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Local Time
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
            </div>
          </div>
        </ExpandableSection>

        {/* Privacy Section */}
        <ExpandableSection title="Privacy" icon={Shield} sectionKey="privacy">
          <div className="space-y-1">
            {/* Profile Photo Dropdown */}
            <div className="p-3 hover:bg-gray-50 transition-colors rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">
                    Profile Photo
                  </span>
                </div>
                <div className="relative flex justify-center align-center">
                  <button
                    onClick={() =>
                      setProfilePhotoDropdown(!profilePhotoDropdown)
                    }
                    className="text-left p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors flex items-center gap-2 min-w-[120px]"
                  >
                    <span className="text-sm text-gray-700">
                      {profilePhotoSetting}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        profilePhotoDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {profilePhotoDropdown && (
                    <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg z-10 min-w-[120px]">
                      {["Everyone", "My Contacts", "Nobody"].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setProfilePhotoSetting(option);
                            setProfilePhotoDropdown(false);
                          }}
                          className="w-full text-left p-3 hover:bg-gray-50 transition-colors flex items-center justify-between first:rounded-t-lg last:rounded-b-lg"
                        >
                          <span className="text-sm text-gray-700">
                            {option}
                          </span>
                          {profilePhotoSetting === option && (
                            <Check className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Last Seen Toggle */}
            <div className="p-3 hover:bg-gray-50 transition-colors rounded-lg">
              <ToggleSwitch
                value={lastSeen}
                onChange={setLastSeen}
                label="Last Seen"
                description="Show when you were last online"
              />
            </div>

            {/* Read Receipts Toggle */}
            <div className="p-3 hover:bg-gray-50 transition-colors rounded-lg">
              <ToggleSwitch
                value={readReceipts}
                onChange={setReadReceipts}
                label="Read Receipts"
                description="Let others know when you've read their messages"
              />
            </div>

            {/* Groups Dropdown */}
            <div className="p-3 hover:bg-gray-50 transition-colors rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">
                    Groups
                  </span>
                </div>
                <div className="relative">
                  <button
                    onClick={() =>
                      setGroupPrivacyDropdown(!groupPrivacyDropdown)
                    }
                    className="text-left p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors flex items-center gap-2 min-w-[120px]"
                  >
                    <span className="text-sm text-gray-700">
                      {groupPrivacySetting}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        groupPrivacyDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {groupPrivacyDropdown && (
                    <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg z-10 min-w-[120px]">
                      {["Everyone", "My Contacts", "Nobody"].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setGroupPrivacySetting(option);
                            setGroupPrivacyDropdown(false);
                          }}
                          className="w-full text-left p-3 hover:bg-gray-50 transition-colors flex items-center justify-between first:rounded-t-lg last:rounded-b-lg"
                        >
                          <span className="text-sm text-gray-700">
                            {option}
                          </span>
                          {groupPrivacySetting === option && (
                            <Check className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ExpandableSection>

        {/* Security Section */}
        <ExpandableSection title="Security" icon={Lock} sectionKey="security">
          <div className="space-y-1">
            <div className="p-3 hover:bg-gray-50 transition-colors rounded-lg">
              <ToggleSwitch
                value={securityNotifications}
                onChange={setSecurityNotifications}
                label="Security Notifications"
                description="Get alerts about account security activities"
              />
            </div>
          </div>
        </ExpandableSection>

        {/* Help Section */}
        <ExpandableSection
          title="Help & Support"
          icon={HelpCircle}
          sectionKey="help"
        >
          <div className="space-y-1">
            <div className="p-3 hover:bg-gray-50 transition-colors rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-900">FAQs</span>
                <p className="text-xs text-gray-500 mt-1">
                  Find answers to common questions
                </p>
              </div>
            </div>

            <div className="p-3 hover:bg-gray-50 transition-colors rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Contact Support
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Get help from our support team
                </p>
              </div>
            </div>

            <div className="p-3 hover:bg-gray-50 transition-colors rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Terms & Privacy Policy
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  Read our terms of service and privacy policy
                </p>
              </div>
            </div>
          </div>
        </ExpandableSection>
      </div>
    </div>
  );
};

export default SettingsPanel;

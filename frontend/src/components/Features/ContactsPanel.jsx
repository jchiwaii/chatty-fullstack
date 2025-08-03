import React from "react";
import { UserPlus, Search, Users } from "lucide-react";

const ContactsPanel = () => {
  // Mock data for contacts
  const contacts = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      status: "online",
      avatar: null,
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      status: "offline",
      avatar: null,
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol@example.com",
      status: "online",
      avatar: null,
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david@example.com",
      status: "away",
      avatar: null,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Contacts</h2>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <UserPlus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Users className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">No contacts found</p>
            <p className="text-sm">Add some contacts to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Contact Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {contact.name.charAt(0)}
                      </span>
                    </div>
                    {/* Status indicator */}
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(
                        contact.status
                      )} rounded-full border-2 border-white`}
                    ></div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">
                        {contact.name}
                      </h3>
                      <span className="text-xs text-gray-500 capitalize">
                        {contact.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {contact.email}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Contact Button */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-center gap-2 p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          <UserPlus className="w-4 h-4" />
          Add New Contact
        </button>
      </div>
    </div>
  );
};

export default ContactsPanel;

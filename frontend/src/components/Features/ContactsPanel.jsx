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

  return (
    <div className="h-full flex flex-col bg-white dark:bg-black">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-h2 text-black dark:text-white">Contacts</h2>
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors">
            <UserPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white transition-all duration-200 text-body"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <Users className="w-8 h-8 mb-3" />
            <p className="text-body text-black dark:text-white">
              No contacts found
            </p>
            <p className="text-small text-gray-500 dark:text-gray-400">
              Add contacts to get started
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Contact Avatar */}
                  <div className="relative">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 text-small font-medium">
                        {contact.name.charAt(0)}
                      </span>
                    </div>
                    {/* Status indicator */}
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 ${
                        contact.status === "online"
                          ? "bg-black dark:bg-white"
                          : "bg-gray-400"
                      } rounded-full`}
                    ></div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-body text-black dark:text-white font-medium truncate">
                        {contact.name}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {contact.status}
                      </span>
                    </div>
                    <p className="text-small text-gray-600 dark:text-gray-300 truncate">
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
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button className="w-full flex items-center justify-center gap-2 p-3 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-body">
          <UserPlus className="w-4 h-4" />
          Add Contact
        </button>
      </div>
    </div>
  );
};

export default ContactsPanel;

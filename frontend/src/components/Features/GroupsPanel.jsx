import React from "react";
import { Users, Plus, Search } from "lucide-react";

const GroupsPanel = () => {
  // Mock data for groups
  const groups = [
    {
      id: 1,
      name: "Design Team",
      members: 12,
      avatar: null,
      lastActivity: "2m",
    },
    {
      id: 2,
      name: "Dev Team",
      members: 8,
      avatar: null,
      lastActivity: "5m",
    },
    {
      id: 3,
      name: "Marketing",
      members: 15,
      avatar: null,
      lastActivity: "1h",
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-black">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-h2 text-black dark:text-white">Groups</h2>
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors">
            <Plus className="w-4 h-4" />
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

      {/* Groups List */}
      <div className="flex-1 overflow-y-auto">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <Users className="w-8 h-8 mb-3" />
            <p className="text-body text-black dark:text-white">
              No groups found
            </p>
            <p className="text-small text-gray-500 dark:text-gray-400">
              Create or join groups
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {groups.map((group) => (
              <div
                key={group.id}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Group Avatar */}
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </div>

                  {/* Group Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-body text-black dark:text-white font-medium truncate">
                        {group.name}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {group.lastActivity}
                      </span>
                    </div>
                    <p className="text-small text-gray-600 dark:text-gray-300">
                      {group.members} members
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Group Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button className="w-full flex items-center justify-center gap-2 p-3 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-body">
          <Plus className="w-4 h-4" />
          Create Group
        </button>
      </div>
    </div>
  );
};

export default GroupsPanel;

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
      lastActivity: "2 min ago",
    },
    {
      id: 2,
      name: "Dev Team",
      members: 8,
      avatar: null,
      lastActivity: "5 min ago",
    },
    {
      id: 3,
      name: "Marketing",
      members: 15,
      avatar: null,
      lastActivity: "1 hour ago",
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Groups</h2>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search groups..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      {/* Groups List */}
      <div className="flex-1 overflow-y-auto">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Users className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">No groups found</p>
            <p className="text-sm">Create or join a group to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {groups.map((group) => (
              <div
                key={group.id}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Group Avatar */}
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-600" />
                  </div>

                  {/* Group Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">
                        {group.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {group.lastActivity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
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
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-center gap-2 p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          <Plus className="w-4 h-4" />
          Create New Group
        </button>
      </div>
    </div>
  );
};

export default GroupsPanel;

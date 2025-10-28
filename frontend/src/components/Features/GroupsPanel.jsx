import React, { useState, useEffect } from "react";
import { Users, Plus, Search, X, Loader2 } from "lucide-react";
import { useGroup } from "../../store/useGroup";
import { useContact } from "../../store/useContact";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const CreateGroupModal = ({ isOpen, onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { contacts, fetchContacts } = useContact();
  const { createGroup } = useGroup();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchContacts();
    }
  }, [isOpen, fetchContacts]);

  const filteredContacts = contacts.filter((contact) =>
    contact.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMember = (contactId) => {
    setSelectedMembers((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      toast.error("Group name is required");
      return;
    }
    if (selectedMembers.length === 0) {
      toast.error("Please select at least one member");
      return;
    }

    setIsCreating(true);
    try {
      await createGroup({
        name: groupName.trim(),
        description: groupDescription.trim(),
        members: selectedMembers,
      });
      setGroupName("");
      setGroupDescription("");
      setSelectedMembers([]);
      onClose();
    } catch (error) {
      console.error("Error creating group:", error);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-h2 text-black dark:text-white">Create Group</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleCreateGroup} className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Group Name */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Group Name *
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                placeholder="Enter group name"
                autoFocus
              />
            </div>

            {/* Group Description */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Description (optional)
              </label>
              <textarea
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white resize-none"
                placeholder="Enter group description"
                rows={3}
              />
            </div>

            {/* Member Selection */}
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Add Members *
              </label>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-black dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                  placeholder="Search contacts..."
                />
              </div>

              {/* Selected Members Count */}
              {selectedMembers.length > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {selectedMembers.length} member(s) selected
                </p>
              )}

              {/* Contacts List */}
              <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-800 rounded">
                {filteredContacts.length === 0 ? (
                  <p className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No contacts found
                  </p>
                ) : (
                  filteredContacts.map((contact) => (
                    <label
                      key={contact._id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(contact._id)}
                        onChange={() => toggleMember(contact._id)}
                        className="w-4 h-4"
                      />
                      <img
                        src={contact.profilePicture || "/avatar.png"}
                        alt={contact.username}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${contact.username}&background=000000&color=ffffff&size=32`;
                        }}
                      />
                      <span className="text-sm text-black dark:text-white">
                        {contact.username}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !groupName.trim() || selectedMembers.length === 0}
              className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Group
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const GroupsPanel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { groups, fetchGroups, isLoading, setSelectedGroup } = useGroup();

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const filteredGroups = groups.filter((group) =>
    group.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-black">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-h2 text-black dark:text-white">Groups</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-colors"
          >
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white transition-all duration-200 text-body"
          />
        </div>
      </div>

      {/* Groups List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <Users className="w-8 h-8 mb-3" />
            <p className="text-body text-black dark:text-white">
              {searchQuery ? "No groups found" : "No groups yet"}
            </p>
            <p className="text-small text-gray-500 dark:text-gray-400">
              {searchQuery ? "Try a different search" : "Create your first group"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredGroups.map((group) => (
              <div
                key={group._id}
                onClick={() => handleGroupClick(group)}
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
                    </div>
                    <p className="text-small text-gray-600 dark:text-gray-300 truncate">
                      {group.members?.length || 0} members
                      {group.description && ` • ${group.description}`}
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
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 p-3 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-body"
        >
          <Plus className="w-4 h-4" />
          Create Group
        </button>
      </div>

      {/* Create Group Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateGroupModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GroupsPanel;

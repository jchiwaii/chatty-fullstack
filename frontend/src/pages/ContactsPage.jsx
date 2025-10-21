import { useEffect, useState } from "react";
import { useContact } from "../store/useContact";
import MainLayout from "../components/Layout/MainLayout";
import { UserPlus, Users, Send, Check, X, Trash2 } from "lucide-react";

const ContactsPage = () => {
  const {
    contacts,
    allUsers,
    contactRequests,
    sentRequests,
    fetchContacts,
    fetchAllUsers,
    fetchContactRequests,
    fetchSentRequests,
    sendContactRequest,
    acceptContactRequest,
    rejectContactRequest,
    removeContact,
    isLoading,
  } = useContact();

  const [activeTab, setActiveTab] = useState("contacts");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchContacts();
    fetchContactRequests();
    fetchSentRequests();
  }, []);

  useEffect(() => {
    if (activeTab === "add") {
      fetchAllUsers();
    }
  }, [activeTab]);

  const filteredUsers = allUsers.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = contacts.filter((contact) =>
    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isPending = (userId) => {
    return sentRequests.some((req) => req.receiver._id === userId);
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-2xl font-semibold text-gray-900">Contacts</h1>
          <p className="text-sm text-gray-600">Manage your connections</p>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("contacts")}
              className={`py-3 px-4 border-b-2 transition-colors ${
                activeTab === "contacts"
                  ? "border-black text-black font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                My Contacts ({contacts.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`py-3 px-4 border-b-2 transition-colors ${
                activeTab === "requests"
                  ? "border-black text-black font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Requests ({contactRequests.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className={`py-3 px-4 border-b-2 transition-colors ${
                activeTab === "add"
                  ? "border-black text-black font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Add Contacts
              </div>
            </button>
          </div>
        </div>

        {/* Search */}
        {(activeTab === "contacts" || activeTab === "add") && (
          <div className="bg-white p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* My Contacts Tab */}
          {activeTab === "contacts" && (
            <div className="space-y-2">
              {isLoading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : filteredContacts.length === 0 ? (
                <p className="text-center text-gray-500">No contacts yet</p>
              ) : (
                filteredContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={contact.profilePicture || "/avatar.png"}
                        alt={contact.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {contact.username}
                        </h3>
                        <p className="text-sm text-gray-600">{contact.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeContact(contact._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Contact Requests Tab */}
          {activeTab === "requests" && (
            <div className="space-y-2">
              {contactRequests.length === 0 ? (
                <p className="text-center text-gray-500">No pending requests</p>
              ) : (
                contactRequests.map((request) => (
                  <div
                    key={request._id}
                    className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={request.sender.profilePicture || "/avatar.png"}
                        alt={request.sender.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {request.sender.username}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {request.sender.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => acceptContactRequest(request._id)}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => rejectContactRequest(request._id)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Add Contacts Tab */}
          {activeTab === "add" && (
            <div className="space-y-2">
              {isLoading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : filteredUsers.length === 0 ? (
                <p className="text-center text-gray-500">
                  No users found or all users are already contacts
                </p>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.profilePicture || "/avatar.png"}
                        alt={user.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {user.username}
                        </h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {user.bio && (
                          <p className="text-xs text-gray-500 mt-1">{user.bio}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => sendContactRequest(user._id)}
                      disabled={isPending(user._id)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        isPending(user._id)
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-black text-white hover:bg-gray-800"
                      }`}
                    >
                      {isPending(user._id) ? "Pending" : "Add Contact"}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactsPage;

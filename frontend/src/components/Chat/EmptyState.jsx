import React from "react";
import { MessageSquare, Send, Smile } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="h-full flex items-center justify-center bg-white">
      <div className="text-center max-w-md px-6">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <MessageSquare className="w-10 h-10 text-gray-400" />
          </div>
        </div>

        {/* Content */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Welcome to Chatty
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Select a conversation from the sidebar to start messaging, or create a
          new chat to connect with someone.
        </p>

        {/* Features */}
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <span>Send messages instantly</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Smile className="w-4 h-4" />
            </div>
            <span>Express yourself with emojis</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span>Real-time conversations</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;

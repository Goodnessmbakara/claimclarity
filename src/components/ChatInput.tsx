import React, { useState } from "react";
import { Send, Loader2, RotateCcw } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function ChatInput({
  onSendMessage,
  isLoading,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const quickActions = [
    { text: "What is the status of my claim?", label: "Check claim status" },
    { text: "What documents do I need?", label: "Required documents" },
    { text: "How do I file a new claim?", label: "File a new claim" },
  ];

  return (
    <div className="border-t border-gray-200/50 bg-white/80 backdrop-blur-sm p-4">
      {/* Quick Action Buttons */}
      <div className="mb-3 flex flex-wrap gap-2 justify-center">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() =>
              !isLoading && !disabled && onSendMessage(action.text)
            }
            disabled={isLoading || disabled}
            className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full border border-blue-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {action.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              disabled
                ? "Server offline - please start the backend server"
                : "Enter your claim ID (e.g., CLAIM-123) or ask about your claim..."
            }
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed shadow-sm font-medium placeholder:text-gray-400"
            disabled={isLoading || disabled}
          />
          {message && !isLoading && !disabled && (
            <button
              type="button"
              onClick={() => setMessage("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={!message.trim() || isLoading || disabled}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">Processing...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import {
  Shield,
  MessageCircle,
  AlertCircle,
  Database,
  RotateCcw,
  Sparkles,
  Plus,
} from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { ChatMessage as ChatMessageType } from "../types";
import {
  sendChatMessage,
  checkServerHealth,
  clearConversation,
} from "../services/chatApi";

interface ChatInterfaceProps {
  onCreateClaim?: () => void;
}

export default function ChatInterface({ onCreateClaim }: ChatInterfaceProps) {
  const [sessionId] = useState(
    () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: "1",
      content:
        "Welcome! I can help you check your claim status or create a new claim. Just enter your claim ID to check status, or use the 'Create Claim' button to submit a new claim.",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");
  const [usingMockData, setUsingMockData] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check server status on component mount
  useEffect(() => {
    const checkServer = async () => {
      const healthData = await checkServerHealth();
      setServerStatus(healthData.status === "OK" ? "online" : "offline");
    };

    checkServer();

    // Check server status every 30 seconds
    const interval = setInterval(checkServer, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(content, sessionId);

      // Update mock data status from response
      if (response.usingMockData !== undefined) {
        setUsingMockData(response.usingMockData);
      }

      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        content: response.response,
        sender: "assistant",
        timestamp: new Date(),
        claimData: response.claimData,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        content:
          "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    // Clear conversation on server
    await clearConversation(sessionId);

    setMessages([
      {
        id: "1",
        content: "Welcome back! How can I help you with your claim?",
        sender: "assistant",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                ClaimClarity
              </h1>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <p className="text-sm font-medium text-gray-600">
                  AI Claims Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Create Claim Button */}
              {onCreateClaim && (
                <button
                  onClick={onCreateClaim}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Claim</span>
                </button>
              )}

              {/* Clear Chat Button */}
              <button
                onClick={handleClearChat}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title="Clear chat history"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Clear</span>
              </button>

              {/* Data Source Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100">
                <Database
                  className={`w-4 h-4 ${
                    usingMockData ? "text-amber-500" : "text-emerald-500"
                  }`}
                />
                <span className="text-xs font-medium text-gray-700">
                  {usingMockData ? "Demo Mode" : "Live Data"}
                </span>
              </div>

              {/* Server Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100">
                <div
                  className={`w-2 h-2 rounded-full ${
                    serverStatus === "online"
                      ? "bg-emerald-500 animate-pulse"
                      : serverStatus === "offline"
                      ? "bg-red-500"
                      : "bg-amber-500"
                  }`}
                />
                <span className="text-xs font-medium text-gray-700">
                  {serverStatus === "online"
                    ? "Online"
                    : serverStatus === "offline"
                    ? "Offline"
                    : "Connecting..."}
                </span>
              </div>
            </div>
          </div>

          {/* Server Offline Warning */}
          {serverStatus === "offline" && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700 font-medium">
                Server is currently offline. Please ensure the backend server is
                running on port 3001.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto chat-scroll">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="max-w-xs sm:max-w-md lg:max-w-lg">
                <div className="px-4 py-3 bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-md shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full loading-dot"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full loading-dot"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full loading-dot"></div>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div className="max-w-4xl mx-auto w-full">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          disabled={serverStatus === "offline"}
        />
      </div>
    </div>
  );
}

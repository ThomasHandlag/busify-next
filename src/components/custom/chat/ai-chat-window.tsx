/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Loader2, Bot, User, Sparkles } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { IMessage } from "@stomp/stompjs";
import { toast } from "sonner";
import { useWebSocket } from "@/lib/contexts/WebSocketContext";

interface AIChatWindowProps {
  onCloseAction: () => void;
  onNewMessageAction?: () => void;
}

interface AIMessage {
  id?: string;
  content: string;
  sender: string;
  recipient?: string;
  timestamp: string;
  type: "CHAT" | "SYSTEM";
  isFromAI: boolean;
}

interface DisplayMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  sender: string;
  isFromAI: boolean;
}

export function AIChatWindow({ onCloseAction, onNewMessageAction }: AIChatWindowProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { isConnected, subscribe, unsubscribe, sendMessage } = useWebSocket();
  const aiSubscription = useRef<any>(null);
  const { data: session } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll to bottom when messages change
  useEffect(scrollToBottom, [messages]);

  // Auto-scroll to bottom when component mounts
  useEffect(() => {
    scrollToBottom();
  }, []);

  // Fetch AI chat history
  const fetchAIHistory = useCallback(async () => {
    if (!session?.user?.accessToken) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/ai-chat/history`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );
      
      if (response.ok) {
        const history: AIMessage[] = await response.json();
        const formattedHistory = history.map((msg) => ({
          text: msg.content,
          isUser: msg.sender !== "AI Bot",
          timestamp: new Date(msg.timestamp),
          sender: msg.sender,
          isFromAI: msg.sender === "AI Bot",
        }));
        setMessages(formattedHistory);
      } else {
        console.log("No chat history found or error fetching history");
      }
    } catch (error) {
      console.error("Failed to fetch AI chat history:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.accessToken]);

  // Initialize AI chat
  const initializeAIChat = useCallback(async () => {
    if (!session?.user?.accessToken || isInitialized) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/ai-chat/start`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.ok) {
        setIsInitialized(true);
        // Fetch history after initialization
        await fetchAIHistory();
      }
    } catch (error) {
      console.error("Failed to initialize AI chat:", error);
      toast.error("Không thể khởi tạo chat AI");
    }
  }, [session?.user?.accessToken, isInitialized, fetchAIHistory]);

  // Subscribe to AI WebSocket topic
  const subscribeToAI = useCallback(() => {
    if (!session?.user?.email || !isConnected) return;

    // Unsubscribe from previous subscription if any
    if (aiSubscription.current) {
      unsubscribe(aiSubscription.current);
      aiSubscription.current = null;
    }

    // Subscribe to AI topic for current user
    const userId = session.user.email;
    const subscription = subscribe(
      `/topic/ai/${userId}`,
      (message: IMessage) => {
        const aiMessage: AIMessage = JSON.parse(message.body);
        
        // Add AI response to messages
        setMessages((prev) => [
          ...prev,
          {
            text: aiMessage.content,
            isUser: false,
            timestamp: new Date(aiMessage.timestamp),
            sender: aiMessage.sender,
            isFromAI: true,
          },
        ]);

        // Notify parent component about new message
        if (onNewMessageAction) {
          onNewMessageAction();
        }
      }
    );

    aiSubscription.current = subscription;
  }, [session?.user?.email, isConnected, subscribe, unsubscribe, onNewMessageAction]);

  // Initialize when component mounts and session is available
  useEffect(() => {
    if (session) {
      initializeAIChat();
      if (isConnected) {
        subscribeToAI();
      }
    }

    return () => {
      if (aiSubscription.current) {
        unsubscribe(aiSubscription.current);
        aiSubscription.current = null;
      }
    };
  }, [session, isConnected, initializeAIChat, subscribeToAI, unsubscribe]);

  // Send message to AI
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !session || loading) return;

    const currentMessage = message;
    setMessage(""); // Clear input immediately

    // Add user message to UI
    const userMessage: DisplayMessage = {
      text: currentMessage,
      isUser: true,
      timestamp: new Date(),
      sender: session.user?.email || "User",
      isFromAI: false,
    };
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      if (isConnected && session.user?.email) {
        // Send via WebSocket
        sendMessage(
          `/app/chat.ai/${session.user.email}`,
          JSON.stringify({
            content: currentMessage,
            sender: session.user.email,
            recipient: "AI Bot",
            type: "CHAT",
          })
        );
      } else {
        // Fallback to REST API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/ai-chat/send`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: currentMessage,
              sender: session.user.email,
              recipient: "AI Bot",
              type: "CHAT",
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            // Add AI response from REST API
            setMessages((prev) => [
              ...prev,
              {
                text: result.data.content,
                isUser: false,
                timestamp: new Date(result.data.timestamp),
                sender: result.data.sender,
                isFromAI: true,
              },
            ]);
          }
        } else {
          throw new Error("Failed to send message");
        }
      }
    } catch (error) {
      console.error("Error sending message to AI:", error);
      toast.error("Không thể gửi tin nhắn. Vui lòng thử lại.");
      // Restore message if sending failed
      setMessage(currentMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="fixed bottom-48 right-6 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 z-50 items-center justify-center p-4 text-center">
        <div className="mb-4">
          <Bot className="h-12 w-12 text-blue-500 mx-auto mb-2" />
          <h3 className="font-semibold mb-2">Trợ lý AI Busify</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Vui lòng đăng nhập để trò chuyện với trợ lý AI.
        </p>
        <Button onClick={onCloseAction}>Đã hiểu</Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-48 right-6 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 z-50">
      {/* Header */}
      <div className="p-3 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <h3 className="font-semibold">Trợ lý AI</h3>
          <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
          {!isConnected && (
            <span className="text-xs bg-yellow-500/20 px-2 py-1 rounded-full">
              Offline
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCloseAction}
          className="hover:bg-white/20 text-white"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Đang khởi tạo trợ lý AI...</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                msg.isUser ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.isUser
                    ? "bg-blue-500 text-white"
                    : "bg-gradient-to-r from-gray-100 to-blue-50 text-gray-800 border border-blue-100"
                }`}
              >
                {!msg.isUser && (
                  <div className="flex items-center space-x-1 mb-1">
                    <Bot className="h-3 w-3 text-blue-500" />
                    <p className="text-xs font-bold text-blue-600">AI Bot</p>
                  </div>
                )}
                {msg.isUser && (
                  <div className="flex items-center justify-end space-x-1 mb-1">
                    <p className="text-xs font-bold text-blue-100">Bạn</p>
                    <User className="h-3 w-3 text-blue-100" />
                  </div>
                )}
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
              <span className="text-xs text-gray-400 px-1 pt-1">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))
        )}
        
        {loading && messages.length > 0 && (
          <div className="flex items-start">
            <div className="bg-gradient-to-r from-gray-100 to-blue-50 rounded-lg p-3 border border-blue-100">
              <div className="flex items-center space-x-1 mb-1">
                <Bot className="h-3 w-3 text-blue-500" />
                <p className="text-xs font-bold text-blue-600">AI Bot</p>
              </div>
              <div className="flex items-center space-x-1">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                <span className="text-sm text-gray-600">Đang suy nghĩ...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hỏi AI về chuyến đi của bạn..."
            className="flex-1"
            disabled={loading || !session}
          />
          <Button
            type="submit"
            size="icon"
            disabled={loading || !message.trim() || !session}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
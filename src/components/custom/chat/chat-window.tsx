/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { IMessage } from "@stomp/stompjs";
import { toast } from "sonner";
import {
  ChatMessage,
  MessageType,
  useWebSocket,
} from "@/lib/contexts/WebSocketContext";

interface ChatWindowProps {
  onClose: () => void;
}

interface DisplayMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  type: MessageType;
  sender: string;
}

export function ChatWindow({ onClose }: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const { isConnected, subscribe, unsubscribe, sendMessage } = useWebSocket();
  const currentSubscription = useRef<any>(null);
  const { data: session } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const storedRoomId = localStorage.getItem("chatRoomId");
    if (storedRoomId) {
      setRoomId(storedRoomId);
      if (isConnected && session) {
        subscribeToRoom(storedRoomId);
        fetchHistory(storedRoomId);
      }
    }

    return () => {
      if (currentSubscription.current) {
        unsubscribe(currentSubscription.current);
        currentSubscription.current = null;
      }
    };
  }, [isConnected, session]);

  const subscribeToRoom = (newRoomId: string) => {
    // Unsubscribe from previous room if any
    if (currentSubscription.current) {
      unsubscribe(currentSubscription.current);
      currentSubscription.current = null;
    }

    // Subscribe to new room
    const subscription = subscribe(
      `/topic/public/${newRoomId}`,
      (message: IMessage) => {
        const chatMessage: ChatMessage = JSON.parse(message.body);
        const isCurrentUser = chatMessage.sender === session?.user?.email;

        // Handle JOIN and LEAVE messages
        if (chatMessage.type === MessageType.JOIN) {
          if (!isCurrentUser) {
            toast(`${chatMessage.sender} đã tham gia phòng chat.`);
          }
          return;
        }
        if (chatMessage.type === MessageType.LEAVE) {
          toast(`${chatMessage.sender} đã rời phòng chat.`);
          return;
        }

        // Add only CHAT messages to display
        setMessages((prev) => [
          ...prev,
          {
            text: chatMessage.content,
            isUser: isCurrentUser,
            timestamp: new Date(),
            type: chatMessage.type,
            sender: chatMessage.sender,
          },
        ]);
      }
    );

    currentSubscription.current = subscription;

    // Announce user joining
    sendMessage(
      `/app/chat.addUser/${newRoomId}`,
      JSON.stringify({
        sender: session?.user?.email || "Anonymous",
        type: MessageType.JOIN,
        content: `${session?.user?.email || "Anonymous"} joined!`,
      })
    );
  };

  const fetchHistory = async (currentRoomId: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/chat/history/room/${currentRoomId}`,
        {
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
        }
      );
      if (response.ok) {
        const history: ChatMessage[] = await response.json();
        // Chỉ thêm messages có type CHAT và SYSTEM_ASSIGN, bỏ qua JOIN/LEAVE để tránh hiển thị rỗng
        const filteredHistory = history.filter(
          (msg) =>
            msg.type === MessageType.CHAT ||
            msg.type === MessageType.SYSTEM_ASSIGN
        );
        const formattedHistory = filteredHistory.map((msg) => ({
          text: msg.content,
          isUser: msg.sender === session?.user?.email, // Thay name bằng email
          timestamp: new Date(), // Lưu ý: Nên dùng timestamp từ backend nếu có (msg.timestamp)
          type: msg.type,
          sender: msg.sender,
        }));
        setMessages(formattedHistory);
      } else {
        toast.error("Không thể tải lịch sử tin nhắn.");
      }
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  const createRoomAndSendMessage = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/chat/createRoom`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to create room");

      const newRoomId = await response.text();
      localStorage.setItem("chatRoomId", newRoomId);
      setRoomId(newRoomId);

      if (isConnected) {
        subscribeToRoom(newRoomId);
        // Fix: Include message content as second parameter
        sendMessage(
          `/app/chat.sendMessage/${newRoomId}`,
          JSON.stringify({
            sender: session?.user?.email || "Anonymous",
            type: MessageType.CHAT,
            content: message,
          })
        );
        setMessage(""); // Clear the input after sending
      } else {
        toast.error("Chưa kết nối tới server chat. Đang thử lại...");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Không thể tạo phòng chat. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !session) return;

    if (!roomId) {
      await createRoomAndSendMessage();
    } else {
      // Fix: Include message content as second parameter
      sendMessage(
        `/app/chat.sendMessage/${roomId}`,
        JSON.stringify({
          sender: session?.user?.email || "Anonymous",
          type: MessageType.CHAT,
          content: message,
        })
      );
      setMessage(""); // Clear the input after sending
    }
  };

  if (!session) {
    return (
      <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 z-50 items-center justify-center p-4 text-center">
        <h3 className="font-semibold mb-2">Trò chuyện với Busify</h3>
        <p className="text-sm text-gray-600 mb-4">
          Vui lòng đăng nhập để bắt đầu trò chuyện với nhân viên hỗ trợ.
        </p>
        <Button onClick={onClose}>Đã hiểu</Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 z-50">
      {/* Header */}
      <div className="p-3 border-b bg-green-600 text-white rounded-t-lg flex items-center justify-between">
        <h3 className="font-semibold">Trò chuyện với Busify</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="hover:bg-green-700 text-white"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              msg.isUser ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-2 ${
                msg.isUser
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {!msg.isUser && (
                <p className="text-xs font-bold pb-1">{msg.sender}</p>
              )}
              <p className="text-sm">{msg.text}</p>
            </div>
            <span className="text-xs text-gray-400 px-1 pt-1">
              {msg.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1"
            disabled={loading || !isConnected} // Sử dụng isConnected thay vì stompClient.current?.connected
          />
          <Button
            type="submit"
            size="icon"
            disabled={
              loading || !message.trim() || !isConnected // Sử dụng isConnected
            }
            className="bg-green-600 hover:bg-green-700"
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

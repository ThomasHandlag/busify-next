/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";
import { toast } from "sonner";

interface ChatWindowProps {
  onClose: () => void;
}

enum MessageType {
  CHAT = "CHAT",
  JOIN = "JOIN",
  LEAVE = "LEAVE",
  SYSTEM_ASSIGN = "SYSTEM_ASSIGN",
}

interface ChatMessage {
  content: string;
  sender: string;
  recipient?: string;
  type: MessageType;
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
  const [isConnected, setIsConnected] = useState(false); // Thêm state để theo dõi kết nối
  const stompClient = useRef<Client | null>(null);
  const currentSubscription = useRef<any>(null); // Thêm ref để theo dõi subscription hiện tại
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
    }

    if (session?.user?.accessToken) {
      connect(storedRoomId);
    }

    return () => {
      if (stompClient.current?.connected) {
        stompClient.current.deactivate();
        setIsConnected(false); // Reset state khi disconnect
      }
    };
  }, [session]);

  const connect = (currentRoomId: string | null) => {
    try {
      const client = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
        connectHeaders: {
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
        reconnectDelay: 5000,
        onConnect: () => {
          setIsConnected(true);
          if (currentRoomId) {
            subscribeToRoom(client, currentRoomId);
            fetchHistory(currentRoomId);
          }
        },
        onStompError: (frame) => {
          console.error("Broker reported error: " + frame.headers["message"]);
          console.error("Additional details: " + frame.body);
          toast.error("Lỗi kết nối chat. Vui lòng thử lại.");
          setIsConnected(false);
        },
        onDisconnect: () => {
          setIsConnected(false);
          currentSubscription.current = null; // Đặt lại subscription khi disconnect
        },
      });

      client.activate();
      stompClient.current = client;
    } catch (error) {
      console.error("Connection error:", error);
      toast.error("Không thể kết nối đến máy chủ chat.");
      setIsConnected(false);
    }
  };

  const subscribeToRoom = (client: Client, newRoomId: string) => {
    // Hủy subscription cũ nếu có
    if (currentSubscription.current) {
      currentSubscription.current.unsubscribe();
      currentSubscription.current = null;
    }

    // Đăng ký mới
    const subscription = client.subscribe(
      `/topic/public/${newRoomId}`,
      (message: IMessage) => {
        const chatMessage: ChatMessage = JSON.parse(message.body);
        const isCurrentUser = chatMessage.sender === session?.user?.email; // Thay name bằng email

        // Xử lý tin nhắn JOIN và LEAVE
        if (chatMessage.type === MessageType.JOIN) {
          if (!isCurrentUser) {
            toast(`${chatMessage.sender} đã tham gia phòng chat.`); // Sender giờ là email, có thể hiển thị email hoặc thay bằng name nếu cần
          }
          return;
        }
        if (chatMessage.type === MessageType.LEAVE) {
          toast(`${chatMessage.sender} đã rời phòng chat.`); // Tương tự
          return;
        }

        // Chỉ thêm tin nhắn CHAT
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

    currentSubscription.current = subscription; // Lưu subscription mới

    // Announce user joining
    client.publish({
      destination: `/app/chat.addUser/${newRoomId}`,
      body: JSON.stringify({
        sender: session?.user?.email || "Anonymous", // Thay name bằng email
        type: MessageType.JOIN,
        content: `${session?.user?.email || "Anonymous"} joined!`, // Thay name bằng email
      }),
    });
  };

  const fetchHistory = async (currentRoomId: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/chat/history/room/${currentRoomId}`,
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
          (msg) => msg.type === MessageType.CHAT || msg.type === MessageType.SYSTEM_ASSIGN
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
        "http://localhost:8080/api/chat/createRoom",
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

      if (stompClient.current?.connected) {
        subscribeToRoom(stompClient.current, newRoomId);
        sendMessage(newRoomId);
      } else {
        toast.error("Chưa kết nối tới server chat. Đang thử lại...");
        connect(newRoomId); // Reconnect and it will subscribe
      }
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Không thể tạo phòng chat. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = (currentRoomId: string) => {
    if (message.trim() && stompClient.current?.connected) {
      const chatMessage: ChatMessage = {
        sender: session?.user?.email || "Anonymous", // Thay id bằng email
        content: message,
        type: MessageType.CHAT,
      };

      stompClient.current.publish({
        destination: `/app/chat.sendMessage/${currentRoomId}`,
        body: JSON.stringify(chatMessage),
      });

      setMessage("");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !session) return;

    if (!roomId) {
      await createRoomAndSendMessage();
    } else {
      sendMessage(roomId);
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

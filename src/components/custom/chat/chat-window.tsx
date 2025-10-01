/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Loader2 } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { IMessage } from "@stomp/stompjs";
import { toast } from "sonner";
import {
  ChatMessage,
  MessageType,
  useWebSocket,
  ChatNotification,
} from "@/lib/contexts/WebSocketContext";

interface ChatWindowProps {
  onClose: () => void;
  onNewMessage?: () => void;
}

interface DisplayMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  type: MessageType;
  sender: string;
}

export function ChatWindow({ onClose, onNewMessage }: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const { isConnected, subscribe, unsubscribe, sendMessage } = useWebSocket();
  const currentSubscription = useRef<any>(null);
  const notificationSubscription = useRef<any>(null);
  const { data: session } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll to bottom when messages change
  useEffect(scrollToBottom, [messages]);

  // Auto-scroll to bottom when component mounts (i.e., when chat opens)
  useEffect(() => {
    scrollToBottom();
  }, []);

  const fetchHistory = useCallback(
    async (currentRoomId: string) => {
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
            isUser: msg.sender === session?.user?.email,
            timestamp: new Date(msg.timestamp), // Sử dụng timestamp thực tế từ backend
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
    },
    [session?.user.accessToken, session?.user?.email]
  );

  const subscribeToRoom = useCallback(
    (newRoomId: string) => {
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

          // Skip adding the user's own messages as they were already added when sending
          if (isCurrentUser && chatMessage.type === MessageType.CHAT) {
            return;
          }

          // Add only other users' messages or system messages
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

          // Notify parent component about the new message
          if (onNewMessage) {
            onNewMessage();
          }
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
    },
    [session?.user?.email, subscribe, unsubscribe, sendMessage, onNewMessage]
  );

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
  }, [isConnected, session, subscribeToRoom, fetchHistory, unsubscribe]);

  useEffect(() => {
    if (isConnected && session?.user?.email) {
      const sub = subscribe(
        `/topic/user/${session.user.email}/notifications`,
        (message: IMessage) => {
          const notification: ChatNotification = JSON.parse(message.body);
          // Show toast only for notifications from other rooms or when no room is active
          if (!roomId || notification.roomId !== roomId) {
            toast(
              `Tin nhắn mới từ ${notification.sender}: ${notification.contentPreview}`
            );
            onNewMessage?.(); // Notify parent of new message
          }
        }
      );
      notificationSubscription.current = sub;
    }

    return () => {
      if (notificationSubscription.current) {
        unsubscribe(notificationSubscription.current);
        notificationSubscription.current = null;
      }
    };
  }, [isConnected, session, roomId, subscribe, unsubscribe, onNewMessage]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !session) return;

    // Store current message before clearing input
    const currentMessage = message;
    setMessage(""); // Clear input immediately for better UX

    if (!roomId) {
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
          // Add message to UI immediately
          setMessages((prev) => [
            ...prev,
            {
              text: currentMessage,
              isUser: true,
              timestamp: new Date(),
              type: MessageType.CHAT,
              sender: session?.user?.email || "Anonymous",
            },
          ]);

          subscribeToRoom(newRoomId);
          sendMessage(
            `/app/chat.sendMessage/${newRoomId}`,
            JSON.stringify({
              sender: session?.user?.email || "Anonymous",
              type: MessageType.CHAT,
              content: currentMessage,
            })
          );
        } else {
          toast.error("Chưa kết nối tới server chat. Đang thử lại...");
        }
      } catch (error) {
        console.error("Error creating room:", error);
        toast.error("Không thể tạo phòng chat. Vui lòng thử lại.");
        // Restore message if sending failed
        setMessage(currentMessage);
      } finally {
        setLoading(false);
      }
    } else {
      // Add message to UI immediately
      setMessages((prev) => [
        ...prev,
        {
          text: currentMessage,
          isUser: true,
          timestamp: new Date(),
          type: MessageType.CHAT,
          sender: session?.user?.email || "Anonymous",
        },
      ]);

      sendMessage(
        `/app/chat.sendMessage/${roomId}`,
        JSON.stringify({
          sender: session?.user?.email || "Anonymous",
          type: MessageType.CHAT,
          content: currentMessage,
        })
      );
    }
  };

  if (!session) {
    return (
      <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 z-50 items-center justify-center p-4 text-center">
        <h3 className="font-semibold mb-2">Trò chuyện với Busify</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Vui lòng đăng nhập để bắt đầu trò chuyện với nhân viên hỗ trợ.
        </p>
        <Button aria-label="Close Chat" variant="outline" onClick={onClose}>
          Đã hiểu
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 z-50">
      {/* Header */}
      <div className="p-3 border-b bg-primary text-primary-foreground rounded-t-lg flex items-center justify-between">
        <h3 className="font-semibold">Trò chuyện với Busify</h3>
        <Button
          aria-label="Close Chat"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="hover:bg-primary/90 text-primary-foreground"
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
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {!msg.isUser && (
                <p className="text-xs font-bold pb-1">{msg.sender}</p>
              )}
              <p className="text-sm">{msg.text}</p>
            </div>
            <span className="text-xs text-muted-foreground px-1 pt-1">
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
            aria-label="Send Message"
            type="submit"
            size="icon"
            disabled={
              loading || !message.trim() || !isConnected // Sử dụng isConnected
            }
            className="bg-primary hover:bg-primary/90"
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

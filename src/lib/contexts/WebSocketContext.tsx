"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export enum MessageType {
  CHAT = "CHAT",
  JOIN = "JOIN",
  LEAVE = "LEAVE",
  SYSTEM_ASSIGN = "SYSTEM_ASSIGN",
}

export interface ChatMessage {
  content: string;
  sender: string;
  recipient?: string;
  type: MessageType;
}

interface WebSocketContextType {
  client: Client | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  subscribe: (
    destination: string,
    callback: (message: IMessage) => void
  ) => StompSubscription;
  unsubscribe: (subscription: StompSubscription) => void;
  sendMessage: (destination: string, body: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const { data: session } = useSession();

  const connect = () => {
    if (clientRef.current?.connected) return;

    try {
      const client = new Client({
        webSocketFactory: () =>
          new SockJS(`${process.env.NEXT_PUBLIC_API_URL}ws`),
        connectHeaders: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log("WebSocket connected");
          setIsConnected(true);
        },
        onStompError: (frame) => {
          console.error("Broker reported error: " + frame.headers["message"]);
          console.error("Additional details: " + frame.body);
          toast.error("Lỗi kết nối chat. Vui lòng thử lại.");
          setIsConnected(false);
        },
        onDisconnect: () => {
          console.log("WebSocket disconnected");
          setIsConnected(false);
        },
      });

      client.activate();
      clientRef.current = client;
    } catch (error) {
      console.error("Connection error:", error);
      toast.error("Không thể kết nối đến máy chủ chat.");
      setIsConnected(false);
    }
  };

  const disconnect = () => {
    if (clientRef.current?.connected) {
      clientRef.current.deactivate();
      setIsConnected(false);
    }
  };

  const subscribe = (
    destination: string,
    callback: (message: IMessage) => void
  ): StompSubscription => {
    if (!clientRef.current?.connected) {
      toast.error("Chưa kết nối đến máy chủ chat");
      return null as any; // Temporary fallback; ideally handle error differently
    }
    return clientRef.current.subscribe(destination, callback);
  };

  const unsubscribe = (subscription: StompSubscription) => {
    if (subscription) {
      subscription.unsubscribe();
    }
  };

  const sendMessage = (destination: string, body: string) => {
    if (!clientRef.current?.connected) {
      toast.error("Chưa kết nối đến máy chủ chat");
      return;
    }
    clientRef.current.publish({ destination, body });
  };

  // Connect when session is available and disconnect on cleanup
  useEffect(() => {
    if (session?.user?.accessToken) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [session?.user?.accessToken]);

  return (
    <WebSocketContext.Provider
      value={{
        client: clientRef.current,
        isConnected,
        connect,
        disconnect,
        subscribe,
        unsubscribe,
        sendMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

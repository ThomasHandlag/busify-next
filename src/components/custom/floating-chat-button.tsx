"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { ChatWindow } from "./chat/chat-window";

export function FloatingChatButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();

  // Hide button in dashboard or admin pages
  useEffect(() => {
    const isDashboardPath =
      pathname?.includes("/dashboard") || pathname?.includes("/admin");
    setIsVisible(!isDashboardPath);
  }, [pathname]);

  // Toggle chat window open/close
  const handleChatClick = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setUnreadCount(0); // Reset unread count when opening chat
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <Button
        onClick={handleChatClick}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-green-600 hover:bg-green-700 transition-all hover:scale-110 z-50 flex items-center justify-center"
        aria-label="Trợ giúp trực tuyến"
      >
        <MessageCircle className="size-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

      <div className={isChatOpen ? "" : "hidden"}>
        <ChatWindow
          onClose={() => setIsChatOpen(false)}
          onNewMessage={() => setUnreadCount((prev) => prev + 1)}
        />
      </div>
    </>
  );
}

export default FloatingChatButton;

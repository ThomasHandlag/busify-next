"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { AIChatWindow } from "./chat/ai-chat-window";

export function FloatingAIChatButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [shouldShake, setShouldShake] = useState(true);
  const pathname = usePathname();

  // Hide button in dashboard or admin pages
  useEffect(() => {
    const isDashboardPath =
      pathname?.includes("/dashboard") || pathname?.includes("/admin");
    setIsVisible(!isDashboardPath);
  }, [pathname]);

  // Stop shaking after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldShake(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
        className={`fixed bottom-32 right-6 w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all hover:scale-110 z-50 flex items-center justify-center group ${shouldShake ? 'animate-shake' : ''}`}
        style={{
          animation: shouldShake ? 'shake 0.5s ease-in-out 0s 6' : undefined,
        }}
        aria-label="Trợ lý AI"
      >
        <div className="relative">
          <Bot className="size-6 text-white" />
          <Sparkles className="absolute -top-1 -right-1 size-3 text-yellow-300 animate-pulse" />
        </div>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Trợ lý AI
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
      </Button>

      <div className={isChatOpen ? "" : "hidden"}>
        <AIChatWindow
          onCloseAction={() => setIsChatOpen(false)}
          onNewMessageAction={() => setUnreadCount((prev) => prev + 1)}
        />
      </div>
    </>
  );
}

export default FloatingAIChatButton;
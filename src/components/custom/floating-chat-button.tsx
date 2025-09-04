"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { ChatWindow } from "./chat/chat-window";

export function FloatingChatButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const pathname = usePathname();

  // Hide button in dashboard or admin pages
  useEffect(() => {
    const isDashboardPath =
      pathname?.includes("/dashboard") || pathname?.includes("/admin");
    setIsVisible(!isDashboardPath);
  }, [pathname]);

  const handleChatClick = () => {
    setIsChatOpen(true);
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
      </Button>

      {isChatOpen && <ChatWindow onClose={() => setIsChatOpen(false)} />}
    </>
  );
}

export default FloatingChatButton;

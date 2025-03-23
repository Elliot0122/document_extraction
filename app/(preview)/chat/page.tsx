"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Send, Loader2, FileUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ChatContent from "./chat-content";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[100dvh] w-full flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-lg text-gray-600">Loading chat...</div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
} 
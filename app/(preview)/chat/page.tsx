"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2, FileUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    const file = searchParams.get('file');
    if (file) {
      setFileName(decodeURIComponent(file));
    }
  }, [searchParams]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      role: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");
    setIsLoading(true);

    // TODO: Add API call to get bot response
    // For now, we'll just simulate a response
    setTimeout(() => {
      const botResponse: Message = {
        role: 'assistant',
        content: "This is a simulated response. You'll need to integrate with your AI API here."
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-gradient-to-b from-white to-gray-50">
      {/* Chat Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-[#0066FF]" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#0066FF] to-[#0052CC] bg-clip-text text-transparent">
                Document Chat
              </h1>
            </div>
            {fileName && (
              <span className="text-sm text-gray-700 font-medium px-3 py-1 bg-gray-100 rounded-full">
                {fileName}
              </span>
            )}
          </div>
          <Button 
            variant="outline" 
            onClick={() => router.push('/')}
            className="gap-2 bg-[#0066FF] hover:bg-[#0052CC] text-white border-none"
          >
            <FileUp className="h-4 w-4" />
            New Document
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-[#0066FF] text-white'
                      : 'bg-white text-gray-800 border border-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-full bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="h-4 w-4 text-[#0066FF]" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm break-words whitespace-pre-wrap overflow-hidden">{message.content}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#0066FF]/10 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-[#0066FF]" />
                  </div>
                  <Loader2 className="h-4 w-4 animate-spin text-[#0066FF]" />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div className="border-t bg-white/80 backdrop-blur-sm sticky bottom-0">
        <div className="max-w-4xl mx-auto p-4">
          <form onSubmit={handleSubmitMessage} className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-full border-gray-200 focus:border-[#0066FF] focus:ring-[#0066FF] text-gray-900 placeholder:text-gray-400"
            />
            <Button
              type="submit"
              className="rounded-full !bg-[#0066FF] hover:!bg-[#0052CC] text-white shadow-sm"
              disabled={isLoading || !inputMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 
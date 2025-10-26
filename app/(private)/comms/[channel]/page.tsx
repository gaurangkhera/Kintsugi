"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { MessageSquare, Send, Lock } from "lucide-react";
import { encryptMessage, decryptMessage } from "@/lib/encryption";

export default function CommsPage() {
  const params = useParams();
  const channel = params?.channel as string || "general";
  const channelName = `#${channel}`;
  
  const [newMessage, setNewMessage] = useState("");
  const [decryptedMessages, setDecryptedMessages] = useState<Map<string, string>>(new Map());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const messages = useQuery(api.messages.getMessages, { channel: channelName }) ?? [];
  const sendMessage = useMutation(api.messages.sendMessage);

  useEffect(() => {
    const decryptAllMessages = async () => {
      const newDecrypted = new Map<string, string>();
      
      for (const message of messages) {
        if (!decryptedMessages.has(message._id)) {
          try {
            const decrypted = await decryptMessage(message.body, channelName);
            newDecrypted.set(message._id, decrypted);
          } catch (error) {
            console.error('Failed to decrypt message:', error);
            newDecrypted.set(message._id, '[ENCRYPTED]');
          }
        } else {
          newDecrypted.set(message._id, decryptedMessages.get(message._id)!);
        }
      }
      
      setDecryptedMessages(newDecrypted);
    };
    
    decryptAllMessages();
  }, [messages, channelName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      try {
        const encrypted = await encryptMessage(newMessage, channelName);
        await sendMessage({ channel: channelName, body: encrypted });
        setNewMessage("");
      } catch (error) {
        console.error('Failed to send encrypted message:', error);
      }
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-8 bg-amber-400"></div>
          <h1 className="text-4xl font-light tracking-tight text-white">
            Communications
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-gray-500 text-sm tracking-wide">
            Channel: <span className="text-gray-400">{channelName}</span> • {messages.length} messages
          </p>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-400/10 border border-green-400/20 rounded">
            <Lock className="w-3 h-3 text-green-400" />
            <span className="text-[10px] tracking-wider uppercase text-green-400">E2E Encrypted</span>
          </div>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 h-[calc(100vh-18rem)] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-[10px] tracking-[0.2em] text-gray-600 uppercase">Live</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <MessageSquare className="w-12 h-12 mb-4 text-gray-700" />
              <p className="text-gray-600 text-sm">
                No messages yet. Start the conversation.
              </p>
            </div>
          ) : (
            messages.map((message: any) => (
              <div
                key={message._id}
                className="p-4 bg-white/[0.02] border border-white/5 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-white text-sm font-light">
                    {message.userName}
                  </span>
                  <span className="text-gray-600 text-xs">
                    {new Date(message._creationTime).toLocaleTimeString()}
                  </span>
                  <Lock className="w-3 h-3 text-green-400/50" />
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {decryptedMessages.get(message._id) || 'Decrypting...'}
                </p>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 border-t border-white/5 bg-white/[0.02]">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-white/[0.02] border-white/5 text-gray-100 placeholder:text-gray-600 focus:border-white/10 px-4 py-5 text-sm"
            />
            <Button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-5 text-sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

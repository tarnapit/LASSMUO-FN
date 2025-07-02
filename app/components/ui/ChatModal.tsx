"use client";
import { useState } from "react";
import { Friend, ChatMessage } from "../../types/friends";
import { X, Send, Smile } from "lucide-react";

interface ChatModalProps {
  friend: Friend;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatModal({ friend, isOpen, onClose }: ChatModalProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      fromUserId: 'me',
      toUserId: friend.id,
      message: 'สวัสดี! เล่นเกมจับคู่ดาวเคราะห์ด้วยกันมั้ย?',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: true
    },
    {
      id: '2',
      fromUserId: friend.id,
      toUserId: 'me',
      message: 'ได้เลย! รอแปป กำลังเรียนบทเรียนระบบสุริยะอยู่',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: true
    }
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        fromUserId: 'me',
        toUserId: friend.id,
        message: message.trim(),
        timestamp: new Date(),
        read: false
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md h-[600px] flex flex-col border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg">
                {friend.avatar}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900 ${
                friend.status === 'online' ? 'bg-green-400' : 
                friend.status === 'playing' ? 'bg-blue-400' : 'bg-gray-400'
              }`}></div>
            </div>
            <div className="ml-3">
              <h3 className="text-white font-semibold">{friend.displayName}</h3>
              <p className="text-gray-400 text-sm">
                {friend.status === 'online' ? 'ออนไลน์' : 
                 friend.status === 'playing' ? 'กำลังเล่น' : 'ออฟไลน์'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="ปิดหน้าต่างแชท"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.fromUserId === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-2xl ${
                  msg.fromUserId === 'me'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-white/10 text-white'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs opacity-70 mt-1">
                  {msg.timestamp.toLocaleTimeString('th-TH', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center space-x-2">
            <button 
              className="text-gray-400 hover:text-yellow-400 transition-colors"
              title="เลือก emoji"
              aria-label="เลือก emoji"
            >
              <Smile size={20} />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="พิมพ์ข้อความ..."
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
            <button 
              onClick={sendMessage}
              disabled={!message.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full hover:from-blue-400 hover:to-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="ส่งข้อความ"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

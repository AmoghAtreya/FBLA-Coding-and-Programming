import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { Message } from '@/hooks/useChat';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
      className={cn(
        "flex",
        message.sender === 'user' ? "justify-end" : "justify-start"
      )}
    >
      {message.sender === 'bot' && (
        <Avatar className="h-8 w-8 mr-2 mt-1">
          <AvatarImage src="/assets/bot-avatar.png" alt="Armo. Assistant" />
          <AvatarFallback className="text-black" style={{ backgroundColor: '#9fd1b5' }}>A</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-xs rounded-lg px-4 py-2 text-sm",
          message.sender === 'user'
            ? "text-black border border-gray-300"
            : "bg-gray-100 text-gray-700 border border-gray-300"
        )}
        style={message.sender === 'user' ? { backgroundColor: '#9fd1b5' } : {}}
      >
        <p className="leading-relaxed">{message.content}</p>
        <span className={cn(
          "text-xs block mt-1",
          message.sender === 'user' ? "text-black/70" : "text-gray-500"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      {message.sender === 'user' && (
        <Avatar className="h-8 w-8 ml-2 mt-1">
          <AvatarFallback className="bg-gray-300 text-gray-700 border border-gray-400">U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

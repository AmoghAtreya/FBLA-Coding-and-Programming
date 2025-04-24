
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
          <AvatarImage src="/assets/bot-avatar.png" alt="FinFlow Assistant" />
          <AvatarFallback>F</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-xs rounded-lg px-4 py-2 text-sm",
          message.sender === 'user'
            ? "bg-finflow-blue text-white"
            : "bg-white text-gray-800 border"
        )}
      >
        <p>{message.content}</p>
        <span className="text-xs opacity-70 block mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      {message.sender === 'user' && (
        <Avatar className="h-8 w-8 ml-2 mt-1">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

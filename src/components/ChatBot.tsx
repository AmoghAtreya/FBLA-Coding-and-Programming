
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ChatMessage } from './chat/ChatMessage';
import { useChat } from '@/hooks/useChat';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isTyping, sendMessage } = useChat();
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
    await sendMessage(inputValue);
    setInputValue('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      <Button
        className={cn(
          "fixed bottom-6 right-6 rounded-full p-4 shadow-lg transition-all duration-300 z-50 chat-toggle h-14 w-14 md:h-16 md:w-16",
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-finflow-blue hover:bg-blue-700"
        )}
        onClick={toggleChat}
      >
        {isOpen ? 
          <X className="h-6 w-6 md:h-7 md:w-7" /> : 
          <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
        }
      </Button>
      
      <Card
        className={cn(
          "fixed bottom-24 md:bottom-28 right-6 w-80 md:w-96 shadow-xl rounded-xl overflow-hidden transition-all duration-300 transform z-40 chat-window",
          isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
        )}
      >
        <div className="bg-finflow-blue text-white p-3">
          <h3 className="font-medium text-sm">FinFlow Assistant</h3>
          <p className="text-xs text-white/80">Always here to help</p>
        </div>
        
        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          <div className="space-y-4">
            {messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {isTyping && (
              <div className="flex">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback>F</AvatarFallback>
                </Avatar>
                <div className="bg-white text-gray-800 border rounded-lg px-4 py-2 flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <div className="p-3 bg-white border-t flex chat-input">
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 mr-2"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isTyping}
            size="icon"
            className="bg-finflow-blue hover:bg-blue-700 chat-send-button"
          >
            {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </Card>
    </>
  );
};

export default ChatBot;

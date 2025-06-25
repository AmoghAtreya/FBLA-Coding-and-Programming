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
          "fixed bottom-6 right-6 rounded-full p-4 shadow-lg transition-all duration-300 z-50 chat-toggle h-14 w-14 md:h-16 md:w-16 border-2",
          isOpen
            ? "bg-red-500/90 hover:bg-red-600 border-red-400 backdrop-blur-sm"
            : "border-gray-700 backdrop-blur-sm hover:scale-110"
        )}
        style={!isOpen ? { 
          backgroundColor: '#9fd1b5',
          borderColor: '#7bc299'
        } : {}}
        onClick={toggleChat}
      >
        {isOpen ? (
          <X className="h-6 w-6 md:h-7 md:w-7 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 md:h-7 md:w-7 text-white" />
        )}
      </Button>
      
      <Card
        className={cn(
          "fixed bottom-24 md:bottom-28 right-6 w-80 md:w-96 shadow-2xl rounded-xl overflow-hidden transition-all duration-300 transform z-40 chat-window border border-gray-700/50 backdrop-blur-sm",
          isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
        )}
        style={{ backgroundColor: '#1a1a1a' }}
      >
        <div className="text-white p-4 border-b border-gray-700/50" style={{ backgroundColor: '#9fd1b5' }}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border-2 border-black">
              <span className="text-black font-bold text-sm">A</span>
            </div>
            <div>
              <div className="text-left">
                <h3 className="font-semibold text-base text-black">Ahlan Assistant</h3>
                <p className="text-xs text-black/80">Always here to help with your finances</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-96 overflow-y-auto p-4" style={{ backgroundColor: '#181818' }}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Hi! I'm your Ahlan assistant.</p>
                <p className="text-xs mt-1">Ask me anything about managing your finances!</p>
              </div>
            )}
            
            {messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {isTyping && (
              <div className="flex">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback className="text-white" style={{ backgroundColor: '#9fd1b5' }}>A</AvatarFallback>
                </Avatar>
                <div className="bg-gray-800/50 text-gray-200 border border-gray-700/50 rounded-lg px-4 py-2 flex items-center space-x-1 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#9fd1b5', animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#9fd1b5', animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#9fd1b5', animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <div className="p-3 border-t border-gray-700/50 flex chat-input" style={{ backgroundColor: '#1a1a1a' }}>
          <Input
            placeholder="Ask about budgeting, savings, or any financial question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 mr-2 bg-gray-800/50 text-white border border-gray-600/50 placeholder-gray-400 focus:border-gray-500 focus:ring-1 backdrop-blur-sm"
            style={{ '--tw-ring-color': '#9fd1b5' } as any}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            size="icon"
            className="text-white chat-send-button transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#9fd1b5' }}
          >
            {isTyping ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </Card>
    </>
  );
};

export default ChatBot;

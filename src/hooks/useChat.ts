
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

export const INITIAL_MESSAGES: Message[] = [
  {
    id: '0',
    content: "Hi there! 👋 I'm your FinFlow assistant. How can I help you with your finances today?",
    sender: 'bot',
    timestamp: new Date(),
  },
];

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (content: string) => {
    // Create a user message with a simple ID (no uuid needed yet)
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Format messages for the API
      const chatMessages = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      // Add the current message
      chatMessages.push({
        role: 'user',
        content: content
      });

      // Call the Edge Function
      const { data, error } = await supabase.functions.invoke('chat-completion', {
        body: { messages: chatMessages }
      });

      if (error) throw error;

      // Process the response
      const botResponse = data.choices[0].message.content;
      
      // Create bot message with simple ID (no uuid needed)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(), // Ensure unique ID
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error in chat response:', error);
      
      // Create error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(), // Ensure unique ID
        content: "I apologize, but I'm having trouble responding right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return {
    messages,
    isTyping,
    sendMessage,
  };
};

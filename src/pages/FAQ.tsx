import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

/**
 * FAQ Page
 * 
 * Frequently Asked Questions and help resources.
 * Features:
 * - Searchable FAQ categories
 * - Expandable question/answer format
 * - Navigation header
 * - User authentication state awareness
 * - Responsive design
 * 
 * Uses the Accordion component for expandable content
 * and motion animations for enhanced user experience.
 */

// FAQ data
const faqs = [
  {
    question: "What is FinFlow?",
    answer: "FinFlow is a comprehensive financial management platform designed specifically for students. It helps you track expenses, set budgets based on your income, and build healthy financial habits."
  },
  {
    question: "Is FinFlow free to use?",
    answer: "Yes, FinFlow's core features are completely free for students. We offer premium features for a small monthly subscription, but you can accomplish most tasks with the free version."
  },
  {
    question: "How do I create a budget?",
    answer: "After signing in, navigate to the 'Budget' section from your dashboard. Click 'Create New Budget' and follow the step-by-step wizard to set up income sources, spending categories, and savings goals."
  },
  {
    question: "Can I connect my bank account?",
    answer: "Yes, FinFlow allows secure connections to thousands of financial institutions through our banking partners. Your credentials are never stored on our servers, and all connections use bank-level encryption."
  },
  {
    question: "How does FinFlow keep my financial data secure?",
    answer: "We use industry-standard encryption for all data at rest and in transit. We never share your financial information with third parties without your explicit consent, and you can delete your data at any time."
  },
  {
    question: "Can I use FinFlow on my mobile device?",
    answer: "Absolutely! FinFlow is fully responsive and works on any device with a web browser. We also offer dedicated mobile apps for iOS and Android for an enhanced experience."
  },
  {
    question: "How do I categorize my transactions?",
    answer: "FinFlow automatically categorizes most transactions based on merchant information. You can also manually categorize transactions or create custom categories that fit your specific spending patterns."
  }
];

const FAQ = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-white w-full relative overflow-hidden">
      <header className="px-6 py-4 md:px-10 md:py-6 w-full border-b">
        <nav className="max-w-[1920px] mx-auto flex justify-between items-center w-full px-6 md:px-10">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-finflow-blue text-white h-8 w-8 rounded-md flex items-center justify-center font-bold text-xl">F</div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-finflow-blue to-blue-700">FinFlow</h1>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-finflow-blue transition-colors">Home</Link>
            <Link to="/faq" className="text-finflow-blue font-medium">FAQ</Link>
            <Link to="/#features" className="text-gray-600 hover:text-finflow-blue transition-colors">Features</Link>
            {user && (
              <Link to="/dashboard" className="text-gray-600 hover:text-finflow-blue transition-colors">Dashboard</Link>
            )}
          </div>
          <div className="flex items-center gap-3">
            {!user && (
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-finflow-blue hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Sign Up <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
            <Button 
              onClick={() => navigate(user ? '/dashboard' : '/auth')}
              variant="outline" 
              className={`border-finflow-blue text-finflow-blue hover:bg-finflow-blue hover:text-white transition-colors ${user ? '' : 'hidden sm:flex'}`}
            >
              {user ? 'Dashboard' : 'Log In'}
            </Button>
          </div>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600">Find detailed answers to common questions about FinFlow's features and functionality</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg shadow-sm border px-6">
                <AccordionTrigger className="text-left text-lg font-medium py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;

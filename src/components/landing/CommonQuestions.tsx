
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const CommonQuestions: React.FC = () => {
  const faqs = [
    {
      question: "Does FinFlow charge a fee to send or receive money?",
      answer: "No, all basic features in FinFlow are completely free for students. We don't charge any fees for sending, receiving, or transferring money between accounts. Premium features are available with our subscription plan, but you can accomplish most tasks with the free version."
    },
    {
      question: "Do I need a balance before I can transfer money?",
      answer: "No, you can link your bank account and transfer money without maintaining a balance in your FinFlow account. Our platform makes it easy to move money between your accounts and track all your finances in one place."
    },
    {
      question: "Can I send money to someone who's not on FinFlow?",
      answer: "Yes, you can send money to anyone, even if they don't have a FinFlow account. They'll receive an email or text message with instructions on how to claim their money, which they can transfer to their bank account."
    },
    {
      question: "How does FinFlow keep my account safe from fraud?",
      answer: "FinFlow uses bank-level encryption and security measures to protect your information. We offer two-factor authentication, real-time suspicious activity alerts, and continuous monitoring of your account to prevent unauthorized access."
    },
    {
      question: "How does FinFlow keep my money safe?",
      answer: "Your finances are protected with industry-standard encryption. We partner with FDIC-insured banks to ensure your money is secure. Additionally, we employ advanced security protocols and continuous monitoring to protect against unauthorized transactions."
    },
  ];

  return (
    <motion.div 
      className="max-w-3xl mx-auto space-y-5"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <Accordion type="single" collapsible className="space-y-5">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.7 }}
            viewport={{ once: true }}
          >
            <AccordionItem value={`item-${index}`} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <AccordionTrigger className="text-left text-lg font-bold py-5 px-6 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 px-6 pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </motion.div>
  );
};

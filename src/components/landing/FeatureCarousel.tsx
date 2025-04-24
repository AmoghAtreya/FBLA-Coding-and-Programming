
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, BarChart2, CreditCard, TrendingUp, MessageSquare } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, icon, description }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg h-full flex flex-col">
      <div className="mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600 flex-grow">{description}</p>
    </div>
  );
};

export const FeatureCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const features = [
    {
      title: 'Budget Tracking',
      icon: <BarChart2 className="w-10 h-10 text-finflow-blue" />,
      description: 'Set up personalized budgets based on your income and track your spending against them in real-time.'
    },
    {
      title: 'Financial Analytics',
      icon: <TrendingUp className="w-10 h-10 text-finflow-blue" />,
      description: 'Get insights into your spending patterns and make better financial decisions with our powerful analytics tools.'
    },
    {
      title: 'Student Cards',
      icon: <CreditCard className="w-10 h-10 text-finflow-blue" />,
      description: 'Manage your student card, track expenses, and get exclusive student discounts with our integrated platform.'
    },
    {
      title: 'AI Financial Advisor',
      icon: <MessageSquare className="w-10 h-10 text-finflow-blue" />,
      description: 'Get personalized financial advice from our AI assistant, from budgeting tips to savings recommendations.'
    }
  ];

  const nextSlide = () => {
    if (activeIndex < features.length - 1) {
      setActiveIndex(activeIndex + 1);
      scrollToCard(activeIndex + 1);
    } else {
      setActiveIndex(0);
      scrollToCard(0);
    }
  };

  const prevSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      scrollToCard(activeIndex - 1);
    } else {
      setActiveIndex(features.length - 1);
      scrollToCard(features.length - 1);
    }
  };

  const scrollToCard = (index: number) => {
    if (carouselRef.current) {
      const scrollAmount = index * (300 + 20); // card width + gap
      carouselRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="features" className="py-20 px-6 bg-gray-50">
      <div className="max-w-[1280px] mx-auto">
        <motion.div 
          className="mb-12 flex justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">Take charge of your money</h2>
          <div className="flex gap-2">
            <button 
              onClick={prevSlide}
              className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={nextSlide}
              className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        {/* Mobile Carousel */}
        <div className="relative md:hidden">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`transition-all duration-300 absolute inset-0 ${
                index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <FeatureCard
                title={feature.title}
                icon={feature.icon}
                description={feature.description}
              />
            </div>
          ))}
          
          <div className="h-72"></div> {/* Spacer to maintain height */}
          
          <div className="flex justify-center gap-2 mt-6">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === activeIndex ? 'bg-finflow-blue' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Carousel */}
        <div 
          ref={carouselRef}
          className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.7 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <FeatureCard
                title={feature.title}
                icon={feature.icon}
                description={feature.description}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

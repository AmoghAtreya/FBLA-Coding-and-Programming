
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeatureSectionProps {
  id?: string;
  title: string;
  description: string;
  imageSrc: string;
  isImageLeft: boolean;
  buttonText: string;
  onButtonClick: () => void;
  bgColor?: string;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({ 
  id,
  title, 
  description, 
  imageSrc, 
  isImageLeft, 
  buttonText,
  onButtonClick,
  bgColor = 'bg-white'
}) => {
  return (
    <section id={id} className={`py-20 px-6 ${bgColor}`}>
      <div className="max-w-[1280px] mx-auto">
        <div className={`flex flex-col ${isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}>
          <motion.div 
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: isImageLeft ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <img 
              src={imageSrc} 
              alt={title}
              className="w-full rounded-lg shadow-lg"
            />
          </motion.div>
          
          <motion.div 
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: isImageLeft ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-4xl font-bold mb-6">{title}</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              {description}
            </p>
            <Button 
              onClick={onButtonClick}
              className="bg-black hover:bg-gray-800 text-white px-8 py-4"
            >
              {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

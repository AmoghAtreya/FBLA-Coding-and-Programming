
import React from 'react';
import { motion } from 'framer-motion';

interface StatisticCardProps {
  value: string;
  label: string;
  bgColor?: string;
  textColor?: string;
  icon?: React.ReactNode;
  delay?: number;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({ 
  value, 
  label, 
  bgColor = 'bg-blue-50', 
  textColor = 'text-finflow-blue',
  icon,
  delay = 0
}) => {
  return (
    <motion.div 
      className={`${bgColor} rounded-xl p-8 text-center`}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {icon && <div className="flex justify-center mb-4">{icon}</div>}
      <motion.h3 
        className={`text-4xl md:text-5xl font-bold ${textColor} mb-2`}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.4 }}
        viewport={{ once: true }}
      >
        {value}
      </motion.h3>
      <p className="text-gray-600">{label}</p>
    </motion.div>
  );
};

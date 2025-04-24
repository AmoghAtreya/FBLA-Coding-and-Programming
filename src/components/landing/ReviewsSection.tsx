
import React from 'react';
import { motion } from 'framer-motion';

interface StatisticProps {
  number: string;
  caption: string;
  icon?: string;
}

const Statistic: React.FC<StatisticProps> = ({ number, caption, icon }) => {
  return (
    <motion.div 
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="flex items-center mb-2">
        {icon && <img src={icon} alt="" className="h-6 mr-2" />}
        <span className="text-4xl md:text-5xl font-bold">{number}</span>
      </div>
      <p className="text-gray-600">{caption}</p>
    </motion.div>
  );
};

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-[1280px] mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h3 className="text-xl text-finflow-blue font-medium mb-3">TRUSTED BY STUDENTS</h3>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            "Definitely one of the most beneficial apps<br/>
            for students, FinFlow has a lot to offer."
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            className="bg-white p-10 rounded-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="mb-4">
              <span className="text-gray-600">Editors' Choice</span>
            </div>
            <h3 className="text-5xl font-bold mb-2">4.8★</h3>
            <p className="text-gray-600">
              Editor's Choice<br/>
              on the App Store
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white p-10 rounded-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Apple-logo.png" alt="Apple App Store" className="h-8 mx-auto mb-4" />
            <h3 className="text-5xl font-bold mb-2">1.2m+</h3>
            <p className="text-gray-600">
              Apple App Store<br/>
              reviews
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white p-10 rounded-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play Store" className="h-8 mx-auto mb-4" />
            <h3 className="text-5xl font-bold mb-2">940k+</h3>
            <p className="text-gray-600">
              Google Play Store<br/>
              reviews
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

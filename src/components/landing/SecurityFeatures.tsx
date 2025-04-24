
import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Bell, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SecurityFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  imageSrc: string;
}

const SecurityFeature: React.FC<SecurityFeatureProps> = ({ icon, title, description, imageSrc }) => {
  return (
    <motion.div 
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="mb-6 relative h-48 w-full overflow-hidden rounded-xl">
        <img 
          src={imageSrc} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {icon && (
          <div className="absolute bottom-4 left-4 bg-white/90 p-2 rounded-lg">
            {icon}
          </div>
        )}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-3 max-w-xs">{description}</p>
      <Link to="/faq" className="text-finflow-blue font-medium hover:underline">Learn more</Link>
    </motion.div>
  );
};

export const SecurityFeatures: React.FC = () => {
  const features = [
    {
      icon: <Bell className="h-6 w-6 text-finflow-blue" />,
      title: "Real-time notifications",
      description: "Review suspicious activity by confirming details only you would know.",
      imageSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: <Lock className="h-6 w-6 text-finflow-blue" />,
      title: "Privacy controls",
      description: "Control what you share with others and who can send you requests.",
      imageSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-finflow-blue" />,
      title: "24/7 fraud prevention",
      description: "Fight fraud before it can happen with security checks and alerts.",
      imageSrc: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80"
    },
  ];

  return (
    <section id="security" className="py-20 px-6 bg-white">
      <div className="max-w-[1280px] mx-auto">
        <motion.h2 
          className="text-2xl md:text-3xl font-semibold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          FinFlow's secure platform provides additional layers of security<br className="hidden md:block" />
          and 24/7 fraud monitoring to protect you and your money.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <SecurityFeature 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              imageSrc={feature.imageSrc}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

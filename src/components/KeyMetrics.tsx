
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import useEmblaCarousel from 'embla-carousel-react';

const metrics = [
  {
    title: "Active Students",
    value: "250000",
    description: "Building careers on our platform",
    icon: "👥",
    isPercentage: false
  },
  {
    title: "Universities",
    value: "50",
    description: "Partner institutions worldwide",
    icon: "🎓",
    isPercentage: false
  },
  {
    title: "Success Rate",
    value: "92",
    description: "Students achieving their goals",
    icon: "📈",
    isPercentage: true
  },
  {
    title: "Total Savings",
    value: "2000000",
    description: "Saved by our students",
    icon: "💰",
    prefix: "$",
    isPercentage: false
  },
  {
    title: "Job Placements",
    value: "150",
    description: "Successful career transitions",
    icon: "💼",
    isPercentage: false
  },
  {
    title: "Student Satisfaction",
    value: "96",
    description: "Would recommend to friends",
    icon: "⭐",
    isPercentage: true
  }
];

const CountUp = ({ end, prefix = '', isPercentage = false }: { end: number; prefix?: string; isPercentage?: boolean }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    const interval = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [end]);

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${prefix}${(value / 1000000).toFixed(1)}M+`;
    }
    if (value >= 1000) {
      return `${prefix}${(value / 1000).toFixed(0)}K+`;
    }
    return isPercentage ? `${value}%` : `${prefix}${value}`;
  };

  return <span>{formatValue(count)}</span>;
};

export const KeyMetrics = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
  });

  React.useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        setActiveIndex(emblaApi.selectedScrollSnap());
      };
      
      emblaApi.on('select', onSelect);
      
      return () => {
        emblaApi.off('select', onSelect);
      };
    }
  }, [emblaApi]);

  return (
    <div className="w-full py-12 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Achievements</h2>
        <p className="text-lg text-gray-600">Making an impact in the tech industry through education and connection</p>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-center mb-6 gap-2">
          {metrics.map((_, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{
                scale: index === activeIndex ? 1.2 : 1,
                backgroundColor: index === activeIndex ? '#2563EB' : '#D1D5DB'
              }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 300
              }}
              className="h-2 w-2 rounded-full cursor-pointer"
              onClick={() => emblaApi?.scrollTo(index)}
            />
          ))}
        </div>

        <Carousel
          ref={emblaRef}
          className="w-full"
          opts={{
            align: 'center',
            loop: true,
          }}
        >
          <CarouselContent>
            {metrics.map((metric, index) => (
              <CarouselItem key={index} className="basis-full sm:basis-full md:basis-full lg:basis-full pl-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-2"
                >
                  <Card className="p-8 bg-white shadow-lg hover:shadow-xl transition-shadow text-center">
                    <div className="text-5xl mb-6">{metric.icon}</div>
                    <h3 className="text-2xl font-semibold mb-3">{metric.title}</h3>
                    <div className="text-4xl font-bold text-finflow-blue mb-3">
                      <CountUp end={parseInt(metric.value)} prefix={metric.prefix || ''} isPercentage={metric.isPercentage} />
                    </div>
                    <p className="text-gray-600 text-lg">{metric.description}</p>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="h-12 w-12 -left-6 bg-white border-2 border-finflow-blue text-finflow-blue hover:bg-finflow-blue hover:text-white rounded-full" />
          <CarouselNext className="h-12 w-12 -right-6 bg-white border-2 border-finflow-blue text-finflow-blue hover:bg-finflow-blue hover:text-white rounded-full" />
        </Carousel>
      </div>
    </div>
  );
};

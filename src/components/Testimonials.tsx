import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const testimonials = [
  {
    name: "Alice Johnson",
    role: "Software Engineer at TechCorp",
    image: "https://i.pravatar.cc/150?img=1",
    quote: "The career opportunities here have been life-changing!"
  },
  {
    name: "Mark Wilson",
    role: "Data Analyst at FinTech",
    image: "https://i.pravatar.cc/150?img=2",
    quote: "Thanks to FinFlow, I landed my dream job."
  },
  {
    name: "Sophia Lee",
    role: "Marketing Specialist at AdWorld",
    image: "https://i.pravatar.cc/150?img=3",
    quote: "FinFlow helped me prepare for a bright future."
  },
  {
    name: "David Chen",
    role: "Product Manager at InnovateTech",
    image: "https://i.pravatar.cc/150?img=4",
    quote: "The mentorship program was invaluable for my career growth."
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer at CreativeLab",
    image: "https://i.pravatar.cc/150?img=5",
    quote: "The community support here is amazing!"
  },
  {
    name: "James Kim",
    role: "Frontend Developer at WebTech",
    image: "https://i.pravatar.cc/150?img=6",
    quote: "Best career decision I've ever made."
  },
  {
    name: "Sarah Thompson",
    role: "Data Scientist at AICore",
    image: "https://i.pravatar.cc/150?img=7",
    quote: "The learning resources are exceptional."
  }
];

export const Testimonials = () => {
  const [emblaRef] = useEmblaCarousel(
    { loop: true }, 
    [Autoplay({ delay: 3000 })]
  );

  return (
    <div className="w-full py-16 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Alumni Say</h2>
      </motion.div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex-[0_0_100%] min-w-0 pl-4"
            >
              <Card className="p-6 mx-4 bg-white shadow-lg">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-20 h-20 mb-4">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <p className="text-lg italic mb-4">{testimonial.quote}</p>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

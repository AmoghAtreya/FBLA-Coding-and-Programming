import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe, Menu, X, Shield, BarChart2, Smartphone, Zap, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CircularGallery from '@/components/CircularGallery';


const LandingNew = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const phoneFloat = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white overflow-hidden relative">
      {/* Geometric Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Large geometric shapes */}
        <div className="absolute top-20 right-20 w-96 h-96 border border-gray-700/30 rotate-45 rounded-3xl"></div>
        <div className="absolute bottom-40 left-10 w-64 h-64 border border-gray-600/20 rotate-12 rounded-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-r from-gray-700/10 to-gray-800/10 rotate-45 rounded-lg"></div>
        
        {/* Dot pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Geometric lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Navigation Header */}
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/95 backdrop-blur-lg' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="text-2xl font-bold text-white flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">A</span>
              </div>
              <span>Ahlan.</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <motion.a 
                onClick={() => scrollToSection('features')} 
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                Features
              </motion.a>
              <motion.a 
                onClick={() => scrollToSection('faq')} 
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                FAQ
              </motion.a>
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
              >
                Dashboard
              </Link>
              <Link
                to="/landing"
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
              >
                Original Landing
              </Link>
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center space-x-4">
              <motion.div 
                className="flex items-center space-x-2 text-gray-300 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Globe size={14} />
                <span>EN</span>
                <ChevronDown size={14} />
              </motion.div>
              
              <motion.button 
                className="text-gray-300 hover:text-white transition-colors text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Link to="/auth" className="text-gray-300 hover:text-white">log in</Link>
              </motion.button>
              
              <motion.button 
                className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md transition-colors text-sm font-medium"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Link to="/auth" className="text-white">Register</Link>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                className="md:hidden mt-4 pb-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col space-y-4">
                  <a onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white transition-colors text-sm cursor-pointer">
                    Features
                  </a>
                  <a onClick={() => scrollToSection('faq')} className="text-gray-300 hover:text-white transition-colors text-sm cursor-pointer">
                    FAQ
                  </a>
                  <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Dashboard
                  </Link>
                  <Link to="/landing" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Original Landing
                  </Link>
                  <div className="flex items-center space-x-4 pt-4 border-t border-gray-700">
                    <Link to="/auth" className="text-gray-300 hover:text-white text-sm">log in</Link>
                    <Link to="/auth" className="bg-green-600 px-4 py-2 rounded-md text-sm text-white">Register</Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Hero Background Pattern */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1/2 h-full pointer-events-none">
          <div className="relative w-full h-full">
            {/* Large geometric shapes behind text */}
            <div className="absolute top-20 left-20 w-80 h-80 border border-gray-600/20 rotate-12 rounded-3xl"></div>
            <div className="absolute bottom-20 left-10 w-60 h-60 bg-gradient-to-br from-gray-700/10 to-gray-800/5 rotate-45 rounded-2xl"></div>
            <div className="absolute top-40 left-40 w-40 h-40 border border-gray-500/15 rotate-45 rounded-xl"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <motion.div 
            className="space-y-8"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.h1 
              className="text-5xl lg:text-6xl font-bold leading-tight"
              variants={fadeInUp}
            >
              This Is A New Era<br />
              <span className="text-green-400">Money Is Always</span><br />
              In Your Mobile <span className="text-green-400">+</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-300 max-w-lg leading-relaxed"
              variants={fadeInUp}
            >
              Now is not the time for you to be confused when making purchases online or making purchases abroad
            </motion.p>
            
            <motion.div 
              className="flex items-center space-x-6"
              variants={fadeInUp}
            >
              <motion.button 
                className="bg-green-600 hover:bg-green-500 px-8 py-3 rounded-md text-base font-medium transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to="/auth" className="text-white">Get Started</Link>
              </motion.button>
              
              <div className="flex items-center space-x-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-9 h-9 rounded-full bg-gradient-to-r from-green-400 to-blue-500 border-2 border-black"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.05 }}
                    />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">Active Users</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Phone Mockups */}
          <motion.div 
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="relative">
              {/* Main Phone */}
              <motion.div 
                className="relative z-20"
                animate={{ y: [-3, 3, -3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-64 h-[520px] bg-gradient-to-b from-gray-700 to-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-green-600 rounded-[2.2rem] p-6 flex flex-col relative overflow-hidden">
                    {/* Status bar */}
                    <div className="flex justify-between items-center text-white mb-8">
                      <span className="text-sm font-medium">9:41</span>
                      <div className="flex space-x-1 items-center">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                        <div className="w-4 h-2 bg-white rounded-sm ml-1"></div>
                        <div className="w-5 h-2 bg-white rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* Transfer UI */}
                    <div className="text-center text-white mb-6">
                      <h3 className="text-lg font-semibold mb-3">Transfer</h3>
                      <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full"></div>
                      </div>
                      <p className="text-sm mb-2 opacity-90">You have successfully sent</p>
                      <p className="text-3xl font-bold">$ 540.00</p>
                    </div>
                    
                    {/* User info card */}
                    <div className="bg-white/10 rounded-xl p-4 mb-6 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-white/30 rounded-full"></div>
                          <div>
                            <p className="text-white text-sm font-medium">Ahmed</p>
                            <p className="text-white/70 text-xs">Michael Expatrio</p>
                          </div>
                        </div>
                        <button className="bg-white/20 px-3 py-1 rounded-lg text-xs font-medium">More</button>
                      </div>
                    </div>
                    
                    {/* Transaction details */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-white text-sm">
                        <span className="opacity-80">Sent to</span>
                        <span className="font-medium">Michael Expatrio</span>
                      </div>
                      <div className="flex justify-between text-white text-sm">
                        <span className="opacity-80">Money sent</span>
                        <span className="font-medium">$ 540.00</span>
                      </div>
                      <div className="text-white text-xs opacity-80 text-center mt-4">
                        Don't worry, you are not taxed 👌
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Secondary Phone */}
              <motion.div 
                className="absolute -left-24 top-12 z-10"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <div className="w-48 h-80 bg-gradient-to-b from-gray-700 to-gray-900 rounded-[2rem] p-3 shadow-xl">
                  <div className="w-full h-full bg-gray-800 rounded-[1.5rem] p-4 flex flex-col justify-center">
                    <div className="text-white text-center">
                      <div className="text-2xl font-bold mb-2">$ 540.00</div>
                      <p className="text-xs text-gray-400 mb-4">Available Balance</p>
                      <div className="w-full h-1 bg-gray-700 rounded-full mb-2">
                        <div className="w-3/4 h-1 bg-green-500 rounded-full"></div>
                      </div>
                      <p className="text-xs text-gray-400">75% of goal reached</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Third Phone (Background) */}
              <motion.div 
                className="absolute -right-16 top-20 z-0"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <div className="w-40 h-72 bg-gradient-to-b from-gray-600 to-gray-800 rounded-[1.5rem] p-2 shadow-lg opacity-60">
                  <div className="w-full h-full bg-gray-800 rounded-[1.2rem] p-3">
                    <div className="text-white text-center text-xs">
                      <div className="font-bold mb-2">Transactions</div>
                      <div className="space-y-1">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex justify-between text-xs">
                            <span>Item {i}</span>
                            <span>-${20 + i * 10}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Partner Logos */}
        {/* <motion.div 
          className="absolute bottom-20 left-0 right-0 z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-center space-x-12 items-center opacity-30">
              {['Razorpay', 'Grammarly', 'Booking.com', 'Spotify'].map((brand, index) => (
                <motion.div
                  key={brand}
                  className="text-gray-500 font-medium text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ delay: 1.7 + index * 0.1 }}
                >
                  {brand}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div> */}
      </section>

      {/* Features Section with phone and floating rectangles */}
      <section className="py-20 bg-white text-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Phone with floating rectangles */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative flex justify-center">
                {/* Main Phone */}
                <motion.div
                  className="w-80 h-[600px] bg-black rounded-[3rem] p-6 shadow-2xl relative z-10"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-full h-full bg-green-600 rounded-[2.5rem] flex items-center justify-center relative overflow-hidden">
                    <div className="text-white text-center z-10">
                      <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white rounded-full"></div>
                      </div>
                      <p className="text-xl font-bold mb-2">$ 540.00</p>
                      <p className="text-sm opacity-80">Transfer Complete</p>
                    </div>
                  </div>
                </motion.div>
                
                {/* Floating Rectangle Cards */}
                <motion.div
                  className="absolute -right-8 top-16 w-32 h-20 bg-white rounded-lg shadow-lg p-3 z-20"
                  initial={{ opacity: 0, x: 20, rotateY: -15 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                >
                  <div className="text-green-600 text-xs font-semibold mb-1">Recent</div>
                  <div className="text-gray-800 text-sm font-bold">+$2,500</div>
                  <div className="text-gray-500 text-xs">Transfer</div>
                </motion.div>

                <motion.div
                  className="absolute -left-8 top-32 w-28 h-18 bg-white rounded-lg shadow-lg p-3 z-20"
                  initial={{ opacity: 0, x: -20, rotateY: 15 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, rotateY: -5 }}
                >
                  <div className="text-blue-600 text-xs font-semibold mb-1">Balance</div>
                  <div className="text-gray-800 text-sm font-bold">$8,350</div>
                </motion.div>

                <motion.div
                  className="absolute -right-6 bottom-24 w-30 h-16 bg-white rounded-lg shadow-lg p-3 z-20"
                  initial={{ opacity: 0, x: 20, rotateY: -15 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                >
                  <div className="text-purple-600 text-xs font-semibold mb-1">Goal</div>
                  <div className="text-gray-800 text-sm font-bold">85%</div>
                </motion.div>

                <motion.div
                  className="absolute -left-6 bottom-32 w-24 h-14 bg-white rounded-lg shadow-lg p-2 z-20"
                  initial={{ opacity: 0, x: -20, rotateY: 15 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, rotateY: -5 }}
                >
                  <div className="text-orange-600 text-xs font-semibold mb-1">Saved</div>
                  <div className="text-gray-800 text-xs font-bold">$1,200</div>
                </motion.div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-green-500/20 rounded-[3rem] blur-3xl scale-110 -z-10"></div>
              </div>
            </motion.div>

            {/* Right side - Features */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {[
                {
                  number: "1",
                  title: "Transaction Without Worry Easily And Safely",
                  description: "We use the latest technology, we always maintain the security of transactions that are carried out on our service"
                },
                {
                  number: "2", 
                  title: "Suitable For Ordinary People To Companies",
                  description: "We are built around you, you must make the right platform. Ahlan can solve problems"
                },
                {
                  number: "3",
                  title: "Why Do You Have To Choose And Use Ahlan?",
                  description: "Ahlan is here to help you with payments and finances. We are there for you!"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex space-x-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      {feature.number}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Features Gallery */}
      <section id="features" className="py-20 bg-gradient-to-br from-gray-800 via-gray-900 to-black relative">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Powerful features designed specifically for modern financial management
            </p>
            <p className="text-sm text-gray-400">
              Scroll or drag to explore our features
            </p>
          </motion.div>

          {/* Interactive 3D Gallery */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div style={{ height: '600px', position: 'relative' }}>
              <CircularGallery 
                bend={0} 
                textColor="#ffffff" 
                borderRadius={0.05}
                items={[
                  { 
                    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80",
                    text: "Bank-Level Security"
                  },
                  { 
                    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
                    text: "Smart Analytics"
                  },
                  { 
                    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
                    text: "Mobile First Design"
                  },
                  { 
                    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
                    text: "Instant Transfers"
                  },
                  { 
                    image: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=800&q=80",
                    text: "Global Payments"
                  },
                  { 
                    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
                    text: "24/7 Customer Support"
                  },
                  { 
                    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
                    text: "Real-time Notifications"
                  },
                  { 
                    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
                    text: "Advanced Budgeting"
                  }
                ]}
              />
            </div>
          </motion.div>

          {/* Feature Details */}
          <motion.div 
            className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: Shield,
                title: 'Bank-Level Security',
                description: 'Your money is protected with industry-leading encryption and security protocols.',
              },
              {
                icon: BarChart2,
                title: 'Smart Analytics',
                description: 'Get detailed insights into your spending patterns with AI-powered analytics.',
              },
              {
                icon: Smartphone,
                title: 'Mobile First Design',
                description: 'Manage your finances on-the-go with our intuitive mobile app.',
              },
              {
                icon: Zap,
                title: 'Instant Transfers',
                description: 'Send and receive money instantly with zero fees for verified users.',
              },
              {
                icon: Globe,
                title: 'Global Payments',
                description: 'Send money anywhere in the world with competitive exchange rates.',
              },
              {
                icon: Check,
                title: '24/7 Customer Support',
                description: 'Get help whenever you need it with our round-the-clock customer support.',
              },
              {
                icon: ChevronDown,
                title: 'Real-time Notifications',
                description: 'Stay updated with instant alerts for all your transactions and account activities.',
              },
              {
                icon: BarChart2,
                title: 'Advanced Budgeting',
                description: 'Create intelligent budgets that adapt to your spending patterns and help you save.',
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-lg mx-auto"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </motion.div>
                
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-20 bg-white text-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <p className="text-sm text-gray-600 uppercase tracking-wide font-medium">
                  ARE YOU STILL CONFUSED ABOUT YOUR PAYMENTS AND FINANCES? AHLAN IS HERE FOR YOU
                </p>
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Ahlan Is Here To Help You<br />
                  With Payments And Finances.<br />
                  <span className="text-green-600">We Are There For You!</span>
                </h2>
              </div>
              
              <motion.div
                className="mt-12 space-y-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                viewport={{ once: true }}
              >
                {[
                  {
                    icon: "🎯",
                    title: "You Are Not Charged Taxes For Each Transaction",
                    description: "Get more money, you will not be charged fees or taxes for the transactions you make. It will be right for you to transact with us"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex space-x-4 p-6 bg-gray-50 rounded-xl"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-3xl">{item.icon}</div>
                    <div>
                      <h3 className="font-semibold mb-2 text-lg">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Phone */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <motion.div
                  className="w-80 h-[600px] bg-black rounded-[3rem] p-6 mx-auto shadow-2xl"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-full h-full bg-gray-800 rounded-[2.5rem] p-6 flex flex-col justify-center">
                    <div className="text-white text-center space-y-6">
                      <div className="text-5xl font-bold">$ 8,350.00</div>
                      <p className="text-gray-400">Available Balance</p>
                      
                      {/* Progress indicators */}
                      <div className="space-y-3 mt-8">
                        <div className="flex justify-between text-sm">
                          <span>Monthly Goal</span>
                          <span>85%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full">
                          <div className="w-5/6 h-2 bg-green-600 rounded-full"></div>
                        </div>
                      </div>
                      
                      <div className="bg-green-600 text-white py-3 px-6 rounded-lg mt-8 font-medium hover:bg-green-500 transition-colors cursor-pointer">
                        Widget Action
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-green-500/10 rounded-[3rem] blur-3xl scale-110 -z-10"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-800 via-gray-900 to-black relative">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-12">
              Use Ahlan On Our Website<br />
              <span className="text-green-400">Or Get The Mobile App</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                { number: "32k", description: "More than 32k people use Ahlan" },
                { number: "10k+", description: "10k+ people download the app" },
                { number: "40k+", description: "40k+ people helped" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-5xl font-bold text-green-400 mb-2 group-hover:text-green-300 transition-colors">{stat.number}</div>
                  <p className="text-gray-400">{stat.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Desktop/Laptop Mockup */}
            <motion.div
              className="relative max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="bg-gray-800 rounded-t-3xl p-6 shadow-2xl">
                <div className="flex space-x-3 mb-6">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
                <div className="bg-white rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
                  <div className="text-gray-900 text-center z-10">
                    <div className="text-6xl mb-4">🌙</div>
                    <h3 className="text-3xl font-bold mb-2">Ahlan Dashboard</h3>
                    <p className="text-gray-600 text-lg">Your financial command center</p>
                  </div>
                  
                  {/* Floating UI elements */}
                  <motion.div
                    className="absolute top-8 left-8 w-32 h-20 bg-green-100 rounded-lg flex items-center justify-center"
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <span className="text-green-600 font-bold">$2,500</span>
                  </motion.div>
                  
                  <motion.div
                    className="absolute bottom-8 right-8 w-24 h-16 bg-blue-100 rounded-lg flex items-center justify-center"
                    animate={{ y: [2, -2, 2] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <span className="text-blue-600 font-bold">85%</span>
                  </motion.div>
                </div>
              </div>
              <div className="bg-gray-700 h-8 rounded-b-3xl shadow-lg"></div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-green-500/5 rounded-3xl blur-3xl scale-110 -z-10"></div>
            </motion.div>

            {/* App Download Section */}
            <motion.div
              className="mt-16 p-8 bg-gray-900 rounded-2xl border border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Get Ahlan Your Mobile Application</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  className="bg-black text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>📱</span>
                  <span>Download for iOS</span>
                </motion.button>
                <motion.button
                  className="bg-black text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>🤖</span>
                  <span>Download for Android</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white relative">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Common Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about Ahlan
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-6">
              {[
                {
                  question: "What is Ahlan?",
                  answer: "Ahlan is a comprehensive financial management platform designed for modern users. It helps you manage payments, track transactions, and build healthy financial habits with advanced security features."
                },
                {
                  question: "Is Ahlan free to use?",
                  answer: "Yes, Ahlan's core features are completely free for regular users. We offer premium features for advanced users, but you can accomplish most financial management tasks with our free plan."
                },
                {
                  question: "How secure is my financial data?",
                  answer: "We use bank-level encryption and security measures to protect your data. Your information is never shared with third parties, and you maintain full control over your financial data. We implement industry-standard security protocols."
                },
                {
                  question: "Can I connect my bank account?",
                  answer: "Yes, Ahlan supports secure connections to thousands of financial institutions. We use industry-standard security protocols to ensure your banking information remains safe and encrypted."
                },
                {
                  question: "Are there any transaction fees?",
                  answer: "No, Ahlan prides itself on zero transaction fees for most operations. You won't be charged fees or taxes for standard transactions, making it cost-effective for your financial management."
                },
                {
                  question: "How do I get started?",
                  answer: "Getting started is simple! Just click the 'Get Started' button, create your account, and you'll be guided through our easy setup process. You can start managing your finances within minutes."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <AccordionItem 
                    value={`item-${index}`} 
                    className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl shadow-lg border border-gray-200 px-6 overflow-hidden group hover:shadow-xl hover:border-green-500/50 transition-all duration-300"
                  >
                    <AccordionTrigger className="text-left text-lg font-semibold py-6 text-gray-900 group-hover:text-green-600 transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 pb-6 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>

            <motion.div 
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all shadow-xl hover:shadow-green-500/25">
                  <Link to="/auth" className="text-white">Get Started Now →</Link>
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center space-x-2">
                <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                  <span className="text-black font-bold text-sm">A</span>
                </div>
                <span>Ahlan.</span>
              </h3>
              <p className="text-gray-400 text-sm">Modern financial solutions for the digital age.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Analytics</li>
                <li>Planning</li>
                <li>Collaboration</li>
                <li>Data Management</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Customer Stories</li>
                <li>Strategic Finance</li>
                <li>Resource Library</li>
                <li>Product & Vision</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Financial Close</li>
                <li>Accounting & CFOs</li>
                <li>Revenue Operations</li>
                <li>Strategic Finance</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; 2024 Ahlan. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingNew; 
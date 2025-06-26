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
import AppleCardsCarouselDemo from '@/components/apple-cards-carousel-demo';


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
    <div className="min-h-screen text-white overflow-hidden relative" style={{ backgroundColor: '#181818' }}>
      {/* Top Left Light Effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at 10% 10%, rgba(57, 57, 57, 0.4) 0%, transparent 45%)`
        }}
      />
      
      {/* Geometric Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Large geometric shapes */}
        <div className="absolute top-20 right-20 w-96 h-96 border border-gray-700/20 rotate-45 rounded-3xl"></div>
        <div className="absolute bottom-40 left-10 w-64 h-64 border border-gray-600/15 rotate-12 rounded-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-r from-gray-700/5 to-gray-800/5 rotate-45 rounded-lg"></div>
        
        {/* Dot pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 90)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Geometric lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Navigation Header */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50"
        style={{ 
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1f1f1f 100%)',
          backgroundColor: '#1a1a1a'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Navigation Combined */}
            <div className="flex items-center space-x-8">
            {/* Logo */}
            <motion.div 
                className="text-xl font-bold flex items-center space-x-2 text-white"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
                <div className="w-7 h-7 bg-white rounded flex items-center justify-center">
                  <span className="text-black font-bold text-sm">A</span>
              </div>
              <span>Armo.</span>
            </motion.div>

            {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
              <motion.a 
                onClick={() => scrollToSection('features')} 
                  className="text-base cursor-pointer font-medium transition-colors duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #e0e0e0 0%, #ffffff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                whileHover={{ scale: 1.05 }}
              >
                Features
              </motion.a>
              <motion.a 
                onClick={() => scrollToSection('faq')} 
                  className="text-base cursor-pointer font-medium transition-colors duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #e0e0e0 0%, #ffffff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                whileHover={{ scale: 1.05 }}
              >
                FAQ
              </motion.a>
              <Link
                to="/dashboard"
                  className="text-base font-medium transition-colors duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #e0e0e0 0%, #ffffff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
              >
                Dashboard
              </Link>
              <Link
                to="/landing"
                  className="text-base font-medium transition-colors duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #e0e0e0 0%, #ffffff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
              >
                Original Landing
              </Link>
              </div>
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center space-x-6">
              <motion.div 
                className="flex items-center space-x-1 text-white text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Globe size={16} className="text-white" />
                <span className="font-medium">EN</span>
              </motion.div>
              
              <motion.button 
                className="text-white hover:text-gray-200 transition-colors text-sm font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Link 
                  to="/auth" 
                  className="text-white hover:text-gray-200"
                >
                  Login
                </Link>
              </motion.button>
              
              <motion.button 
                className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded text-sm font-medium text-white transition-colors"
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
                    <Link to="/auth" className="px-4 py-2 rounded-md text-sm text-white" style={{ backgroundColor: '#9fd1b5' }}>Register</Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-5 overflow-hidden">
        {/* Hero Background Pattern */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1/2 h-full pointer-events-none">
          <div className="relative w-full h-full">
            {/* Large geometric shapes behind text */}
            <div className="absolute top-20 left-20 w-80 h-80 border border-gray-600/15 rotate-12 rounded-3xl"></div>
            <div className="absolute bottom-20 left-10 w-60 h-60 bg-gradient-to-br from-gray-700/5 to-gray-800/3 rotate-45 rounded-2xl"></div>
            <div className="absolute top-40 left-40 w-40 h-40 border border-gray-500/10 rotate-45 rounded-xl"></div>
          </div>
        </div>

        <div className="w-full relative z-10">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              className="space-y-8"
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              <motion.h1 
                className="text-7xl lg:text-7xl font-bold leading-tight text-left mb-8"
                variants={fadeInUp}
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%,rgb(84, 84, 84) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                This Is A New Era<br />
                Money Is Always<br />
                In Your Mobile +
              </motion.h1>
              
              <motion.p 
                className="text-lg text-left leading-relaxed mb-8 max-w-lg text-gray-300"
                variants={fadeInUp}
              ><br />
                Now is not the time for you to be confused when making purchases online or making purchases abroad
                <br /> <br />
              </motion.p>
              
              <motion.div 
                className="flex items-center space-x-6"
                variants={fadeInUp}
              >
                <motion.button 
                  className="px-8 py-3 rounded-md text-base font-medium transition-colors duration-300"
                  style={{ backgroundColor: '#9fd1b5' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to="/auth" className="text-black">Get Started</Link>
                </motion.button>
                
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    {[
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                      "https://media.istockphoto.com/id/96333863/photo/retro-dude.jpg?s=612x612&w=0&k=20&c=L9_H1c8MP41PGEcg36VEakeMoVC8uf1Jq5hs-NErQ0k=&fit=crop&crop=face", 
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
                    ].map((imageUrl, i) => (
                      <motion.div
                        key={i}
                        className="w-11 h-11 rounded-full border-2 border-black overflow-hidden"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 + i * 0.05 }}
                      >
                        <img 
                          src={imageUrl} 
                          alt={`User ${i + 1}`}
                          className="w-full h-full object-cover"
                      />
                      </motion.div>
                    ))}
                  </div>
                  <span className="text-sm text-white-300">
                    Active Users
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - iPhone Image */}
            <motion.div 
              className="relative flex justify-end lg:justify-end"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="relative w-full h-full flex justify-end" style={{ transform: 'translateX(30%)' }}>
                                  <motion.img 
                    src="/iphone.png" 
                    alt="iPhone App Preview"
                    className="w-full h-auto object-contain relative z-10"
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    style={{ 
                      filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.3))',
                      height: 'calc(100vh + 50px)',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      transform: 'scale(1.6)',
                      minWidth: '800px'
                    }}
                />
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-black-500/5 rounded-9xl blur-3xl scale-100 -z-10"></div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Grey divider at bottom to cut off image */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-16 z-20"
          style={{ backgroundColor: '#404040' }}
        />
      </section>

      {/* Divider Bar */}
      <div className="w-full h-px" style={{ backgroundColor: '#262626' }}></div>

      {/* Features Section with phone and floating rectangles */}
      <section className="py-20 bg-white text-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - iPhone Image with floating rectangles */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative flex justify-center">
                {/* Main iPhone */}
                <motion.img
                  src="/iphone2.png"
                  alt="iPhone App Preview 2"
                  className="w-[480px] h-auto object-contain relative z-5"
                  whileHover={{ scale: 1.07 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{ 
                    filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.3))',
                    maxHeight: '800px',
                    transform: 'scale(1.3)'
                  }}
                />
                
                {/* Floating Rectangle Cards */}
                <motion.div
                  className="absolute right-8 top-16 w-32 h-20 bg-white rounded-lg shadow-xl p-3 z-50"
                  initial={{ opacity: 0, x: 20, rotateY: -15 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)' }}
                >
                  <div className="text-green-600 text-xs font-semibold mb-1">Recent</div>
                  <div className="text-gray-800 text-sm font-bold">-$540.00</div>
                  <div className="text-gray-500 text-xs">Transfer</div>
                </motion.div>

                <motion.div
                  className="absolute left-8 top-32 w-28 h-18 bg-white rounded-lg shadow-xl p-3 z-50"
                  initial={{ opacity: 0, x: -20, rotateY: 15 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, rotateY: -5 }}
                  style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)' }}
                >
                  <div className="text-blue-600 text-xs font-semibold mb-1">Balance</div>
                  <div className="text-gray-800 text-sm font-bold">$8,350</div>
                </motion.div>

                <motion.div
                  className="absolute right-12 bottom-24 w-30 h-16 bg-white rounded-lg shadow-xl p-3 z-50"
                  initial={{ opacity: 0, x: 20, rotateY: -15 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)' }}
                >
                  <div className="text-purple-600 text-xs font-semibold mb-1">Goal</div>
                  <div className="text-gray-800 text-sm font-bold">85%</div>
                </motion.div>

                <motion.div
                  className="absolute left-12 bottom-32 w-24 h-14 bg-white rounded-lg shadow-xl p-2 z-50"
                  initial={{ opacity: 0, x: -20, rotateY: 15 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, rotateY: -5 }}
                  style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)' }}
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
                  description: "We are built around you, you must make the right platform. Armo. can solve problems"
                },
                {
                  number: "3",
                  title: "Why Do You Have To Choose And Use Armo.?",
                  description: "Armo. is here to help you with payments and finances. We are there for you!"
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
      <section id="features" className="py-20 relative" style={{ backgroundColor: '#181818' }}>
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Full Width Container - Remove max-width constraint */}
        <div className="w-full relative z-10">
          {/* Apple Cards Carousel */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <AppleCardsCarouselDemo />
          </motion.div>

          {/* Feature Details - Back to constrained container for text content */}
          <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
              {/* ... existing feature items ... */}
          </motion.div>
          </div>
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
                  ARE YOU STILL CONFUSED ABOUT YOUR PAYMENTS AND FINANCES? ARMO. IS HERE FOR YOU
                </p>
                <h2 
                  className="text-4xl lg:text-5xl font-bold leading-tight"

                >
                  Armo. Is Here To Help You<br />
                  With Payments And Finances.<br />
                  <span 
                  // style={{
                  //   background: 'linear-gradient(135deg, #9fd1b5 0%, #7bc299 50%, #5ab380 100%)',
                  //   WebkitBackgroundClip: 'text',
                  //   WebkitTextFillColor: 'transparent',
                  //   backgroundClip: 'text'
                  // }}
                  >We Are There For You!</span>
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

            {/* Right Content - iPhone Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative flex justify-center">
                <motion.img
                  src="/iphone3.png"
                  alt="iPhone App Preview 3"
                  className="w-[640px] h-auto object-contain mx-auto"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{ 
                    filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.3))',
                    maxHeight: '1200px',
                    transform: 'scale(2)'
                  }}
                />
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-green-500/10 rounded-3xl blur-3xl scale-110 -z-10"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

 

      {/* FAQ Section */}
      <section id="faq" className="py-20 relative" style={{ backgroundColor: '#181818' }}>
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Common Questions
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to know about Armo.
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
                  question: "What is Armo.?",
                  answer: "Armo. is a comprehensive financial management platform designed for modern users. It helps you manage payments, track transactions, and build healthy financial habits with advanced security features."
                },
                {
                  question: "Is Armo. free to use?",
                  answer: "Yes, Armo.'s core features are completely free for regular users. We offer premium features for advanced users, but you can accomplish most financial management tasks with our free plan."
                },
                {
                  question: "How secure is my financial data?",
                  answer: "We use bank-level encryption and security measures to protect your data. Your information is never shared with third parties, and you maintain full control over your financial data. We implement industry-standard security protocols."
                },
                {
                  question: "Can I connect my bank account?",
                  answer: "Yes, Armo. supports secure connections to thousands of financial institutions. We use industry-standard security protocols to ensure your banking information remains safe and encrypted."
                },
                {
                  question: "Are there any transaction fees?",
                  answer: "No, Armo. prides itself on zero transaction fees for most operations. You won't be charged fees or taxes for standard transactions, making it cost-effective for your financial management."
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
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 px-6 overflow-hidden group hover:shadow-xl hover:border-green-500/50 hover:bg-gray-800/70 transition-all duration-300"
                  >
                    <AccordionTrigger className="text-left text-lg font-semibold py-6 text-white group-hover:text-green-400 transition-colors [&[data-state=open]>svg]:text-green-400">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 pb-6 leading-relaxed">
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
                <button className="text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-xl hover:shadow-2xl" style={{ backgroundColor: '#9fd1b5' }}>
                  <Link to="/auth" className="text-black">Get Started Now →</Link>
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t" style={{ backgroundColor: '#181818', borderColor: '#262626' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center space-x-2">
                <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                  <span className="text-black font-bold text-sm">A</span>
                </div>
                <span>Armo.</span>
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
            <p className="text-gray-400 text-sm">&copy; 2024 Armo. All rights reserved.</p>
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
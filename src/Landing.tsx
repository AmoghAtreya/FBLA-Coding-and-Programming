import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { 
  ArrowRight, 
  BarChart2, 
  Lock, 
  CreditCard, 
  TrendingUp, 
  Grid, 
  MessageSquare,
  ChevronDown,
  Check,
  Shield,
  Smartphone,
  DollarSign,
  Users,
  Star,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import TransactionsChart from '@/components/TransactionsChart';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ChatBot from '@/components/ChatBot';
import CategoryChart from '@/components/CategoryChart';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Enhanced parallax effects
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  
  // Spring animations for smooth interactions
  const springConfig = { stiffness: 100, damping: 30, mass: 1 };
  const x = useSpring(0, springConfig);
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sampleData = [
    { date: 'Jan 2024', income: 3000, expenses: 2500 },
    { date: 'Feb 2024', income: 3200, expenses: 2400 },
    { date: 'Mar 2024', income: 3400, expenses: 2800 },
    { date: 'Apr 2024', income: 3100, expenses: 2600 },
    { date: 'May 2024', income: 3500, expenses: 2900 },
    { date: 'Jun 2024', income: 3300, expenses: 2700 },
  ];

  const sampleCategoryData = [
    { name: 'Food & Dining', value: 850, color: '#2563EB', percentage: 28 },
    { name: 'Transportation', value: 450, color: '#10B981', percentage: 15 },
    { name: 'Housing', value: 1200, color: '#F59E0B', percentage: 40 },
    { name: 'Entertainment', value: 330, color: '#8B5CF6', percentage: 11 },
    { name: 'Other', value: 180, color: '#EC4899', percentage: 6 },
  ];

  const features3D = [
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Your money is protected with industry-leading encryption and security protocols.',
      color: 'from-blue-400 to-blue-600',
      delay: 0.1
    },
    {
      icon: BarChart2,
      title: 'Smart Analytics',
      description: 'Get detailed insights into your spending patterns with AI-powered analytics.',
      color: 'from-purple-400 to-purple-600',
      delay: 0.2
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Manage your finances on-the-go with our intuitive mobile app.',
      color: 'from-green-400 to-green-600',
      delay: 0.3
    },
    {
      icon: Zap,
      title: 'Instant Transfers',
      description: 'Send and receive money instantly with zero fees for students.',
      color: 'from-orange-400 to-orange-600',
      delay: 0.4
    }
  ];

  const stats3D = [
    { number: '50K+', label: 'Active Students', icon: Users },
    { number: '4.9', label: 'App Store Rating', icon: Star },
    { number: '$5M+', label: 'Money Saved', icon: DollarSign },
    { number: '99.9%', label: 'Uptime', icon: Shield }
  ];

  const testimonials = [
    {
      quote: "FinFlow has completely transformed how I manage my student finances. The income-based budgeting makes sense for my irregular income.",
      author: "Alex M.",
      role: "Graduate Student"
    },
    {
      quote: "Finally a financial app that understands student life! The categories are perfect for tracking my spending and the interface is so intuitive.",
      author: "Jamie L.",
      role: "Undergraduate"
    },
    {
      quote: "The visualizations help me see exactly where my money goes each month. I've saved over $200 since I started using FinFlow last semester.",
      author: "Taylor K.",
      role: "PhD Candidate"
    }
  ];

  const faqs = [
    {
      question: "What is FinFlow?",
      answer: "FinFlow is a comprehensive financial management platform designed specifically for students. It helps you track expenses, set budgets based on your income, and build healthy financial habits."
    },
    {
      question: "Is FinFlow free to use?",
      answer: "Yes, FinFlow's core features are completely free for students. We offer premium features for a small monthly subscription, but you can accomplish most tasks with the free version."
    },
    {
      question: "How do I create a budget?",
      answer: "After signing in, navigate to the 'Budget' section from your dashboard. Click 'Create New Budget' and follow the step-by-step wizard to set up income sources, spending categories, and savings goals."
    },
    {
      question: "Can I connect my bank account?",
      answer: "Yes, FinFlow allows secure connections to thousands of financial institutions through our banking partners. Your credentials are never stored on our servers, and all connections use bank-level encryption."
    },
    {
      question: "How does FinFlow keep my financial data secure?",
      answer: "We use industry-standard encryption for all data at rest and in transit. We never share your financial information with third parties without your explicit consent, and you can delete your data at any time."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 w-full relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20"
          animate={{
            y: [0, 20, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-200 rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Enhanced Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-xl py-3' : 'bg-transparent py-6'}`}>
        <nav className="max-w-7xl mx-auto flex justify-between items-center w-full px-6 md:px-10">
          <Link to="/" className="flex items-center space-x-3">
            <motion.div 
              className="bg-gradient-to-r from-finflow-blue to-blue-700 text-white h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              F
            </motion.div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-finflow-blue to-blue-700">FinFlow</h1>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <motion.a 
              onClick={() => scrollToSection('features')} 
              className="text-gray-600 hover:text-finflow-blue transition-colors cursor-pointer font-medium"
              whileHover={{ scale: 1.05 }}
            >
              Features
            </motion.a>
            <motion.a 
              onClick={() => scrollToSection('about')} 
              className="text-gray-600 hover:text-finflow-blue transition-colors cursor-pointer font-medium"
              whileHover={{ scale: 1.05 }}
            >
              About
            </motion.a>
            <Link to="/faq" className="text-gray-600 hover:text-finflow-blue transition-colors font-medium">FAQ</Link>
            {user && (
              <Link to="/dashboard" className="text-gray-600 hover:text-finflow-blue transition-colors font-medium">Dashboard</Link>
            )}
          </div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={() => navigate(user ? '/dashboard' : '/auth')}
              className="bg-gradient-to-r from-finflow-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
            >
              {user ? 'Dashboard' : 'Get Started'}
            </Button>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section with 3D Effects */}
      <motion.section 
        ref={heroRef}
        style={{ y, opacity, scale }}
        className="pt-32 pb-20 md:pt-40 md:pb-32 px-6 md:px-10 relative min-h-screen flex items-center"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1 
                className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-finflow-blue to-blue-700">
                  MONEY
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-finflow-blue to-blue-700">
                  WITHOUT
                </span>
                <br />
                <span className="text-gray-900">BORDERS</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 mb-10 max-w-xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                The modern way to manage student finances. Track expenses, set budgets, and achieve your financial goals with our AI-powered platform.
              </motion.p>
              
              <motion.div 
                className="flex flex-col md:flex-row gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-finflow-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-6 rounded-2xl font-semibold text-lg transition-all shadow-2xl hover:shadow-blue-500/25 group"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/faq')}
                    className="border-2 border-gray-300 text-gray-700 px-10 py-6 rounded-2xl font-semibold text-lg hover:border-finflow-blue hover:text-finflow-blue transition-all"
                  >
                    Learn More
                  </Button>
                </motion.div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                className="flex items-center space-x-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <motion.div 
                      key={i} 
                      className="w-12 h-12 rounded-full border-3 border-white bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1 + i * 0.1, duration: 0.4 }}
                      whileHover={{ scale: 1.1, zIndex: 10 }}
                    >
                      {i === 5 ? '1K+' : '★'}
                    </motion.div>
                  ))}
                </div>
                <p className="text-gray-600 font-medium">Trusted by thousands of students</p>
              </motion.div>
            </motion.div>

            {/* 3D Floating Cards */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Main Chart Card */}
              <motion.div 
                className="bg-white rounded-3xl shadow-2xl p-8 relative z-10"
                style={{
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 0.05}deg) rotateY(${mousePosition.x * 0.05}deg)`,
                }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="h-[300px] mb-4">
                  <TransactionsChart data={sampleData} type="area" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600 text-sm">Total Balance</p>
                    <p className="text-2xl font-bold text-gray-900">$4,235.50</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-500 text-sm font-medium">+12.5%</p>
                    <p className="text-gray-600 text-sm">vs last month</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Transaction Cards */}
              <motion.div 
                className="absolute -top-6 -left-12 bg-white rounded-2xl shadow-xl p-4 z-20"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">+$500</p>
                    <p className="text-sm text-gray-600">Part-time Job</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute -bottom-6 -right-12 bg-white rounded-2xl shadow-xl p-4 z-20"
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -2, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">-$45</p>
                    <p className="text-sm text-gray-600">Groceries</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute top-1/2 -right-20 bg-gradient-to-r from-finflow-blue to-blue-700 rounded-2xl shadow-xl p-4 text-white z-20"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="text-center">
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-sm opacity-90">Budget Left</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          onClick={() => scrollToSection('stats')}
        >
          <p className="text-sm text-gray-500 mb-3 font-medium">Discover More</p>
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown className="h-6 w-6 text-gray-400" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* 3D Statistics Section */}
      <section id="stats" className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-finflow-blue">
              Trusted by Students Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of students who are taking control of their finances with FinFlow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {stats3D.map((stat, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  y: -10,
                  rotateX: 5,
                  rotateY: 5,
                  scale: 1.05
                }}
              >
                <div className="bg-white rounded-3xl p-8 text-center shadow-xl border border-gray-100 transform-gpu transition-all duration-300 group-hover:shadow-2xl group-hover:border-blue-200">
                  <motion.div 
                    className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-finflow-blue to-blue-700 flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <motion.h3 
                    className="text-4xl font-bold text-gray-900 mb-2"
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    {stat.number}
                  </motion.h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Features Grid */}
      <section id="features" className="py-20 px-6 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-finflow-blue">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed specifically for student financial management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features3D.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 60, rotateX: -20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: feature.delay, duration: 0.8 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  y: -15,
                  rotateX: 10,
                  rotateY: 5,
                  scale: 1.02
                }}
              >
                <div className="bg-white rounded-3xl p-8 h-full shadow-xl border border-gray-100 transform-gpu transition-all duration-500 group-hover:shadow-2xl group-hover:border-blue-200 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  <motion.div 
                    className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg`}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-finflow-blue transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <motion.div 
                    className="mt-6 flex items-center text-finflow-blue font-semibold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    whileHover={{ x: 5 }}
                  >
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section with 3D Elements */}
      <section id="about" className="py-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div 
                className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden"
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 5,
                  rotateX: 5
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 0.02}deg) rotateY(${mousePosition.x * 0.02}deg)`,
                }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                  alt="Students using FinFlow"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Built for Students</h3>
                  <p className="text-sm opacity-90">By students, for students</p>
                </div>
              </motion.div>

              {/* Floating Achievement Cards */}
              <motion.div 
                className="absolute -top-6 -right-6 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl shadow-xl p-4 text-white z-20"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 3, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="text-center">
                  <p className="text-xl font-bold">+27%</p>
                  <p className="text-xs opacity-90">Savings Growth</p>
                </div>
              </motion.div>

              <motion.div 
                className="absolute -bottom-6 -left-6 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl shadow-xl p-4 text-white z-20"
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -3, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-semibold">100%</p>
                    <p className="text-xs opacity-90">Secure</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                Built For Students, <span className="bg-clip-text text-transparent bg-gradient-to-r from-finflow-blue to-blue-700">By Students</span>
              </motion.h2>
              
              <motion.p 
                className="text-xl text-gray-600 mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: true }}
              >
                We understand the unique financial challenges students face. That's why we've built a platform that focuses on income-based budgeting and smart financial habits.
              </motion.p>
              
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                viewport={{ once: true }}
              >
                {[
                  'Income-based budget tracking',
                  'Visual spending breakdowns',
                  'Financial goal setting',
                  'Secure data protection',
                  'Student-specific guidance'
                ].map((item, index) => (
                  <motion.div
                    key={index} 
                    className="flex items-center group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 10 }}
                  >
                    <motion.div 
                      className="mr-4 h-8 w-8 rounded-full bg-gradient-to-r from-finflow-blue to-blue-700 text-white flex items-center justify-center shrink-0 shadow-lg"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Check className="h-4 w-4" />
                    </motion.div>
                    <p className="text-lg font-medium text-gray-800 group-hover:text-finflow-blue transition-colors">{item}</p>
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.div 
                className="mt-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-finflow-blue to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-6 rounded-2xl font-semibold text-lg transition-all shadow-2xl hover:shadow-blue-500/25 group"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials with 3D Cards */}
      <section className="py-20 px-6 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-finflow-blue">
              What Students Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of students who are transforming their financial future
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "FinFlow completely changed how I manage my money. The budgeting tools are perfect for irregular student income.",
                author: "Alex M.",
                role: "Graduate Student",
                rating: 5,
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
              },
              {
                quote: "Finally an app that understands student life! The interface is intuitive and the insights are amazing.",
                author: "Jamie L.",
                role: "Undergraduate",
                rating: 5,
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b740?auto=format&fit=crop&w=150&q=80"
              },
              {
                quote: "I've saved over $300 since using FinFlow. The visual breakdowns really help me see where my money goes.",
                author: "Taylor K.",
                role: "PhD Candidate",
                rating: 5,
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 60, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  y: -15,
                  rotateX: 10,
                  scale: 1.02
                }}
              >
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 h-full transform-gpu transition-all duration-500 group-hover:shadow-2xl group-hover:border-blue-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.2 + i * 0.1, duration: 0.3 }}
                          viewport={{ once: true }}
                        >
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        </motion.div>
                      ))}
                    </div>
                    
                    <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                      "{testimonial.quote}"
                    </p>
                    
                    <div className="flex items-center">
                      <motion.img 
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="w-12 h-12 rounded-full mr-4 border-2 border-gray-200"
                        whileHover={{ scale: 1.1 }}
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.author}</p>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-finflow-blue">
              Common Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about FinFlow
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
                  question: "What is FinFlow?",
                  answer: "FinFlow is a comprehensive financial management platform designed specifically for students. It helps you track expenses, set budgets based on your income, and build healthy financial habits."
                },
                {
                  question: "Is FinFlow free to use?",
                  answer: "Yes, FinFlow's core features are completely free for students. We offer premium features for advanced users, but you can accomplish most financial management tasks with our free plan."
                },
                {
                  question: "How secure is my financial data?",
                  answer: "We use bank-level encryption and security measures to protect your data. Your information is never shared with third parties, and you maintain full control over your financial data."
                },
                {
                  question: "Can I connect my bank account?",
                  answer: "Yes, FinFlow supports secure connections to thousands of financial institutions. We use industry-standard security protocols to ensure your banking information remains safe."
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
                    className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl shadow-lg border border-gray-100 px-6 overflow-hidden group hover:shadow-xl transition-all duration-300"
                  >
                    <AccordionTrigger className="text-left text-lg font-semibold py-6 group-hover:text-finflow-blue transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pb-6 leading-relaxed">
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
              <Link to="/faq">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    className="border-2 border-finflow-blue text-finflow-blue hover:bg-finflow-blue hover:text-white transition-all px-8 py-6 rounded-2xl font-semibold text-lg"
                  >
                    View All FAQs <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <motion.section 
        className="px-6 py-32 bg-gradient-to-r from-finflow-blue via-blue-700 to-indigo-800 text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-5xl md:text-7xl font-bold mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              Ready to Take Control?
            </motion.h2>
            <motion.p 
              className="text-xl md:text-2xl opacity-90 mb-12 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
            >
              Join thousands of students who are transforming their financial future with FinFlow
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-white text-finflow-blue hover:bg-gray-100 px-12 py-8 rounded-2xl font-bold text-xl transform transition-all shadow-2xl hover:shadow-white/25 group"
                >
                  Get Started Now
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.p 
              className="mt-8 text-sm opacity-80"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              viewport={{ once: true }}
            >
              No credit card required • Free for students • Start in 2 minutes
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Footer */}
      <footer className="px-6 py-16 bg-gray-900 text-gray-300 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <motion.div 
                className="flex items-center space-x-3 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <div className="bg-gradient-to-r from-finflow-blue to-blue-700 text-white h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">F</div>
                <h1 className="text-2xl font-bold text-white">FinFlow</h1>
              </motion.div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Empowering students to take control of their financial future with intelligent budgeting tools and insights.
              </p>
              <div className="flex space-x-4 mt-6">
                {['facebook', 'twitter', 'instagram'].map((social) => (
                  <motion.a 
                    key={social}
                    href="#" 
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-finflow-blue transition-all"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-sm font-bold">{social[0].toUpperCase()}</span>
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <div className="space-y-3">
                {['Features', 'Pricing', 'Security', 'Mobile App'].map((item) => (
                  <motion.a 
                    key={item}
                    href="#" 
                    className="block text-gray-400 hover:text-white transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <div className="space-y-3">
                {['Help Center', 'Contact Us', 'FAQ', 'Community'].map((item) => (
                  <motion.a 
                    key={item}
                    href="#" 
                    className="block text-gray-400 hover:text-white transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} FinFlow. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <motion.a 
                  key={item}
                  href="#" 
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chat Bot */}
      <ChatBot />
    </div>
  );
};

export default Landing;

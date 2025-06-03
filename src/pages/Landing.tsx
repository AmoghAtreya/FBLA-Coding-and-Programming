import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
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
  Bell
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
import { SecurityFeatures } from '@/components/landing/SecurityFeatures';
import { FeatureSection } from '@/components/landing/FeatureSection';
import { ReviewsSection } from '@/components/landing/ReviewsSection';
import { StatisticCard } from '@/components/landing/StatisticCard';
import { CommonQuestions } from '@/components/landing/CommonQuestions';
import { FeatureCarousel } from '@/components/landing/FeatureCarousel';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Parallax effect for hero section
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    { date: 'Jan 2024', income: 3000, expenses: 2800 },
    { date: 'Feb 2024', income: 3800, expenses: 2100 },
    { date: 'Mar 2024', income: 2900, expenses: 3200 },
    { date: 'Apr 2024', income: 4200, expenses: 2400 },
    { date: 'May 2024', income: 3100, expenses: 3600 },
    { date: 'Jun 2024', income: 4500, expenses: 2300 },
    { date: 'Jul 2024', income: 3200, expenses: 3800 },
    { date: 'Aug 2024', income: 4800, expenses: 2600 },
    { date: 'Sep 2024', income: 3300, expenses: 3900 },
    { date: 'Oct 2024', income: 4600, expenses: 2200 },
    { date: 'Nov 2024', income: 3400, expenses: 3700 },
    { date: 'Dec 2024', income: 5000, expenses: 2500 },
  ];

  const sampleCategoryData = [
    { name: 'Food & Dining', value: 850, color: '#2563EB', percentage: 28 },
    { name: 'Transportation', value: 450, color: '#10B981', percentage: 15 },
    { name: 'Housing', value: 1200, color: '#F59E0B', percentage: 40 },
    { name: 'Entertainment', value: 330, color: '#8B5CF6', percentage: 11 },
    { name: 'Other', value: 180, color: '#EC4899', percentage: 6 },
  ];

  const features = [
    {
      title: 'Track Your Finances',
      description: 'Monitor your income and expenses with intuitive dashboards and reports. Get detailed insights into your spending patterns.',
      icon: BarChart2,
      image: 'photo-1488590528505-98d2b5aba04b'
    },
    {
      title: 'Budget Planning',
      description: 'Set income-based budgets and track your spending against them. Create custom categories and set spending limits.',
      icon: TrendingUp,
      image: 'photo-1526374965328-7f61d4dc18c5'
    },
    {
      title: 'Expense Categories',
      description: 'Organize transactions by categories to understand your spending patterns. Visualize where your money goes.',
      icon: Grid,
      image: 'photo-1531297484001-80022131f5a1'
    },
    {
      title: 'Secure Banking',
      description: 'Connect your accounts safely with industry-standard encryption. Your financial data is protected with the latest security.',
      icon: Lock,
      image: 'photo-1649972904349-6e44c42644a7'
    },
    {
      title: 'Financial Analytics',
      description: 'Advanced analytics and reporting tools to help you understand your spending patterns and make better decisions.',
      icon: CreditCard,
      image: 'photo-1486312338219-ce68d2c6448d'
    },
    {
      title: 'AI Assistant',
      description: 'Get personalized financial advice with our intelligent chatbot. Receive answers to your financial questions instantly.',
      icon: MessageSquare,
      image: 'photo-1676315030835-8e1323b42904'
    },
    {
      title: 'Smart Savings',
      description: 'Set and track savings goals with automated tools. Watch your money grow with intelligent savings recommendations.',
      icon: TrendingUp,
      image: 'photo-1579621970588-a35d0e7ab9b6'
    },
    {
      title: 'Bill Reminders',
      description: 'Never miss a payment with automated bill reminders. Stay on top of your expenses with smart notifications.',
      icon: Bell,
      image: 'photo-1554224155-8d04cb21cd6c'
    }
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
    <div className="min-h-screen bg-white w-full relative overflow-hidden">
      {/* Fixed Header with Background Change on Scroll */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
        <nav className="max-w-[1920px] mx-auto flex justify-between items-center w-full px-6 md:px-10">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-finflow-blue text-white h-8 w-8 rounded-md flex items-center justify-center font-bold text-xl">F</div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-finflow-blue to-blue-700">FinFlow</h1>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-finflow-blue transition-colors">Home</Link>
            <Link to="/faq" className="text-gray-600 hover:text-finflow-blue transition-colors">FAQ</Link>
            <Link to="/landing-new" className="text-gray-600 hover:text-finflow-blue transition-colors">New Landing</Link>
            <a 
              onClick={() => scrollToSection('features')} 
              className="text-gray-600 hover:text-finflow-blue transition-colors cursor-pointer"
            >
              Features
            </a>
            {user && (
              <Link to="/dashboard" className="text-gray-600 hover:text-finflow-blue transition-colors">Dashboard</Link>
            )}
          </div>
          <div className="flex items-center gap-3">
            {!user && (
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-finflow-blue hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Sign Up <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
            <Button 
              onClick={() => navigate(user ? '/dashboard' : '/auth')}
              variant="outline" 
              className={`border-finflow-blue text-finflow-blue hover:bg-finflow-blue hover:text-white transition-colors ${user ? '' : 'hidden sm:flex'}`}
            >
              {user ? 'Dashboard' : 'Log In'}
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section with Chart */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-6 md:px-10 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-black via-finflow-blue to-blue-700">
                CONTROL YOUR FINANCES
              </h1>
              <p className="text-gray-600 text-xl mb-8 max-w-2xl mx-auto">
                Manage your student finances with ease. Track expenses, set income-based budgets, and build healthy financial habits.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleGetStarted}
                  className="bg-finflow-blue hover:bg-blue-700 text-white px-8 py-6 rounded-md font-medium text-lg transition-all transform hover:scale-105"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/faq')}
                  className="border-gray-300 text-gray-700 px-8 py-6 rounded-md font-medium text-lg hover:border-gray-400"
                >
                  FAQ
                </Button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full h-[500px] bg-white rounded-xl shadow-lg p-6 flex flex-col"
            >
              <div className="flex-1 w-full">
                <TransactionsChart data={sampleData} type="area" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security Features Section */}
      <SecurityFeatures />

      {/* Budget Features Section */}
      <FeatureSection 
        id="budget-feature"
        title="Track every dollar with ease" 
        description="Get a clear picture of your spending habits with our intuitive budget tracker designed for students."
        imageSrc="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80"
        isImageLeft={false}
        buttonText="Start Tracking"
        onButtonClick={handleGetStarted}
      />

      {/* Investment Features Section */}
      <FeatureSection 
        id="invest-feature"
        title="Smart savings for students" 
        description="Set savings goals based on your income, track your progress, and watch your money grow with our automated tools."
        imageSrc="https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&w=800&q=80"
        isImageLeft={true}
        buttonText="Start Saving"
        onButtonClick={handleGetStarted}
        bgColor="bg-blue-50"
      />

      {/* Take Charge of Your Money Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Take Charge of Your Money
          </motion.h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Get insights into your spending habits and take control of your finances with our powerful tools.
          </p>

          <Carousel className="w-full">
            <CarouselContent>
              {features.map((feature, index) => (
                <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/3">
                  <motion.div
                    className="group bg-white p-6 rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-500 hover:border-blue-200 h-full flex flex-col mx-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/${feature.image}?auto=format&fit=crop&w=800&q=80`}
                        alt={feature.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white font-bold text-lg">{feature.title}</div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                      <feature.icon className="h-5 w-5 text-finflow-blue" />
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 flex-grow">{feature.description}</p>
                    <motion.div 
                      className="mt-4 flex items-center text-finflow-blue font-medium cursor-pointer"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      Learn more <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:flex justify-end mt-4">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Common Questions Section */}
      <section id="common-questions" className="py-20 bg-blue-50">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Common Questions</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to the most frequently asked questions about FinFlow.
            </p>
          </motion.div>

          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <AccordionItem value={`item-${index}`} className="bg-white rounded-lg shadow-sm px-6">
                    <AccordionTrigger className="text-left text-lg font-medium py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>

            <motion.div 
              className="mt-10 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link to="/faq">
                <Button 
                  variant="outline" 
                  className="border-finflow-blue text-finflow-blue hover:bg-finflow-blue hover:text-white transition-colors px-8 py-6"
                >
                  View All FAQs <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />

      {/* CTA Section */}
      <motion.section 
        className="px-6 py-20 bg-gradient-to-r from-finflow-blue to-blue-700 text-white w-full relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}
        />
        <div className="max-w-[1920px] mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to Take Control?</h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              Join thousands of students who are using FinFlow to manage their money better and achieve their financial goals.
            </p>
            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="bg-white text-finflow-blue hover:bg-gray-100 px-10 py-8 rounded-md font-medium text-xl transform hover:scale-105 transition-all shadow-lg"
            >
              Get Started Now <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
            <p className="mt-6 text-sm opacity-80">No credit card required. Free for students.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="px-6 py-10 bg-gray-900 text-gray-300 w-full">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="bg-finflow-blue text-white h-8 w-8 rounded-md flex items-center justify-center font-bold text-xl">F</div>
              <h1 className="text-2xl font-bold text-white">FinFlow</h1>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-4 justify-center md:justify-end">
              <a onClick={() => scrollToSection('features')} className="cursor-pointer hover:text-white transition-colors">Features</a>
              
              <Link to="/faq" className="hover:text-white transition-colors">FAQ Page</Link>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} FinFlow. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.504-.344-1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
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

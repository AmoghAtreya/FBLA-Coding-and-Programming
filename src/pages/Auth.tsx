/**
 * Authentication Page
 * 
 * Handles user authentication with two main features:
 * - Login: Existing user authentication
 * - Registration: New user account creation
 * 
 * Features:
 * - Email/Password authentication
 * - Google OAuth integration
 * - Form validation
 * - Responsive design
 * - Error handling
 * - Loading states
 * 
 * Uses the authContext for managing authentication state and actions.
 */

import React, { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Shield, Star, Users } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = loginSchema.extend({
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const features = [
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Bank-level security with end-to-end encryption to keep your financial data safe."
  },
  {
    icon: Star,
    title: "Smart Budgeting",
    description: "AI-powered insights help you understand your spending patterns and save money."
  },
  {
    icon: Users,
    title: "Student Community",
    description: "Connect with fellow students and share tips for managing finances on campus."
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const slideIn = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: { duration: 0.4 }
};

const Auth = () => {
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signIn(values.email, values.password);
      toast({
        title: "Welcome back!",
        description: "You've been successfully signed in.",
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await signUp(values.email, values.password);
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
      setActiveTab("login");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === "login") {
        await onLoginSubmit(formData);
      } else {
        await onRegisterSubmit(formData);
      }
    } catch (error: any) {
      toast({
        title: activeTab === "login" ? "Sign in failed" : "Sign up failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen text-white overflow-hidden relative" style={{ backgroundColor: '#181818' }}>
      {/* Top Left Light Effect - matches landing page */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at 10% 10%, rgba(57, 57, 57, 0.4) 0%, transparent 45%)`
        }}
      />
      
      {/* Geometric Background Pattern - matches landing page */}
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
            <pattern id="auth-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>
      </div>

      {/* Navigation Header - matches landing page */}
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
            {/* Logo */}
            <motion.div 
              className="text-xl font-bold flex items-center space-x-2 text-white"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-7 h-7 bg-white rounded flex items-center justify-center">
                <span className="text-black font-bold text-sm">A</span>
              </div>
              <Link to="/landing-new">Ahlan.</Link>
            </motion.div>
            
            {/* Back to Home */}
            <Link 
              to="/landing-new"
              className="text-base font-medium transition-colors duration-200"
              style={{
                background: 'linear-gradient(135deg, #e0e0e0 0%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </motion.nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
          {/* Left Side - Features */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div>
              <motion.h1 
                className="text-4xl lg:text-5xl font-bold mb-6"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, rgb(84, 84, 84) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Welcome to the Future of <span style={{ color: '#9fd1b5' }}>Student Finance</span>
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-300 mb-8"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.1 }}
              >
                Join thousands of students who are taking control of their financial future with Ahlan.
              </motion.p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(31, 41, 55, 0.5)" }}
                >
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(159, 209, 181, 0.2)' }}>
                    <feature.icon className="h-6 w-6" style={{ color: '#9fd1b5' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Proof */}
            <motion.div
              className="flex items-center justify-center space-x-6 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
                ].map((imageUrl, i) => (
                  <div 
                    key={i} 
                    className="w-10 h-10 rounded-full border-2 border-gray-700 overflow-hidden"
                  >
                    <img 
                      src={imageUrl} 
                      alt={`User ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white font-medium">Trusted by 10,000+ students</p>
                <p className="text-gray-400 text-sm">Join the community today</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            className="max-w-md mx-auto w-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="bg-gray-800/30 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/50 shadow-2xl">
              {/* Toggle */}
              <div className="flex bg-gray-800/50 rounded-lg p-1 mb-8">
                <button
                  onClick={() => setActiveTab("login")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === "login" 
                      ? 'text-black shadow-lg' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  style={activeTab === "login" ? { backgroundColor: '#9fd1b5' } : {}}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab("register")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === "register" 
                      ? 'text-white shadow-lg' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  style={activeTab === "register" ? { backgroundColor: '#9fd1b5' } : {}}
                >
                  Sign Up
                </button>
              </div>

              {/* Form */}
              <AnimatePresence mode="wait">
                <motion.form
                  key={activeTab}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  variants={slideIn}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {activeTab === "login" ? 'Welcome back' : 'Create your account'}
                    </h2>
                    <p className="text-gray-400">
                      {activeTab === "login" 
                        ? 'Sign in to access your financial dashboard' 
                        : 'Start your journey to financial freedom'
                      }
                    </p>
                  </div>

                  {activeTab === "register" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="firstName"
                            type="text"
                            required={activeTab === "register"}
                            value={formData.firstName}
                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                            className="pl-10 bg-gray-800/50 border-gray-600 text-white focus:border-green-500"
                            style={{ '--tw-ring-color': '#9fd1b5' } as any}
                            placeholder="John"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          required={activeTab === "register"}
                          value={formData.lastName}
                          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          className="bg-gray-800/50 border-gray-600 text-white focus:border-green-500"
                          style={{ '--tw-ring-color': '#9fd1b5' } as any}
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10 bg-gray-800/50 border-gray-600 text-white"
                        style={{ '--tw-ring-color': '#9fd1b5' } as any}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10 pr-10 bg-gray-800/50 border-gray-600 text-white"
                        style={{ '--tw-ring-color': '#9fd1b5' } as any}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {activeTab === "register" && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          required={activeTab === "register"}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="pl-10 bg-gray-800/50 border-gray-600 text-white"
                          style={{ '--tw-ring-color': '#9fd1b5' } as any}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "login" && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-600 bg-gray-800/50 focus:ring-2"
                          style={{ accentColor: '#9fd1b5' }}
                        />
                        <span className="ml-2 text-sm text-gray-300">Remember me</span>
                      </label>
                      <button type="button" className="text-sm hover:text-green-300 transition-colors" style={{ color: '#9fd1b5' }}>
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full text-black py-3 text-base font-medium relative overflow-hidden group transition-all duration-300 hover:shadow-xl"
                    style={{ backgroundColor: '#9fd1b5' }}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          {activeTab === "login" ? 'Sign In' : 'Create Account'}
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                  </Button>

                  {activeTab === "register" && (
                    <p className="text-xs text-gray-400 text-center">
                      By creating an account, you agree to our{' '}
                      <a href="#" className="hover:text-green-300 transition-colors" style={{ color: '#9fd1b5' }}>Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="hover:text-green-300 transition-colors" style={{ color: '#9fd1b5' }}>Privacy Policy</a>
                    </p>
                  )}
                </motion.form>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

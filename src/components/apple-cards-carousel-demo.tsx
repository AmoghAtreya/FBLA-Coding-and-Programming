"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { Shield, BarChart3, Smartphone, Zap, Globe, PiggyBank } from "lucide-react";

export default function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full">
      {/* Header Section with Centered Text */}
      <div className="text-center mb-12">
        <h2 className="text-xl md:text-5xl font-bold text-white font-sans mb-6">
          Everything You Need
        </h2>
        <p className="text-xl max-w-2xl mx-auto text-gray-300">
          Powerful features designed specifically for modern financial management
        </p>
      </div>
      
      {/* Full Width Carousel */}
      <div className="w-full overflow-hidden">
        <Carousel items={cards} />
      </div>
    </div>
  );
}

// Security Content Component
const SecurityContent = () => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3 mb-4">
      <Shield className="h-8 w-8 text-green-400" />
      <h3 className="text-2xl font-bold text-white">Bank-Level Security</h3>
    </div>
    
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-semibold mb-2">🔐 256-Bit Encryption</h4>
        <p className="text-gray-300 text-sm">
          Your data is protected with military-grade encryption that's trusted by major financial institutions worldwide.
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-semibold mb-2">🛡️ Two-Factor Authentication</h4>
        <p className="text-gray-300 text-sm">
          Add an extra layer of security with biometric authentication and SMS verification.
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-semibold mb-2">🔍 Fraud Detection</h4>
        <p className="text-gray-300 text-sm">
          Advanced AI monitors your transactions 24/7 to detect and prevent suspicious activity.
        </p>
      </div>
    </div>
    
    <div className="mt-6">
      <img 
        src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80" 
        alt="Security dashboard interface"
        className="w-full h-48 object-cover rounded-lg"
      />
    </div>
    
    <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
      <p className="text-green-300 text-sm">
        At Armo., we understand that trust is the foundation of financial services. That's why we've implemented enterprise-grade security measures that exceed industry standards. Our multi-layered approach combines advanced encryption, real-time fraud monitoring, and biometric authentication to ensure your money and personal information remain completely secure. Every transaction is protected by the same security protocols used by major banks, giving you peace of mind whether you're sending $5 or $5,000.
      </p>
    </div>
  </div>
);

// Analytics Content Component
const AnalyticsContent = () => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3 mb-4">
      <BarChart3 className="h-8 w-8 text-blue-400" />
      <h3 className="text-2xl font-bold text-white">Smart Analytics</h3>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-semibold mb-2">📊 Spending Insights</h4>
        <p className="text-gray-300 text-sm">
          Understand where your money goes with detailed category breakdowns and trends.
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-semibold mb-2">🎯 Budget Optimization</h4>
        <p className="text-gray-300 text-sm">
          AI-powered suggestions to help you save more and spend smarter.
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-semibold mb-2">📈 Investment Tracking</h4>
        <p className="text-gray-300 text-sm">
          Monitor your portfolio performance and get personalized investment advice.
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-semibold mb-2">🔮 Financial Forecasting</h4>
        <p className="text-gray-300 text-sm">
          Predict future expenses and plan for major purchases with confidence.
        </p>
      </div>
    </div>
    
    <div className="mt-6">
      <img 
        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" 
        alt="Analytics dashboard with charts and graphs"
        className="w-full h-48 object-cover rounded-lg"
      />
    </div>
    
    <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
      <p className="text-blue-300 text-sm">
        Transform your financial data into actionable insights with Armo.'s powerful analytics engine. Our AI-driven platform automatically categorizes your spending, identifies patterns, and provides personalized recommendations to help you make smarter financial decisions. Whether you're tracking daily expenses, monitoring investment performance, or planning for major purchases, our intuitive dashboards and detailed reports give you the clarity you need to take control of your financial future.
      </p>
    </div>
  </div>
);

// Mobile Content Component
const MobileContent = () => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3 mb-4">
      <Smartphone className="h-8 w-8 text-purple-400" />
      <h3 className="text-2xl font-bold text-white">Mobile First Design</h3>
    </div>
    
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-semibold mb-2">📱 Native iOS & Android Apps</h4>
        <p className="text-gray-300 text-sm">
          Experience lightning-fast performance with our native mobile applications.
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-semibold mb-2">⚡ Offline Capabilities</h4>
        <p className="text-gray-300 text-sm">
          View your balance, transaction history, and budgets even without internet connection.
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-semibold mb-2">🔔 Smart Notifications</h4>
        <p className="text-gray-300 text-sm">
          Get real-time alerts for transactions, bill reminders, and budget updates.
        </p>
      </div>
    </div>
    
    <div className="mt-6">
      <img 
        src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80" 
        alt="Mobile banking app interface on smartphone"
        className="w-full h-48 object-cover rounded-lg"
      />
    </div>
    
    <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4">
      <p className="text-purple-300 text-sm">
        In today's fast-paced world, your finances need to keep up with your lifestyle. Armo.'s mobile-first approach ensures that every feature is optimized for touch interfaces and on-the-go usage. Our native apps deliver blazing-fast performance while maintaining full functionality even when you're offline. With intuitive gestures, smart notifications, and seamless synchronization across all your devices, managing your money has never been more convenient or accessible.
      </p>
    </div>
  </div>
);

// Transfers Content Component
const TransfersContent = () => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3 mb-4">
      <Zap className="h-8 w-8 text-yellow-400" />
      <h3 className="text-2xl font-bold text-white">Instant Transfers</h3>
    </div>
    
    <div className="grid grid-cols-1 gap-4">
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-semibold mb-2">⚡ Lightning Speed</h4>
        <p className="text-gray-300 text-sm">
          Send money to anyone in seconds, not days. Transfers complete instantly 24/7.
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-semibold mb-2">💰 Zero Fees</h4>
        <p className="text-gray-300 text-sm">
          No hidden charges. Send unlimited money to verified users completely free.
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-semibold mb-2">📞 Contact Integration</h4>
        <p className="text-gray-300 text-sm">
          Send money using just a phone number or email - no need for complex account details.
        </p>
      </div>
    </div>
    
    <div className="mt-6">
      <img 
        src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80" 
        alt="Instant money transfer visualization"
        className="w-full h-48 object-cover rounded-lg"
      />
    </div>
    
    <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
      <p className="text-yellow-300 text-sm">
        Say goodbye to waiting days for transfers to clear. Armo.'s instant transfer technology leverages cutting-edge payment rails to move your money in real-time, 24 hours a day, 7 days a week. Whether you're splitting a dinner bill, paying rent, or sending money to family, our platform ensures your transfers arrive immediately without any fees for verified users. Simply enter a phone number or email address, and watch your money arrive instantly.
      </p>
    </div>
  </div>
);

// Global Payments Content Component
const GlobalContent = () => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3 mb-4">
      <Globe className="h-8 w-8 text-cyan-400" />
      <h3 className="text-2xl font-bold text-white">Global Payments</h3>
    </div>
    
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-semibold mb-2">🌍 190+ Countries</h4>
        <p className="text-gray-300 text-sm">
          Send money to friends, family, and businesses in over 190 countries worldwide.
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-semibold mb-2">💱 Best Exchange Rates</h4>
        <p className="text-gray-300 text-sm">
          Get real-time rates that are up to 8x cheaper than traditional banks.
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-semibold mb-2">🏪 Multiple Pickup Options</h4>
        <p className="text-gray-300 text-sm">
          Recipients can collect cash, receive bank deposits, or use mobile wallets.
        </p>
      </div>
    </div>
    
    <div className="mt-6">
      <img 
        src="https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?auto=format&fit=crop&w=800&q=80" 
        alt="Global network and international payments"
        className="w-full h-48 object-cover rounded-lg"
      />
    </div>
    
    <div className="bg-cyan-900/20 border border-cyan-700 rounded-lg p-4">
      <p className="text-cyan-300 text-sm">
        Break down borders with Armo.'s global payment network that connects you to over 190 countries worldwide. Our platform offers competitive exchange rates that are up to 8 times cheaper than traditional banks, ensuring more of your money reaches its destination. Whether your recipient prefers cash pickup, bank deposit, or mobile wallet transfer, we provide flexible options that work best for their local preferences and infrastructure.
      </p>
    </div>
  </div>
);

// Budgeting Content Component
const BudgetingContent = () => (
  <div className="space-y-6">
    <div className="flex items-center space-x-3 mb-4">
      <PiggyBank className="h-8 w-8 text-pink-400" />
      <h3 className="text-2xl font-bold text-white">Advanced Budgeting</h3>
    </div>
    
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-semibold mb-2">🎯 Smart Categories</h4>
        <p className="text-gray-300 text-sm">
          AI automatically categorizes your spending and suggests budget allocations.
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-semibold mb-2">📅 Flexible Timeframes</h4>
        <p className="text-gray-300 text-sm">
          Set weekly, monthly, or custom budget periods that fit your lifestyle.
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h4 className="text-white font-semibold mb-2">🔔 Proactive Alerts</h4>
        <p className="text-gray-300 text-sm">
          Get notified before you overspend with smart warnings and suggestions.
        </p>
      </div>
    </div>
    
    <div className="mt-6">
      <img 
        src="https://images.unsplash.com/photo-1511984804822-e16ba72f5848?auto=format&fit=crop&w=800&q=80" 
        alt="Budget planning and financial management tools"
        className="w-full h-48 object-cover rounded-lg"
      />
    </div>
    
    <div className="bg-pink-900/20 border border-pink-700 rounded-lg p-4">
      <p className="text-pink-300 text-sm">
        Take control of your financial future with Armo.'s intelligent budgeting system that adapts to your spending patterns and lifestyle. Our AI-powered platform automatically categorizes expenses, identifies spending trends, and provides personalized recommendations to help you save more effectively. With flexible budget periods, proactive alerts, and smart goal-setting features, you'll develop healthy financial habits that last a lifetime.
      </p>
    </div>
  </div>
);

const data = [
  {
    category: "Bank-Level Security",
    title: "Your money is protected with industry-leading encryption and security protocols.",
    src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80",
    content: <SecurityContent />,
  },
  {
    category: "Smart Analytics",
    title: "Get detailed insights into your spending patterns with AI-powered analytics.",
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    content: <AnalyticsContent />,
  },
  {
    category: "Mobile First Design",
    title: "Manage your finances on-the-go with our intuitive mobile app.",
    src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
    content: <MobileContent />,
  },
  {
    category: "Instant Transfers",
    title: "Send and receive money instantly with zero fees for verified users.",
    src: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
    content: <TransfersContent />,
  },
  {
    category: "Global Payments",
    title: "Send money anywhere in the world with competitive exchange rates.",
    src: "https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=80&w=2793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <GlobalContent />,
  },
  {
    category: "Advanced Budgeting",
    title: "Create intelligent budgets that adapt to your spending patterns and help you save.",
    src: "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <BudgetingContent />,
  },
]; 
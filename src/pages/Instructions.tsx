import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, BarChart2, TagIcon, CreditCard, Settings, 
  Plus, Filter, Calendar, Eye, EyeOff, TrendingUp, Target,
  CheckCircle, AlertCircle, Info, ChevronRight, PieChart,
  Download, Upload, Search, Edit, Trash2, DollarSign
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Instructions = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('getting-started');

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <BookOpen className="w-5 h-5" />,
      content: {
        overview: 'Welcome to Armo! This comprehensive guide will help you set up and use your personal finance management app effectively.',
        steps: [
          {
            title: 'Create Your Account',
            details: [
              'Visit the signup page and provide your email and password',
              'Verify your email address through the confirmation link',
              'Complete your profile setup with basic information',
              'Choose your preferred currency and time zone'
            ],
            tips: ['Use a strong password with numbers and special characters', 'Keep your login credentials secure']
          },
          {
            title: 'Initial Setup',
            details: [
              'Take a tour of the dashboard to familiarize yourself with the interface',
              'Set up your primary financial accounts (checking, savings, credit cards)',
              'Create your first spending categories',
              'Add your first few transactions to get comfortable with the system'
            ],
            tips: ['Start with your most frequently used accounts', 'Begin with basic categories like Food, Transportation, and Entertainment']
          }
        ]
      }
    },
    {
      id: 'dashboard',
      title: 'Understanding Your Dashboard',
      icon: <BarChart2 className="w-5 h-5" />,
      content: {
        overview: 'Your dashboard is the command center of your finances. Here\'s how to read and use every element.',
        features: [
          {
            name: 'Financial Summary Cards',
            description: 'Three main cards show your Remaining Balance, Total Income, and Total Expenses',
            howTo: [
              'Green numbers indicate positive trends',
              'Red numbers show areas that need attention',
              'Percentage changes show month-over-month comparison',
              'Click on cards to see detailed breakdowns'
            ]
          },
          {
            name: 'Date Range Selector',
            description: 'Control what time period you\'re viewing',
            howTo: [
              'Choose from presets: Today, Last 7 days, Last 30 days, This year, All time',
              'Use custom range for specific periods',
              'Data automatically updates when you change the range',
              'Default is set to "All time" for comprehensive view'
            ]
          },
          {
            name: 'Transaction Chart',
            description: 'Visual representation of your income vs expenses over time',
            howTo: [
              'Green bars/lines represent income',
              'Red bars/lines represent expenses',
              'Switch between Area, Line, and Bar chart types',
              'Adjust time period view (daily, weekly, monthly, yearly)',
              'Use navigation arrows to view previous periods'
            ]
          },
          {
            name: 'Category Breakdown',
            description: 'Pie chart showing where your money goes',
            howTo: [
              'Each slice represents a spending category',
              'Larger slices indicate higher spending',
              'Hover over slices to see exact amounts and percentages',
              'Use this to identify your biggest expenses'
            ]
          }
        ]
      }
    },
    {
      id: 'transactions',
      title: 'Managing Transactions',
      icon: <DollarSign className="w-5 h-5" />,
      content: {
        overview: 'Transactions are the heart of your financial tracking. Learn how to add, edit, and organize them effectively.',
        operations: [
          {
            name: 'Adding Transactions',
            steps: [
              'Click the "Add Transaction" button',
              'Select transaction type: Income or Expense',
              'Enter the amount (always positive - the app handles negative values for expenses)',
              'Choose or create a category',
              'Add a description to help you remember the transaction',
              'Select the account the money came from/went to',
              'Set the transaction date',
              'Click "Add Transaction" to save'
            ],
            tips: [
              'Be specific in descriptions (e.g., "Lunch at Subway" vs "Food")',
              'Add transactions promptly to avoid forgetting details',
              'Use consistent naming for recurring transactions'
            ]
          },
          {
            name: 'Editing Transactions',
            steps: [
              'Find the transaction in your list',
              'Click the edit button (pencil icon)',
              'Modify any field as needed',
              'Save your changes'
            ]
          },
          {
            name: 'Filtering and Searching',
            steps: [
              'Use the search bar to find specific transactions',
              'Filter by transaction type (Income/Expense)',
              'Filter by category',
              'Set amount ranges',
              'Use date filters for specific time periods',
              'Clear filters to see all transactions'
            ]
          }
        ]
      }
    },
    {
      id: 'categories',
      title: 'Category Management',
      icon: <TagIcon className="w-5 h-5" />,
      content: {
        overview: 'Categories help you organize and understand your spending patterns. Create meaningful categories that reflect your lifestyle.',
        guidance: [
          {
            name: 'Creating Categories',
            description: 'Set up categories that match your spending habits',
            steps: [
              'Go to the Categories page',
              'Click "Add Category"',
              'Choose a descriptive name',
              'Select an appropriate color for easy identification',
              'Set a monthly budget limit (optional but recommended)',
              'Save the category'
            ],
            examples: [
              'Essential: Food & Groceries, Transportation, Utilities, Rent/Mortgage',
              'Lifestyle: Entertainment, Dining Out, Shopping, Hobbies',
              'Health: Medical, Fitness, Prescriptions',
              'Income: Salary, Freelance, Investments, Gifts'
            ]
          },
          {
            name: 'Budget Setting',
            description: 'Set spending limits to stay on track',
            steps: [
              'Edit any existing category',
              'Set a realistic monthly budget amount',
              'Monitor your progress throughout the month',
              'Adjust budgets based on actual spending patterns'
            ],
            tips: [
              'Start with conservative estimates',
              'Review and adjust budgets monthly',
              'Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings'
            ]
          }
        ]
      }
    },
    {
      id: 'accounts',
      title: 'Account Management',
      icon: <CreditCard className="w-5 h-5" />,
      content: {
        overview: 'Track multiple accounts to get a complete picture of your finances.',
        features: [
          {
            name: 'Adding Accounts',
            steps: [
              'Navigate to Accounts page',
              'Click "Add Account"',
              'Enter account name (e.g., "Chase Checking", "Discover Credit Card")',
              'Select account type (Checking, Savings, Credit Card, Investment)',
              'Set initial balance',
              'Add any notes or details',
              'Save the account'
            ]
          },
          {
            name: 'Account Types',
            descriptions: [
              'Checking: Your primary spending account',
              'Savings: Emergency funds and goal-based savings',
              'Credit Card: Track credit card spending and payments',
              'Investment: Monitor investment accounts (manual updates)'
            ]
          },
          {
            name: 'Balance Tracking',
            steps: [
              'Initial balances are set when creating accounts',
              'Balances update automatically as you add transactions',
              'Manually adjust if needed for accuracy',
              'Use the account filter on dashboard to view specific account activity'
            ]
          }
        ]
      }
    },
    {
      id: 'tips',
      title: 'Best Practices & Tips',
      icon: <TrendingUp className="w-5 h-5" />,
      content: {
        overview: 'Maximize the effectiveness of your financial tracking with these proven strategies.',
        practices: [
          {
            category: 'Daily Habits',
            tips: [
              'Record transactions immediately when possible',
              'Check your dashboard daily to stay aware of spending',
              'Take photos of receipts for reference',
              'Review account balances regularly'
            ]
          },
          {
            category: 'Weekly Reviews',
            tips: [
              'Review the past week\'s spending every Sunday',
              'Check if you\'re staying within category budgets',
              'Look for spending patterns or trends',
              'Plan for the upcoming week\'s expenses'
            ]
          },
          {
            category: 'Monthly Planning',
            tips: [
              'Review all categories and adjust budgets',
              'Analyze spending patterns from the charts',
              'Set financial goals for the next month',
              'Clean up and categorize any missed transactions'
            ]
          },
          {
            category: 'Security & Data',
            tips: [
              'Use strong, unique passwords',
              'Log out when using shared computers',
              'Regularly backup your data',
              'Keep your email address updated for important notifications'
            ]
          }
        ]
      }
    },
    {
      id: 'troubleshooting',
      title: 'Common Issues & Solutions',
      icon: <AlertCircle className="w-5 h-5" />,
      content: {
        overview: 'Quick solutions to common problems you might encounter.',
        issues: [
          {
            problem: 'My balance doesn\'t match my bank account',
            solutions: [
              'Check if all transactions are recorded',
              'Verify transaction amounts are correct',
              'Ensure no duplicate transactions exist',
              'Adjust the starting balance if needed',
              'Account for pending transactions not yet processed'
            ]
          },
          {
            problem: 'Can\'t find a specific transaction',
            solutions: [
              'Use the search function with keywords from the description',
              'Check different date ranges',
              'Try filtering by category or account',
              'Look in both income and expense types',
              'Check if it was accidentally deleted'
            ]
          },
          {
            problem: 'Charts are not showing data',
            solutions: [
              'Ensure you have transactions in the selected date range',
              'Check that the correct account filter is applied',
              'Try expanding the date range',
              'Refresh the page if data seems stuck',
              'Verify transactions have proper dates and amounts'
            ]
          },
          {
            problem: 'Categories are not organizing properly',
            solutions: [
              'Check category names for typos or duplicates',
              'Ensure transactions are assigned to the correct categories',
              'Review and merge similar categories if needed',
              'Use consistent naming conventions'
            ]
          }
        ]
      }
    }
  ];

  const navigationItems = sections.map(section => ({
    id: section.id,
    title: section.title,
    icon: section.icon
  }));

  return (
    <div className="min-h-screen text-white overflow-hidden relative" style={{ backgroundColor: '#181818' }}>
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 border border-gray-700/20 rotate-45 rounded-3xl"></div>
        <div className="absolute bottom-40 left-10 w-64 h-64 border border-gray-600/15 rotate-12 rounded-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-r from-gray-700/5 to-gray-800/5 rotate-45 rounded-lg"></div>
        
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10 border-b" style={{ borderColor: '#262626' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-gray-800 text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 
              className="text-2xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #e0e0e0 0%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              How to Use Armo
            </h1>
            <div className="ml-auto">
              <div className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#9fd1b5', color: '#000' }}>
                Complete Guide
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 p-6 sticky top-24">
              <h3 
                className="font-semibold mb-4"
                style={{
                  background: 'linear-gradient(135deg, #e0e0e0 0%, #ffffff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Quick Navigation
              </h3>
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? 'text-black font-medium'
                        : 'hover:bg-gray-700/50 text-gray-300'
                    }`}
                    style={activeSection === item.id ? { backgroundColor: '#9fd1b5' } : {}}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.title}</span>
                  </button>
                ))}
              </nav>
              
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="space-y-2">
                  <Link to="/landing-new">
                    <button 
                      className="w-full px-4 py-2 rounded-lg font-medium text-black transition-all hover:opacity-90"
                      style={{ backgroundColor: '#9fd1b5' }}
                    >
                      Go to Dashboard
                    </button>
                  </Link>
                      <button 
                     onClick={() => {
                       navigate('/landing-new');
                       setTimeout(() => {
                         const element = document.getElementById('faq');
                         if (element) element.scrollIntoView({ behavior: 'smooth' });
                       }, 100);
                     }}
                     className="w-full px-4 py-2 rounded-lg font-medium text-white border border-gray-600 hover:bg-gray-700/50 transition-colors"
                   >
                     Visit FAQ
                   </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`${activeSection === section.id ? 'block' : 'hidden'}`}
              >
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#9fd1b5' }}>
                      <div className="text-black">
                        {section.icon}
                      </div>
                    </div>
                    <div>
                      <h2 
                        className="text-2xl font-bold"
                        style={{
                          background: 'linear-gradient(135deg, #e0e0e0 0%, #ffffff 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >
                        {section.title}
                      </h2>
                      <p className="text-gray-300 mt-1">{section.content.overview}</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Getting Started Content */}
                    {section.id === 'getting-started' && section.content.steps && (
                      <div className="space-y-6">
                        {section.content.steps.map((step, index) => (
                          <div key={index} className="border border-gray-600 rounded-lg p-6 bg-gray-800/30">
                            <h3 className="text-lg font-semibold text-white mb-4">{step.title}</h3>
                            <ul className="space-y-3 mb-4">
                              {step.details.map((detail, detailIndex) => (
                                <li key={detailIndex} className="flex items-start gap-3">
                                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#9fd1b5' }} />
                                  <span className="text-gray-300">{detail}</span>
                                </li>
                              ))}
                            </ul>
                            {step.tips && (
                              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                                <h4 className="font-medium text-white mb-2">💡 Pro Tips:</h4>
                                <ul className="space-y-1">
                                  {step.tips.map((tip, tipIndex) => (
                                    <li key={tipIndex} className="text-gray-300 text-sm">• {tip}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Dashboard Content */}
                    {section.id === 'dashboard' && section.content.features && (
                      <div className="space-y-6">
                        {section.content.features.map((feature, index) => (
                          <div key={index} className="border border-gray-600 rounded-lg p-6 bg-gray-800/30">
                            <h3 className="text-lg font-semibold text-white mb-2">{feature.name}</h3>
                            <p className="text-gray-300 mb-4">{feature.description}</p>
                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-200">How to use:</h4>
                              <ul className="space-y-2">
                                {feature.howTo.map((instruction, instructionIndex) => (
                                  <li key={instructionIndex} className="flex items-start gap-3">
                                    <ChevronRight className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                                    <span className="text-gray-300 text-sm">{instruction}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Transactions Content */}
                    {section.id === 'transactions' && section.content.operations && (
                      <div className="space-y-6">
                        {section.content.operations.map((operation, index) => (
                          <div key={index} className="border border-gray-600 rounded-lg p-6 bg-gray-800/30">
                            <h3 className="text-lg font-semibold text-white mb-4">{operation.name}</h3>
                            <div className="space-y-3 mb-4">
                              {operation.steps.map((step, stepIndex) => (
                                <div key={stepIndex} className="flex items-start gap-3">
                                  <span 
                                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-black text-sm font-medium"
                                    style={{ backgroundColor: '#9fd1b5' }}
                                  >
                                    {stepIndex + 1}
                                  </span>
                                  <span className="text-gray-300">{step}</span>
                                </div>
                              ))}
                            </div>
                            {operation.tips && (
                              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                                <h4 className="font-medium text-white mb-2">⚡ Quick Tips:</h4>
                                <ul className="space-y-1">
                                  {operation.tips.map((tip, tipIndex) => (
                                    <li key={tipIndex} className="text-gray-300 text-sm">• {tip}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Categories Content */}
                    {section.id === 'categories' && section.content.guidance && (
                      <div className="space-y-6">
                        {section.content.guidance.map((guide, index) => (
                          <div key={index} className="border border-gray-600 rounded-lg p-6 bg-gray-800/30">
                            <h3 className="text-lg font-semibold text-white mb-2">{guide.name}</h3>
                            <p className="text-gray-300 mb-4">{guide.description}</p>
                            
                            <div className="space-y-3 mb-4">
                              {guide.steps.map((step, stepIndex) => (
                                <div key={stepIndex} className="flex items-start gap-3">
                                  <span 
                                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-black text-sm font-medium"
                                    style={{ backgroundColor: '#9fd1b5' }}
                                  >
                                    {stepIndex + 1}
                                  </span>
                                  <span className="text-gray-300">{step}</span>
                                </div>
                              ))}
                            </div>

                            {guide.examples && (
                              <div className="bg-gray-700/50 rounded-lg p-4 mb-4 border border-gray-600">
                                <h4 className="font-medium text-white mb-2">📝 Category Examples:</h4>
                                <ul className="space-y-1">
                                  {guide.examples.map((example, exampleIndex) => (
                                    <li key={exampleIndex} className="text-gray-300 text-sm">• {example}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {guide.tips && (
                              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                                <h4 className="font-medium text-white mb-2">💰 Budget Tips:</h4>
                                <ul className="space-y-1">
                                  {guide.tips.map((tip, tipIndex) => (
                                    <li key={tipIndex} className="text-gray-300 text-sm">• {tip}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Accounts Content */}
                    {section.id === 'accounts' && section.content.features && (
                      <div className="space-y-6">
                        {section.content.features.map((feature, index) => (
                          <div key={index} className="border border-gray-600 rounded-lg p-6 bg-gray-800/30">
                            <h3 className="text-lg font-semibold text-white mb-4">{feature.name}</h3>
                            
                            {feature.steps && (
                              <div className="space-y-3">
                                {feature.steps.map((step, stepIndex) => (
                                  <div key={stepIndex} className="flex items-start gap-3">
                                    <span 
                                      className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-black text-sm font-medium"
                                      style={{ backgroundColor: '#9fd1b5' }}
                                    >
                                      {stepIndex + 1}
                                    </span>
                                    <span className="text-gray-300">{step}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {feature.descriptions && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {feature.descriptions.map((desc, descIndex) => (
                                  <div key={descIndex} className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
                                    <span className="text-gray-300 text-sm">{desc}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tips Content */}
                    {section.id === 'tips' && section.content.practices && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {section.content.practices.map((practice, index) => (
                          <div key={index} className="border border-gray-600 rounded-lg p-6 bg-gray-800/30">
                            <h3 className="text-lg font-semibold text-white mb-4">{practice.category}</h3>
                            <ul className="space-y-3">
                              {practice.tips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="flex items-start gap-3">
                                  <TrendingUp className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: '#9fd1b5' }} />
                                  <span className="text-gray-300 text-sm">{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Troubleshooting Content */}
                    {section.id === 'troubleshooting' && section.content.issues && (
                      <div className="space-y-6">
                        {section.content.issues.map((issue, index) => (
                          <div key={index} className="border border-gray-600 rounded-lg p-6 bg-gray-800/30">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                              <AlertCircle className="w-5 h-5" style={{ color: '#9fd1b5' }} />
                              {issue.problem}
                            </h3>
                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-200">Solutions:</h4>
                              <ul className="space-y-2">
                                {issue.solutions.map((solution, solutionIndex) => (
                                  <li key={solutionIndex} className="flex items-start gap-3">
                                    <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: '#9fd1b5' }} />
                                    <span className="text-gray-300 text-sm">{solution}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="mt-12 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 p-8 relative z-10">
          <div className="text-center">
            <h3 
              className="text-xl font-semibold mb-4"
              style={{
                background: 'linear-gradient(135deg, #e0e0e0 0%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Ready to Get Started?
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              You now have everything you need to effectively manage your finances with Armo. 
              Start by setting up your accounts and adding your first transactions!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/landing-new">
                <button 
                  className="px-8 py-3 rounded-lg font-semibold text-black transition-all hover:opacity-90 shadow-lg"
                  style={{ backgroundColor: '#9fd1b5' }}
                >
                  Open Dashboard
                </button>
              </Link>
              <Link to="/auth">
                <button className="px-8 py-3 rounded-lg font-semibold text-white border border-gray-600 hover:bg-gray-700/50 transition-colors">
                  Set Up Accounts
                </button>
              </Link>
                             <button 
                 onClick={() => {
                   navigate('/landing-new');
                   setTimeout(() => {
                     const element = document.getElementById('faq');
                     if (element) element.scrollIntoView({ behavior: 'smooth' });
                   }, 100);
                 }}
                 className="px-8 py-3 rounded-lg font-medium text-gray-300 hover:text-white transition-colors"
               >
                 Still Have Questions?
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructions; 
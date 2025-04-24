
const BOT_RESPONSES: Record<string, string[]> = {
  'default': [
    "I'm here to help with your financial questions! What would you like to know?",
    "Need help with your finances? I'm here for you! Ask me anything.",
    "Feel free to ask me about budgeting, accounts, transactions, or any financial advice you need.",
  ],
  'account': [
    "You can add a new account by clicking the 'Add Account' button on the Accounts page. It's quick and easy!",
    "To view your account details, go to the Accounts page and click on any account card to see the full details.",
    "Need help connecting your bank? You can link external accounts through our secure integration. Your data is always protected.",
  ],
  'transaction': [
    "You can add new transactions from the Transactions page by clicking the '+' button in the top right corner.",
    "Transactions are automatically categorized, but you can change the category by clicking on any transaction and editing the details.",
    "You can filter transactions by date range, account, or category to find exactly what you're looking for.",
  ],
  'budget': [
    "Setting a budget is a great way to track your spending habits. Our charts help you visualize where your money goes.",
    "You can create budgets for different categories on the Categories page, making it easier to manage your spending.",
    "We'll send you notifications when you're approaching your budget limits, so you can stay on track with your financial goals.",
  ],
  'help': [
    "I can help you with accounts, transactions, budgeting, and more! Just ask me specific questions about any feature.",
    "Use the sidebar to navigate between different sections of the app. You can collapse it for more space if needed.",
    "Check out the Settings page to customize your preferences and set up notifications for important financial events.",
  ],
  'investment': [
    "FinFlow offers basic investment tracking. You can add investment accounts and track their performance over time.",
    "For detailed investment analysis, consider connecting your brokerage accounts for real-time data.",
    "I can provide general investment advice, but always consult with a financial advisor for personalized recommendations.",
  ],
  'saving': [
    "Creating savings goals can help you stay motivated. Try our Goals feature to track your progress.",
    "One effective saving strategy is the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment.",
    "Automating your savings with recurring transfers is one of the best ways to build your savings consistently.",
  ]
};

export const getResponse = (message: string): string => {
  message = message.toLowerCase();
  
  if (message.includes('account') || message.includes('bank') || message.includes('balance')) {
    return BOT_RESPONSES['account'][Math.floor(Math.random() * BOT_RESPONSES['account'].length)];
  } else if (message.includes('transaction') || message.includes('spend') || message.includes('payment') || message.includes('purchase')) {
    return BOT_RESPONSES['transaction'][Math.floor(Math.random() * BOT_RESPONSES['transaction'].length)];
  } else if (message.includes('budget') || message.includes('plan') || message.includes('limit')) {
    return BOT_RESPONSES['budget'][Math.floor(Math.random() * BOT_RESPONSES['budget'].length)];
  } else if (message.includes('help') || message.includes('how') || message.includes('?') || message.includes('guide')) {
    return BOT_RESPONSES['help'][Math.floor(Math.random() * BOT_RESPONSES['help'].length)];
  } else if (message.includes('invest') || message.includes('stock') || message.includes('fund') || message.includes('portfolio')) {
    return BOT_RESPONSES['investment'][Math.floor(Math.random() * BOT_RESPONSES['investment'].length)];
  } else if (message.includes('save') || message.includes('saving') || message.includes('goal') || message.includes('future')) {
    return BOT_RESPONSES['saving'][Math.floor(Math.random() * BOT_RESPONSES['saving'].length)];
  } else {
    return BOT_RESPONSES['default'][Math.floor(Math.random() * BOT_RESPONSES['default'].length)];
  }
};

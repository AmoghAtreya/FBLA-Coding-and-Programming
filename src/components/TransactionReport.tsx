import React, { useState, useMemo } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { useCategoryStats } from '@/hooks/useCategoryStats';
import { useAccounts } from '@/context/AccountContext';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Download, Calendar, ChevronDown } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DateRangeSelector, { DateRangePreset } from '@/components/DateRangeSelector';
import TransactionsChart from '@/components/TransactionsChart';
import CategoryChart from '@/components/CategoryChart';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const TransactionReport = () => {
  const { transactions } = useTransactions();
  const { categories } = useCategoryStats();
  const { accounts } = useAccounts();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 30),
    end: new Date()
  });
  
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const txDate = new Date(tx.transaction_date || tx.date || '');
      const dateInRange = txDate >= dateRange.start && txDate <= dateRange.end;
      
      const categoryMatches = 
        selectedCategory === "All Categories" || 
        tx.category === selectedCategory;
        
      return dateInRange && categoryMatches;
    });
  }, [transactions, dateRange, selectedCategory]);
  
  const financialSummary = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
      
    const totalExpenses = filteredTransactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      
    const balance = totalIncome - totalExpenses;
    
    return { totalIncome, totalExpenses, balance };
  }, [filteredTransactions]);

  const handleDateRangeChange = (start: Date, end: Date) => {
    setDateRange({ start, end });
  };
  
  const handleDatePresetChange = (preset: DateRangePreset) => {
    const today = new Date();
    let start = today;
    let end = today;
    
    switch(preset) {
      case 'today':
        break;
      case 'yesterday':
        start = subDays(today, 1);
        end = subDays(today, 1);
        break;
      case '7days':
        start = subDays(today, 6);
        break;
      case '30days':
        start = subDays(today, 29);
        break;
      case 'thisYear':
        start = new Date(today.getFullYear(), 0, 1);
        break;
      case 'allTime':
        start = new Date(2010, 0, 1);
        break;
      default:
        return;
    }
    
    setDateRange({ start, end });
  };
  
  const availableCategories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    transactions.forEach(tx => {
      if (tx.category) {
        uniqueCategories.add(tx.category);
      }
    });
    return Array.from(uniqueCategories);
  }, [transactions]);

  // Prepare chart data
  const chartData = useMemo(() => {
    const dateGroups: Record<string, { date: string, income: number, expenses: number }> = {};
    
    filteredTransactions.forEach(transaction => {
      const date = format(new Date(transaction.transaction_date || transaction.date || ''), 'MMM dd');
      
      if (!dateGroups[date]) {
        dateGroups[date] = { date, income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income' || transaction.amount > 0) {
        dateGroups[date].income += Math.abs(transaction.amount);
      } else {
        dateGroups[date].expenses += Math.abs(transaction.amount);
      }
    });
    
    return Object.values(dateGroups).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredTransactions]);

  // Account balance chart data
  const accountChartData = useMemo(() => {
    return accounts.map(account => ({
      name: account.name,
      balance: account.balance || 0,
      type: account.type
    }));
  }, [accounts]);

  // Category breakdown data
  const categoryChartData = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    filteredTransactions.forEach(transaction => {
      const category = transaction.category || 'Other';
      const amount = Math.abs(transaction.amount);
      categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
    });

    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', '#06b6d4', '#84cc16', '#f97316'];
    
    return Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    })).sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const exportCSV = () => {
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const dateRangeStr = `${format(dateRange.start, 'yyyy-MM-dd')}_to_${format(dateRange.end, 'yyyy-MM-dd')}`;
    
    // Create CSV content with comprehensive data
    const csvContent = [
      // Header row
      'Date,Description,Category,Type,Amount,Account',
      // Data rows
      ...filteredTransactions.map(tx => {
        const date = format(new Date(tx.transaction_date || tx.date || ''), 'yyyy-MM-dd');
        const description = (tx.description || 'No description').replace(/"/g, '""');
        const category = (tx.category || 'Uncategorized').replace(/"/g, '""');
        const type = tx.type === 'income' ? 'Income' : 'Expense';
        const amount = tx.type === 'income' 
          ? tx.amount 
          : -Math.abs(tx.amount);
        const account = 'Unknown'; // Account info not available in transaction data
        
        return `${date},"${description}","${category}","${type}",${amount},"${account}"`;
      }),
      // Summary rows
      '',
      'Summary',
      `Total Income,${formatCurrency(financialSummary.totalIncome)}`,
      `Total Expenses,${formatCurrency(financialSummary.totalExpenses)}`,
      `Net Balance,${formatCurrency(financialSummary.balance)}`,
      '',
      'Account Balances',
      ...accounts.map(account => 
        `${account.name} (${account.type}),${formatCurrency(account.balance || 0)}`
      ),
      `Total Balance,${formatCurrency(accounts.reduce((sum, account) => sum + (account.balance || 0), 0))}`
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report_${dateRangeStr}_${currentDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "CSV Export Complete",
      description: "Your financial report has been downloaded as a CSV file",
      duration: 3000,
    });
  };

  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      const currentDate = format(new Date(), 'MMMM d, yyyy');
      
      doc.setFillColor(59, 130, 246); // Blue background
      doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
      doc.setTextColor(255, 255, 255); // White text
      doc.setFontSize(24);
      doc.text('Financial Report', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`Generated on ${currentDate}`, 105, 30, { align: 'center' });
      doc.setTextColor(0, 0, 0); // Reset text color to black
      
      doc.setFontSize(14);
      doc.setTextColor(59, 130, 246); // Blue text for sections
      doc.text('Report Parameters', 14, 50);
      doc.setTextColor(0, 0, 0); // Reset to black
      doc.setFontSize(10);
      doc.text(`Date Range: ${format(dateRange.start, 'MM/dd/yyyy')} - ${format(dateRange.end, 'MM/dd/yyyy')}`, 14, 60);
      doc.text(`Category Filter: ${selectedCategory}`, 14, 70);
      
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246); // Blue text for sections
      doc.text('Account Summary', 14, 85);
      doc.setTextColor(0, 0, 0); // Reset to black
      
      const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
      
      doc.autoTable({
        startY: 90,
        head: [['Account Name', 'Type', 'Balance']],
        body: accounts.map((account) => [
          account.name,
          account.type,
          formatCurrency(account.balance || 0)
        ]),
        foot: [['Total Balance', '', formatCurrency(totalBalance)]],
        headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
        footStyles: { fillColor: [241, 245, 249], textColor: [0, 0, 0] },
        alternateRowStyles: { fillColor: [249, 250, 251] },
      });
      
      const finalY1 = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text('Financial Summary', 14, finalY1);
      doc.setTextColor(0, 0, 0);
      
      doc.autoTable({
        startY: finalY1 + 5,
        body: [
          ['Total Income', formatCurrency(financialSummary.totalIncome)],
          ['Total Expenses', formatCurrency(financialSummary.totalExpenses)],
          ['Net Balance', formatCurrency(financialSummary.balance)]
        ],
        styles: { fontSize: 12, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [249, 250, 251] },
      });
      
      const finalY2 = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text('Category Summary', 14, finalY2);
      doc.setTextColor(0, 0, 0);
      
      const categorySummary = filteredTransactions.reduce((acc, tx) => {
        const category = tx.category || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = {
            income: 0,
            expense: 0,
            count: 0
          };
        }
        
        if (tx.type === 'income') {
          acc[category].income += tx.amount;
        } else if (tx.type === 'expense') {
          acc[category].expense += Math.abs(tx.amount);
        }
        
        acc[category].count += 1;
        return acc;
      }, {} as Record<string, { income: number; expense: number; count: number }>);
      
      const categorySummaryData = Object.entries(categorySummary).map(([category, data]) => [
        category,
        formatCurrency(data.income),
        formatCurrency(data.expense),
        data.income - data.expense > 0 
          ? formatCurrency(data.income - data.expense)
          : formatCurrency(data.income - data.expense),
        data.count
      ]);
      
      doc.autoTable({
        startY: finalY2 + 5,
        head: [['Category', 'Income', 'Expense', 'Net', 'Transactions']],
        body: categorySummaryData,
        headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [249, 250, 251] },
      });
      
      const finalY3 = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text('Transactions', 14, finalY3);
      doc.setTextColor(0, 0, 0);
        
      const transactionsData = filteredTransactions.map(tx => [
        format(new Date(tx.transaction_date || tx.date || ''), 'MM/dd/yyyy'),
        tx.description || 'No description',
        tx.category || 'Uncategorized',
        tx.type === 'income' ? 'Income' : 'Expense',
        tx.type === 'income' 
          ? formatCurrency(tx.amount) 
          : formatCurrency(-Math.abs(tx.amount))
      ]);
      
      doc.autoTable({
        startY: finalY3 + 5,
        head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
        body: transactionsData,
        headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        columnStyles: {
          4: { halign: 'right' }
        },
      });
      
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(156, 163, 175);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      doc.save('financial-report.pdf');

      toast({
        title: "Report Generated",
        description: "Your financial report has been downloaded",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate the report",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const previewReport = () => {
    const previewWindow = window.open('', '_blank');
    if (!previewWindow) {
      toast({
        title: "Error",
        description: "Failed to open preview window. Please disable popup blocker and try again.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Financial Report</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.5;
            max-width: 1000px;
            margin: 20px auto;
            padding: 20px;
            color: #333;
          }
          
          h1, h2 {
            color: #333;
            margin-bottom: 10px;
          }
          
          .date {
            color: #666;
            margin-bottom: 30px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          
          th, td {
            text-align: left;
            padding: 12px;
            border: 1px solid #ddd;
          }
          
          th {
            background-color: #f8f9fa;
            font-weight: 500;
          }
          
          .amount {
            text-align: right;
          }
          
          .section {
            margin-bottom: 40px;
          }
          
          .total-row {
            font-weight: bold;
            background-color: #f8f9fa;
          }
          
          .expense {
            color: #dc2626;
          }
          
          .income {
            color: #059669;
          }
          
          .print-button {
            background-color: #3b82f6;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-bottom: 20px;
          }
          
          .print-button:hover {
            background-color: #2563eb;
          }
          
          .footer-note {
            color: #666;
            font-size: 0.9em;
            margin-top: 40px;
            text-align: center;
          }
          
          .chart-container {
            margin: 20px 0;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #fafafa;
          }
          
          .chart-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          
          .chart-box {
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            height: 300px;
          }
          
          .chart-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #333;
            text-align: center;
          }
          
          .chart-wrapper {
            height: 250px;
            position: relative;
          }
          
          canvas {
            max-width: 100%;
            height: 250px !important;
            width: 100% !important;
          }
          
          @media (max-width: 768px) {
            .chart-grid {
              grid-template-columns: 1fr;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-controls">
          <button class="print-button" onclick="window.print()">Print Report</button>
          <button class="print-button" onclick="exportCSVFromPreview()" style="margin-left: 10px; background-color: #10b981;">Export CSV</button>
        </div>
        
        <h1>Financial Report</h1>
        <p class="date">Generated on ${format(new Date(), 'MMMM d, yyyy')}</p>

        <div class="section">
          <h2>Account Summary</h2>
          <table>
            <thead>
              <tr>
                <th>Account Name</th>
                <th>Type</th>
                <th class="amount">Balance</th>
              </tr>
            </thead>
            <tbody>
              ${accounts.map(account => `
                <tr>
                  <td>${account.name}</td>
                  <td>${account.type}</td>
                  <td class="amount">${formatCurrency(account.balance || 0)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="2">Total Balance</td>
                <td class="amount">${formatCurrency(
                  accounts.reduce((sum, account) => sum + (account.balance || 0), 0)
                )}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Charts Section -->
        <div class="section">
          <h2>Financial Visualizations</h2>
          <div class="chart-container">
            <div class="chart-grid">
              <div class="chart-box">
                <div class="chart-title">Transaction Trends</div>
                <div class="chart-wrapper">
                  <canvas id="transactionChart" width="400" height="250"></canvas>
                </div>
              </div>
              <div class="chart-box">
                <div class="chart-title">Category Breakdown</div>
                <div class="chart-wrapper">
                  <canvas id="categoryChart" width="400" height="250"></canvas>
                </div>
              </div>
              <div class="chart-box">
                <div class="chart-title">Account Balances</div>
                <div class="chart-wrapper">
                  <canvas id="accountChart" width="400" height="250"></canvas>
                </div>
              </div>
              <div class="chart-box">
                <div class="chart-title">Financial Summary</div>
                <div class="chart-wrapper">
                  <canvas id="summaryChart" width="400" height="250"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Category Summary</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th class="amount">Amount</th>
                <th>% of Total</th>
                <th>Transactions</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(
                filteredTransactions.reduce((acc, tx) => {
                  const category = tx.category || 'Uncategorized';
                  if (!acc[category]) {
                    acc[category] = { amount: 0, count: 0 };
                  }
                  acc[category].amount += tx.amount;
                  acc[category].count += 1;
                  return acc;
                }, {} as Record<string, { amount: number; count: number }>)
              )
                .map(([category, data]) => `
                  <tr>
                    <td>${category}</td>
                    <td class="amount">${formatCurrency(data.amount)}</td>
                    <td>${((data.amount / financialSummary.totalIncome) * 100).toFixed(1)}%</td>
                    <td>${data.count}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Recent Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th class="amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTransactions
                .slice(0, 15)
                .map(tx => `
                  <tr>
                    <td>${format(new Date(tx.transaction_date || tx.date || ''), 'MMM dd, yyyy')}</td>
                    <td>${tx.description || 'No description'}</td>
                    <td>${tx.category || 'Uncategorized'}</td>
                    <td>${tx.type === 'income' ? 'Income' : 'Expense'}</td>
                    <td class="amount ${tx.type === 'income' ? 'income' : 'expense'}">
                      ${tx.type === 'income' 
                        ? formatCurrency(tx.amount) 
                        : formatCurrency(-Math.abs(tx.amount))
                      }
                    </td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Financial Summary</h2>
          <table>
            <tbody>
              <tr>
                <td>Total Income</td>
                <td class="amount income">${formatCurrency(financialSummary.totalIncome)}</td>
              </tr>
              <tr>
                <td>Total Expenses</td>
                <td class="amount expense">${formatCurrency(financialSummary.totalExpenses)}</td>
              </tr>
              <tr class="total-row">
                <td>Net Balance</td>
                <td class="amount ${financialSummary.balance >= 0 ? 'income' : 'expense'}">
                  ${formatCurrency(financialSummary.balance)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="footer-note">
          This is a preview of your financial report. You can download the full PDF version for a more detailed report.
        </p>

        <script>
          // Prepare chart data
          const chartData = ${JSON.stringify(chartData)};
          const categoryData = ${JSON.stringify(categoryChartData)};
          const accountData = ${JSON.stringify(accountChartData)};
          const financialSummary = ${JSON.stringify(financialSummary)};
          const filteredTransactions = ${JSON.stringify(filteredTransactions)};
          const accounts = ${JSON.stringify(accounts)};
          const dateRange = ${JSON.stringify(dateRange)};

          // CSV Export function for preview window
          function exportCSVFromPreview() {
            const currentDate = new Date().toISOString().split('T')[0];
            const startDate = new Date(dateRange.start).toISOString().split('T')[0];
            const endDate = new Date(dateRange.end).toISOString().split('T')[0];
            const dateRangeStr = startDate + '_to_' + endDate;
            
            // Create CSV content
            const csvRows = [
              'Date,Description,Category,Type,Amount,Account',
              ...filteredTransactions.map(tx => {
                const date = new Date(tx.transaction_date || tx.date || '').toISOString().split('T')[0];
                const description = (tx.description || 'No description').replace(/"/g, '""');
                const category = (tx.category || 'Uncategorized').replace(/"/g, '""');
                const type = tx.type === 'income' ? 'Income' : 'Expense';
                const amount = tx.type === 'income' ? tx.amount : -Math.abs(tx.amount);
                const account = 'Unknown'; // Account info not available in transaction data
                
                return date + ',"' + description + '","' + category + '","' + type + '",' + amount + ',"' + account + '"';
              }),
              '',
              'Summary',
              'Total Income,$' + financialSummary.totalIncome.toFixed(2),
              'Total Expenses,$' + financialSummary.totalExpenses.toFixed(2),
              'Net Balance,$' + financialSummary.balance.toFixed(2),
              '',
              'Account Balances',
              ...accounts.map(account => 
                account.name + ' (' + account.type + '),$' + (account.balance || 0).toFixed(2)
              ),
              'Total Balance,$' + accounts.reduce((sum, account) => sum + (account.balance || 0), 0).toFixed(2)
            ];
            
            const csvContent = csvRows.join('\\n');
            
            // Create and download the file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'financial-report_' + dateRangeStr + '_' + currentDate + '.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // CSV file downloaded silently without popup
          }

          // Transaction Trends Chart
          const transactionCtx = document.getElementById('transactionChart').getContext('2d');
          new Chart(transactionCtx, {
            type: 'line',
            data: {
              labels: chartData.map(d => d.date),
              datasets: [
                {
                  label: 'Income',
                  data: chartData.map(d => d.income),
                  borderColor: '#10b981',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  fill: true,
                  tension: 0.4
                },
                {
                  label: 'Expenses',
                  data: chartData.map(d => d.expenses),
                  borderColor: '#ef4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  fill: true,
                  tension: 0.4
                }
              ]
            },
            options: {
              responsive: false,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  position: 'top',
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return '$' + value.toLocaleString();
                    }
                  }
                }
              }
            }
          });

          // Category Breakdown Chart
          const categoryCtx = document.getElementById('categoryChart').getContext('2d');
          new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
              labels: categoryData.map(d => d.name),
              datasets: [{
                data: categoryData.map(d => d.value),
                backgroundColor: categoryData.map(d => d.color),
                borderWidth: 2,
                borderColor: '#fff'
              }]
            },
            options: {
              responsive: false,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  position: 'bottom',
                }
              }
            }
          });

          // Account Balances Chart
          const accountCtx = document.getElementById('accountChart').getContext('2d');
          new Chart(accountCtx, {
            type: 'bar',
            data: {
              labels: accountData.map(d => d.name),
              datasets: [{
                label: 'Balance',
                data: accountData.map(d => d.balance),
                backgroundColor: '#3b82f6',
                borderColor: '#2563eb',
                borderWidth: 1,
                borderRadius: 4
              }]
            },
            options: {
              responsive: false,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return '$' + value.toLocaleString();
                    }
                  }
                }
              }
            }
          });

          // Financial Summary Chart
          const summaryCtx = document.getElementById('summaryChart').getContext('2d');
          new Chart(summaryCtx, {
            type: 'bar',
            data: {
              labels: ['Income', 'Expenses', 'Net Balance'],
              datasets: [{
                label: 'Amount',
                data: [
                  financialSummary.totalIncome,
                  financialSummary.totalExpenses,
                  Math.abs(financialSummary.balance)
                ],
                backgroundColor: [
                  '#10b981',
                  '#ef4444',
                  financialSummary.balance >= 0 ? '#3b82f6' : '#f59e0b'
                ],
                borderColor: [
                  '#059669',
                  '#dc2626',
                  financialSummary.balance >= 0 ? '#2563eb' : '#d97706'
                ],
                borderWidth: 1,
                borderRadius: 4
              }]
            },
            options: {
              responsive: false,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return '$' + value.toLocaleString();
                    }
                  }
                }
              }
            }
          });
        </script>
      </body>
      </html>
    `;
    
    previewWindow.document.write(html);
    previewWindow.document.close();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-2xl font-semibold mb-6">Financial Report</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <DateRangeSelector
            startDate={dateRange.start}
            endDate={dateRange.end}
            onDateRangeChange={handleDateRangeChange}
            onPresetChange={handleDatePresetChange}
          />
        </div>
        
        <div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category-filter" className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Categories">All Categories</SelectItem>
              {availableCategories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button 
            onClick={previewReport}
            className="flex items-center gap-2"
            variant="outline"
          >
            <FileText size={18} />
            Preview Report
          </Button>
          
          {/* <Button 
            onClick={generatePDF}
            className="flex items-center gap-2"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
            {isGenerating ? 'Generating...' : 'Download PDF'}
          </Button> */}

          <Button 
            onClick={exportCSV}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Download size={18} />
            Export CSV
          </Button>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Total Income</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(financialSummary.totalIncome)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(financialSummary.totalExpenses)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Balance</p>
            <p className={`text-2xl font-bold ${financialSummary.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(financialSummary.balance)}
            </p>
          </div>
        </div>
      </div>

      {/* Chart Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Transaction Trends Chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Transaction Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value, name) => [`$${value}`, name]}
                      labelStyle={{ color: '#374151' }}
                      contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="income" 
                      stroke="#10b981" 
                      fill="url(#colorIncome)" 
                      name="Income"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="#ef4444" 
                      fill="url(#colorExpenses)" 
                      name="Expenses"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No transaction data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown Chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {categoryChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No category data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Balances Chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Account Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {accountChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={accountChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Balance']}
                      labelStyle={{ color: '#374151' }}
                      contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                    />
                    <Bar dataKey="balance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No account data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary Chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={[
                    { name: 'Income', value: financialSummary.totalIncome, color: '#10b981' },
                    { name: 'Expenses', value: financialSummary.totalExpenses, color: '#ef4444' },
                    { name: 'Net Balance', value: Math.abs(financialSummary.balance), color: financialSummary.balance >= 0 ? '#3b82f6' : '#f59e0b' }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Amount']}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {[
                      { name: 'Income', value: financialSummary.totalIncome, color: '#10b981' },
                      { name: 'Expenses', value: financialSummary.totalExpenses, color: '#ef4444' },
                      { name: 'Net Balance', value: Math.abs(financialSummary.balance), color: financialSummary.balance >= 0 ? '#3b82f6' : '#f59e0b' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Transactions Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
          <TableBody>
            {filteredTransactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{format(new Date(tx.transaction_date || tx.date || ''), 'MM/dd/yyyy')}</TableCell>
                <TableCell>{tx.description || 'No description'}</TableCell>
                <TableCell>{tx.category || 'Uncategorized'}</TableCell>
                <TableCell>{tx.type === 'income' ? 'Income' : 'Expense'}</TableCell>
                <TableCell className={`text-right ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'income' 
                    ? formatCurrency(tx.amount) 
                    : formatCurrency(-Math.abs(tx.amount))
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionReport;

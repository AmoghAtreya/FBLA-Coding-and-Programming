
import React, { useState } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { useCategoryStats } from '@/hooks/useCategoryStats';
import { useAccounts } from '@/context/AccountContext';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Download } from 'lucide-react';

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

  // Format currency consistently
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Generate and download PDF report
  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      // Create a new PDF document
      const doc = new jsPDF();
      const currentDate = format(new Date(), 'MMMM d, yyyy');
      
      // Add header with logo or title
      doc.setFillColor(59, 130, 246); // Blue background
      doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
      doc.setTextColor(255, 255, 255); // White text
      doc.setFontSize(24);
      doc.text('Financial Report', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`Generated on ${currentDate}`, 105, 30, { align: 'center' });
      doc.setTextColor(0, 0, 0); // Reset text color to black
      
      // Add Account Summary
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246); // Blue text for sections
      doc.text('Account Summary', 14, 50);
      doc.setTextColor(0, 0, 0); // Reset to black
      
      const totalBalance = accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
      
      doc.autoTable({
        startY: 55,
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
      
      // Add Category Summary
      const finalY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text('Category Summary', 14, finalY);
      doc.setTextColor(0, 0, 0);
      
      // Separate income and expense categories
      const incomeCategories = categories.filter(cat => cat.type === 'income');
      const expenseCategories = categories.filter(cat => cat.type === 'expense');
      
      // Expense Categories Table
      const expenseCategoriesData = expenseCategories.map(cat => [
        cat.name,
        formatCurrency(cat.spent || 0),
        `${cat.percentage}%`,
        cat.transactions
      ]);
      
      doc.autoTable({
        startY: finalY + 5,
        head: [['Expense Category', 'Amount Spent', '% of Total', 'Transactions']],
        body: expenseCategoriesData,
        headStyles: { fillColor: [239, 68, 68], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [249, 250, 251] },
      });
      
      // Income Categories Table
      const finalY2 = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text('Income Categories', 14, finalY2);
      doc.setTextColor(0, 0, 0);
      
      const incomeCategoriesData = incomeCategories.map(cat => [
        cat.name,
        formatCurrency(cat.spent || 0),
        cat.transactions
      ]);
      
      doc.autoTable({
        startY: finalY2 + 5,
        head: [['Income Category', 'Amount Received', 'Transactions']],
        body: incomeCategoriesData,
        headStyles: { fillColor: [34, 197, 94], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [249, 250, 251] },
      });
      
      // Add Recent Transactions
      const finalY3 = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text('Recent Transactions', 14, finalY3);
      doc.setTextColor(0, 0, 0);
      
      // Get most recent 20 transactions
      const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.transaction_date || b.date || '').getTime() - 
                        new Date(a.transaction_date || a.date || '').getTime())
        .slice(0, 20);
        
      const transactionsData = recentTransactions.map(tx => [
        format(new Date(tx.transaction_date || tx.date || ''), 'MMM dd, yyyy'),
        tx.description || 'No description',
        tx.type === 'income' ? 'Income' : 'Expense',
        tx.category || 'Uncategorized',
        formatCurrency(tx.amount || 0)
      ]);
      
      doc.autoTable({
        startY: finalY3 + 5,
        head: [['Date', 'Description', 'Type', 'Category', 'Amount']],
        body: transactionsData,
        headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        columnStyles: {
          4: { halign: 'right' }
        },
      });
      
      // Add Financial Summary
      const finalY4 = (doc as any).lastAutoTable.finalY + 15;
      
      // Calculate total income, expenses and balance
      const totalIncome = transactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0);
        
      const totalExpenses = transactions
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
        
      const netBalance = totalIncome - totalExpenses;
      
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text('Financial Summary', 14, finalY4);
      doc.setTextColor(0, 0, 0);
      
      doc.autoTable({
        startY: finalY4 + 5,
        body: [
          ['Total Income', formatCurrency(totalIncome)],
          ['Total Expenses', formatCurrency(totalExpenses)],
          ['Net Balance', formatCurrency(netBalance)]
        ],
        styles: { fontSize: 12, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [249, 250, 251] },
      });
      
      // Add footer with page numbers
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
      
      // Save the PDF
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
    // Open a new window with a styled HTML preview
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
    
    // Prepare account data
    const accountsHtml = accounts.map(account => `
      <tr>
        <td>${account.name}</td>
        <td>${account.type}</td>
        <td>${formatCurrency(account.balance || 0)}</td>
      </tr>
    `).join('');
    
    // Prepare category data
    const expenseCategoriesHtml = categories
      .filter(cat => cat.type === 'expense')
      .map(cat => `
        <tr>
          <td>${cat.name}</td>
          <td>${formatCurrency(cat.spent || 0)}</td>
          <td>${cat.percentage}%</td>
          <td>${cat.transactions}</td>
        </tr>
      `).join('');
      
    const incomeCategoriesHtml = categories
      .filter(cat => cat.type === 'income')
      .map(cat => `
        <tr>
          <td>${cat.name}</td>
          <td>${formatCurrency(cat.spent || 0)}</td>
          <td>${cat.transactions}</td>
        </tr>
      `).join('');
    
    // Prepare transaction data
    const recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.transaction_date || b.date || '').getTime() - 
                      new Date(a.transaction_date || a.date || '').getTime())
      .slice(0, 20);
      
    const transactionsHtml = recentTransactions.map(tx => `
      <tr>
        <td>${format(new Date(tx.transaction_date || tx.date || ''), 'MMM dd, yyyy')}</td>
        <td>${tx.description || 'No description'}</td>
        <td>${tx.type === 'income' ? 'Income' : 'Expense'}</td>
        <td>${tx.category || 'Uncategorized'}</td>
        <td class="${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}">${formatCurrency(tx.amount || 0)}</td>
      </tr>
    `).join('');
    
    // Calculate summary metrics
    const totalIncome = transactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
      
    const totalExpenses = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      
    const netBalance = totalIncome - totalExpenses;
    
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Financial Report Preview</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <style>
          body { 
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px 12px;
            text-align: left;
          }
          th {
            background-color: #f8f9fa;
            font-weight: bold;
          }
          .text-green-600 { color: #059669; }
          .text-red-600 { color: #dc2626; }
          .print-button {
            background-color: #3b82f6;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-bottom: 20px;
          }
          .print-button:hover {
            background-color: #2563eb;
          }
        </style>
      </head>
      <body>
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl font-bold">Financial Report</h1>
          <button class="print-button" onclick="window.print()">Print Report</button>
        </div>
        <p class="mb-6">Generated on ${format(new Date(), 'MMMM d, yyyy')}</p>
        
        <h2 class="text-xl font-bold mb-3">Account Summary</h2>
        <table>
          <thead>
            <tr>
              <th>Account Name</th>
              <th>Type</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            ${accountsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" class="font-bold">Total Balance</td>
              <td class="font-bold">${formatCurrency(accounts.reduce((sum, account) => sum + (account.balance || 0), 0))}</td>
            </tr>
          </tfoot>
        </table>
        
        <h2 class="text-xl font-bold mb-3">Category Summary</h2>
        <h3 class="text-lg font-semibold mb-2">Expense Categories</h3>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount Spent</th>
              <th>% of Total</th>
              <th>Transactions</th>
            </tr>
          </thead>
          <tbody>
            ${expenseCategoriesHtml}
          </tbody>
        </table>
        
        <h3 class="text-lg font-semibold mb-2">Income Categories</h3>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount Received</th>
              <th>Transactions</th>
            </tr>
          </thead>
          <tbody>
            ${incomeCategoriesHtml}
          </tbody>
        </table>
        
        <h2 class="text-xl font-bold mb-3">Recent Transactions</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${transactionsHtml}
          </tbody>
        </table>
        
        <h2 class="text-xl font-bold mb-3">Financial Summary</h2>
        <table>
          <tbody>
            <tr>
              <td class="font-bold">Total Income</td>
              <td class="text-green-600">${formatCurrency(totalIncome)}</td>
            </tr>
            <tr>
              <td class="font-bold">Total Expenses</td>
              <td class="text-red-600">${formatCurrency(totalExpenses)}</td>
            </tr>
            <tr>
              <td class="font-bold">Net Balance</td>
              <td class="${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}">${formatCurrency(netBalance)}</td>
            </tr>
          </tbody>
        </table>
        
        <p class="mt-10 text-sm text-gray-500">This is a preview of your financial report. You can download the PDF version for a more detailed report.</p>
      </body>
      </html>
    `;
    
    previewWindow.document.write(html);
    previewWindow.document.close();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Financial Report</h2>
      </div>
      <p className="text-gray-600 mb-6">
        Generate a comprehensive report of your financial data including accounts, transactions, and category summaries.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={previewReport}
          className="flex items-center gap-2"
          variant="outline"
        >
          <FileText size={18} />
          Preview Report
        </Button>
        <Button 
          onClick={generatePDF} 
          disabled={isGenerating} 
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download size={18} />
              Download PDF Report
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default TransactionReport;

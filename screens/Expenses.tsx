import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CURRENCY } from '../constants';
import { Expense } from '../types';
import { DollarSign, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const Expenses: React.FC = () => {
  const { expenses, addExpense } = useApp();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Expense['category']>('Other');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const categories: Expense['category'][] = ['Fuel', 'Soap', 'Utility', 'Salary', 'Maintenance', 'Other'];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    addExpense({
      id: `exp-${Date.now()}`,
      title,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split('T')[0]
    });

    setTitle('');
    setAmount('');
    setCategory('Other');
    setCurrentPage(1);
  };

  const today = new Date().toISOString().split('T')[0];
  const todayTotal = expenses.filter(e => e.date === today).reduce((sum, e) => sum + e.amount, 0);
  
  const totalPages = Math.ceil(expenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = expenses.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Expenses</h2>
           <p className="text-gray-500 font-medium">Track operational costs.</p>
        </div>
        <div className="bg-red-50 px-6 py-3 rounded-2xl border border-red-100 text-right">
           <p className="text-xs font-bold text-red-400 uppercase tracking-widest">Today's Total</p>
           <p className="text-2xl font-black text-red-600">{CURRENCY} {todayTotal}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Expense Form */}
        <div className="md:col-span-1">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 text-white sticky top-6">
            <h3 className="font-bold text-xl mb-6 flex items-center">
              Record New Expense
            </h3>
            <form onSubmit={handleAdd} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Description</label>
                <input 
                  type="text" 
                  placeholder="e.g. Liquid Soap"
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-500 focus:bg-white/20 outline-none transition-all font-medium"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-slate-400"><DollarSign size={20} /></span>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    className="w-full pl-10 p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-500 focus:bg-white/20 outline-none transition-all font-mono text-lg"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Category</label>
                <select 
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white outline-none focus:bg-white/20 appearance-none font-medium"
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                >
                  {categories.map(c => <option key={c} value={c} className="text-slate-900">{c}</option>)}
                </select>
              </div>

              <button type="submit" className="w-full py-4 bg-white text-slate-900 font-black rounded-2xl shadow-lg hover:bg-gray-100 transition-all active:scale-95 mt-4">
                Save Entry
              </button>
            </form>
          </div>
        </div>

        {/* Expense List */}
        <div className="md:col-span-2 flex flex-col h-full">
           <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-6 min-h-[500px] relative">
             {expenses.length === 0 ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <ArrowUpRight size={32} className="text-gray-300" />
                 </div>
                 <p className="text-lg font-bold text-slate-900">No expenses yet</p>
                 <p className="text-gray-400">Add operational costs to track profit.</p>
               </div>
             ) : (
               <div className="space-y-3">
                 {paginatedExpenses.map(expense => (
                   <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 group">
                      <div className="flex items-center space-x-4">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${
                           expense.category === 'Salary' ? 'bg-blue-100 text-blue-600' :
                           expense.category === 'Fuel' ? 'bg-orange-100 text-orange-600' :
                           'bg-white text-gray-500'
                         }`}>
                            {expense.category === 'Fuel' ? '⛽' : expense.category === 'Soap' ? '🧼' : '🧾'}
                         </div>
                         <div>
                            <h4 className="font-bold text-slate-900">{expense.title}</h4>
                            <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                              <span className="font-medium">{expense.date}</span>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span className="uppercase tracking-wide">{expense.category}</span>
                            </div>
                         </div>
                      </div>
                      <p className="font-black text-slate-900 text-lg group-hover:text-red-600 transition-colors">-{CURRENCY}{expense.amount}</p>
                   </div>
                 ))}
               </div>
             )}

             {/* Pagination */}
             {expenses.length > 0 && (
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-400 font-bold">Page {currentPage}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
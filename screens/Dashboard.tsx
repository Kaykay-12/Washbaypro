import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CURRENCY } from '../constants';
import { generateBusinessInsight } from '../services/geminiService';
import { CheckCircle, TrendingUp, AlertCircle, Sparkles, Car, Calendar, ArrowRight } from 'lucide-react';
import { BarChart, Bar, Tooltip, ResponsiveContainer } from 'recharts';

export const Dashboard: React.FC = () => {
  const { jobs, expenses, setCurrentScreen } = useApp();
  const [insight, setInsight] = useState<string>("Analysing today's data...");
  const [loadingAi, setLoadingAi] = useState(false);

  // Calculate Stats
  const today = new Date().toISOString().split('T')[0];
  const todayJobs = jobs.filter(j => j.startTime.startsWith(today));
  const totalSales = todayJobs.reduce((acc, j) => acc + j.totalAmount, 0);
  const totalCars = todayJobs.length;
  const activeJobs = jobs.filter(j => j.status !== 'Completed' && j.status !== 'Paid').length;
  const totalExpenses = expenses.filter(e => e.date === today).reduce((acc, e) => acc + e.amount, 0);

  const fetchInsight = async () => {
    setLoadingAi(true);
    const text = await generateBusinessInsight(jobs, expenses);
    setInsight(text);
    setLoadingAi(false);
  };

  useEffect(() => {
    if (jobs.length > 0) fetchInsight();
    else setInsight("Start adding jobs to unlock AI insights!");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartData = [
    { name: 'Mon', sales: 400 },
    { name: 'Tue', sales: 300 },
    { name: 'Wed', sales: totalSales > 0 ? totalSales + 200 : 550 },
    { name: 'Thu', sales: 200 },
    { name: 'Fri', sales: 700 },
    { name: 'Sat', sales: 900 },
    { name: 'Sun', sales: 650 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h2>
          <p className="text-gray-500 font-medium mt-1">Here is what is happening today.</p>
        </div>
        <div className="flex items-center bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
           <Calendar size={18} className="text-gray-400 mr-2" />
           <span className="font-bold text-gray-700 text-sm">{new Date().toDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Stats */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Black "Wallet" Style Card */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
             <div className="absolute top-0 right-0 p-12 opacity-5">
               <div className="w-64 h-64 bg-white rounded-full blur-3xl"></div>
             </div>
             
             <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
               <div className="flex justify-between items-start">
                 <div>
                   <p className="text-slate-400 font-medium text-sm uppercase tracking-widest mb-1">Today's Revenue</p>
                   <h3 className="text-5xl font-black tracking-tight flex items-baseline">
                     <span className="text-2xl mr-1 text-slate-400">{CURRENCY}</span>
                     {totalSales.toLocaleString()}
                   </h3>
                 </div>
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                   <TrendingUp className="text-gh-yellow" size={24} />
                 </div>
               </div>
               
               <div className="flex space-x-3">
                 <button 
                  onClick={() => setCurrentScreen('new-job')}
                  className="bg-white text-slate-900 px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-colors flex items-center"
                >
                    New Transaction <ArrowRight size={16} className="ml-2" />
                 </button>
                 <button 
                  onClick={() => setCurrentScreen('expenses')}
                  className="bg-white/10 text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-white/20 transition-colors border border-white/10"
                >
                    Add Expense
                 </button>
               </div>
             </div>
          </div>

          {/* Secondary Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
               <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-3">
                 <Car size={24} />
               </div>
               <p className="text-3xl font-black text-slate-900">{totalCars}</p>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">Cars Washed</p>
            </div>
            
            <div 
              onClick={() => setCurrentScreen('queue')}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow cursor-pointer group"
            >
               <div className="w-12 h-12 bg-gh-yellow/20 text-yellow-700 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-gh-yellow group-hover:text-black transition-colors">
                 <CheckCircle size={24} />
               </div>
               <p className="text-3xl font-black text-slate-900">{activeJobs}</p>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">In Queue</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
               <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-3">
                 <AlertCircle size={24} />
               </div>
               <p className="text-3xl font-black text-slate-900">{CURRENCY}{totalExpenses}</p>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">Expenses</p>
            </div>
          </div>
        </div>

        {/* Right Column - Chart & AI */}
        <div className="space-y-6">
          {/* AI Insight Widget */}
          <div className="bg-gradient-to-br from-gh-red to-red-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
             <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                   <Sparkles size={18} className="text-white" />
                </div>
                <span className="font-bold text-sm tracking-wide opacity-90">AI ASSISTANT</span>
             </div>
             <p className="text-lg font-medium leading-relaxed opacity-95">
                "{loadingAi ? 'Calculating insights...' : insight}"
             </p>
             <div className="mt-4 pt-4 border-t border-white/20">
               <button onClick={fetchInsight} className="text-xs font-bold uppercase tracking-widest opacity-80 hover:opacity-100">Refresh Analysis</button>
             </div>
          </div>

          {/* Mini Chart */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-64">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900">Weekly Trend</h3>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">+12.5%</span>
             </div>
             <div className="flex-1 w-full" style={{ minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <Bar dataKey="sales" fill="#1e293b" radius={[6, 6, 6, 6]} barSize={20} />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backgroundColor: '#1e293b', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
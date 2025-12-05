import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CURRENCY } from '../constants';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Reports: React.FC = () => {
  const { jobs } = useApp();
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paidJobs = jobs.filter(j => j.status === 'Paid' || j.status === 'Completed');
  const totalRevenue = paidJobs.reduce((acc, j) => acc + j.totalAmount, 0);

  // Pagination Logic
  const totalPages = Math.ceil(paidJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = paidJobs.slice(startIndex, startIndex + itemsPerPage);

  // Data for Service Popularity
  const serviceCounts: Record<string, number> = {};
  paidJobs.forEach(job => {
    job.services.forEach(s => {
      serviceCounts[s.name] = (serviceCounts[s.name] || 0) + 1;
    });
  });
  
  const pieData = Object.keys(serviceCounts).map(name => ({
    name,
    value: serviceCounts[name]
  }));

  const COLORS = ['#CE1126', '#FCD116', '#006B3F', '#000000', '#FF8042'];
  const hasData = pieData.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-gray-500 font-medium mb-2">Total Revenue (All Time)</h3>
           <p className="text-4xl font-black text-slate-900">{CURRENCY} {totalRevenue}</p>
           <p className="text-sm text-green-600 mt-2 font-medium">▲ 12% vs last month</p>
        </div>

        {/* Top Services Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
           <h3 className="text-gray-800 font-bold mb-4 w-full text-left">Popular Services</h3>
           
           {/* Explicit height container to resolve Recharts size warning */}
           <div style={{ width: '100%', height: 300 }}>
             {hasData ? (
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={pieData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={90}
                     fill="#8884d8"
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {pieData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip 
                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                   />
                 </PieChart>
               </ResponsiveContainer>
             ) : (
               <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                 No completed services yet to analyze.
               </div>
             )}
           </div>
           <div className="flex flex-wrap gap-2 justify-center mt-2">
             {pieData.map((entry, index) => (
               <div key={entry.name} className="flex items-center text-xs">
                 <span className="w-2 h-2 rounded-full mr-1" style={{backgroundColor: COLORS[index % COLORS.length]}}></span>
                 {entry.name}
               </div>
             ))}
           </div>
        </div>
      </div>
      
      {/* Transaction List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800">Transaction History</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-white text-gray-500">
            <tr>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Service</th>
              <th className="p-4 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paidJobs.length > 0 ? (
              paginatedJobs.map(job => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="p-4 text-gray-500">{new Date(job.startTime).toLocaleDateString()}</td>
                  <td className="p-4 font-medium">{job.customerName}</td>
                  <td className="p-4 text-gray-600">{job.services[0]?.name} {job.services.length > 1 && `+${job.services.length - 1}`}</td>
                  <td className="p-4 font-bold text-right text-slate-900">{CURRENCY} {job.totalAmount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {paidJobs.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + itemsPerPage, paidJobs.length)}</span> of <span className="font-medium">{paidJobs.length}</span> results
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-600"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-600"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
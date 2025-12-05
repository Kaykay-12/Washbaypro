import React from 'react';
import { useApp } from '../context/AppContext';
import { Job, JobStatus, PaymentMethod } from '../types';
import { CURRENCY, VEHICLE_ICONS } from '../constants';
import { Clock, CheckCircle, CarFront, Banknote, FileText, ArrowRight } from 'lucide-react';

export const Queue: React.FC = () => {
  const { jobs, updateJobStatus, workers } = useApp();

  const activeJobs = jobs.filter(j => j.status !== JobStatus.PAID);
  
  const getStatusStyle = (status: JobStatus) => {
    switch (status) {
      case JobStatus.QUEUE: return 'bg-gray-100 text-gray-500 border-gray-200';
      case JobStatus.WASHING: return 'bg-blue-50 text-blue-700 border-blue-100';
      case JobStatus.DRYING: return 'bg-orange-50 text-orange-700 border-orange-100';
      case JobStatus.COMPLETED: return 'bg-green-50 text-green-700 border-green-100';
      default: return 'bg-gray-50 text-gray-400';
    }
  };

  const handleNextStatus = (job: Job) => {
    if (job.status === JobStatus.QUEUE) updateJobStatus(job.id, JobStatus.WASHING);
    else if (job.status === JobStatus.WASHING) updateJobStatus(job.id, JobStatus.DRYING);
    else if (job.status === JobStatus.DRYING) updateJobStatus(job.id, JobStatus.COMPLETED);
    else if (job.status === JobStatus.COMPLETED) {
      const method = window.confirm("Receive Payment via Cash?") ? PaymentMethod.CASH : PaymentMethod.MOMO;
      if (method) {
        updateJobStatus(job.id, JobStatus.PAID);
        const message = `Hello ${job.customerName}, thanks for washing with WashBay Pro! Total: ${CURRENCY}${job.totalAmount}. Receipt: #12345`;
        if (window.confirm("Payment Recorded. Send WhatsApp Receipt?")) {
           const formattedPhone = job.customerPhone ? job.customerPhone.replace(/^0/, '233') : '';
           const url = formattedPhone 
             ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
             : `https://wa.me/?text=${encodeURIComponent(message)}`;
           window.open(url, '_blank');
        }
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Live Queue</h2>
          <p className="text-gray-500 font-medium">Manage ongoing jobs and workflow.</p>
        </div>
        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-slate-200">
           {activeJobs.length} Active
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {activeJobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] border border-dashed border-gray-200 text-center">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
               <CarFront size={48} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">All caught up!</h3>
            <p className="text-gray-400 mt-1">No vehicles in the queue right now.</p>
          </div>
        )}

        {activeJobs.map(job => (
          <div key={job.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              {/* Left: Vehicle Info */}
              <div className="flex items-center space-x-5">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border-2 border-gray-100 group-hover:border-slate-900 transition-colors">
                   <span className="text-3xl">{VEHICLE_ICONS[job.vehicleType]}</span>
                   <span className="text-[10px] font-black text-slate-400 uppercase mt-1">Bay {job.bayId}</span>
                </div>
                <div>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">{job.vehiclePlate}</h3>
                   <p className="text-sm font-bold text-gray-400 mb-2">{job.customerName}</p>
                   <div className="flex flex-wrap gap-2">
                     {job.services.map(s => (
                       <span key={s.id} className="text-[10px] font-bold uppercase tracking-wide bg-slate-900 text-white px-2 py-1 rounded-lg">
                         {s.name}
                       </span>
                     ))}
                   </div>
                </div>
              </div>

              {/* Middle: Notes & Timer */}
              {(job.notes || job.startTime) && (
                <div className="flex-1 md:px-8 border-l border-gray-100 hidden md:block">
                   {job.notes && (
                     <div className="flex items-start space-x-2 bg-yellow-50 p-3 rounded-xl mb-2">
                       <FileText size={14} className="text-yellow-600 mt-0.5 shrink-0" />
                       <p className="text-xs font-medium text-yellow-800 line-clamp-2">{job.notes}</p>
                     </div>
                   )}
                   <div className="flex items-center space-x-2 text-xs font-bold text-gray-400">
                      <Clock size={14} />
                      <span>In {job.status} since {new Date(job.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                   </div>
                   <div className="mt-1 text-xs font-medium text-slate-500">
                     Attendant: <span className="text-slate-900 font-bold">{workers.find(w => w.id === job.assignedWorkerId)?.name || 'N/A'}</span>
                   </div>
                </div>
              )}

              {/* Right: Actions & Status */}
              <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-gray-50 pt-4 md:pt-0">
                 <div className="text-right">
                   <p className="text-xl font-black text-slate-900">{CURRENCY}{job.totalAmount}</p>
                   <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase border ${getStatusStyle(job.status)}`}>
                     {job.status}
                   </span>
                 </div>

                 <button 
                  onClick={() => handleNextStatus(job)}
                  className={`h-16 w-16 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-all ${
                    job.status === JobStatus.COMPLETED ? 'bg-green-600 shadow-green-200' : 'bg-slate-900 shadow-slate-200'
                  }`}
                >
                   {job.status === JobStatus.COMPLETED ? <Banknote size={24} /> : <ArrowRight size={24} />}
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CURRENCY } from '../constants';
import { Trash2, Plus, User, Briefcase, Power, Tag, Users, Smartphone, Shield, Mail, CheckCircle, Clock } from 'lucide-react';

export const Settings: React.FC = () => {
  const { services, workers, updateService, addWorker, removeWorker, toggleLoyalty, setToggleLoyalty } = useApp();
  const [activeTab, setActiveTab] = useState<'services' | 'staff' | 'app'>('services');

  // New Worker State
  const [workerName, setWorkerName] = useState('');
  const [workerEmail, setWorkerEmail] = useState('');
  const [workerRole, setWorkerRole] = useState<'Attendant' | 'Manager'>('Attendant');

  const handleAddWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerName || !workerEmail) return;
    addWorker({
      id: `w-${Date.now()}`,
      name: workerName,
      email: workerEmail,
      role: workerRole,
      status: 'Pending'
    });
    setWorkerName('');
    setWorkerEmail('');
  };

  const handlePriceUpdate = (serviceId: string, newPrice: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service && !isNaN(parseFloat(newPrice))) {
      updateService({ ...service, price: parseFloat(newPrice) });
    }
  };

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-4 text-center font-bold text-sm transition-all rounded-xl flex items-center justify-center space-x-2 ${
        activeTab === id 
          ? 'bg-slate-900 text-white shadow-lg' 
          : 'bg-white text-gray-500 hover:bg-gray-50'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="mb-6">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h2>
        <p className="text-gray-500 font-medium">Configure your business rules.</p>
      </div>

      <div className="flex p-1 bg-gray-100 rounded-2xl">
        <TabButton id="services" label="Services" icon={Tag} />
        <TabButton id="staff" label="Team & Roles" icon={Users} />
        <TabButton id="app" label="App Config" icon={Smartphone} />
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 min-h-[500px]">
        
        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
               <h3 className="font-bold text-xl text-slate-900">Service Price List</h3>
               <button className="text-xs bg-slate-900 text-white px-4 py-2 rounded-lg font-bold flex items-center"><Plus size={14} className="mr-1"/> Add New</button>
             </div>
             
             <div className="space-y-3">
               {services.map(s => (
                 <div key={s.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:border-slate-200 transition-colors">
                    <div>
                      <p className="font-bold text-slate-900">{s.name}</p>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase">{s.category}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                       <span className="text-gray-400 font-medium text-sm">GHS</span>
                       <input 
                          type="number" 
                          className="w-20 p-2 border-2 border-gray-100 rounded-xl bg-gray-50 focus:bg-white focus:border-slate-900 outline-none font-bold text-center"
                          defaultValue={s.price}
                          onBlur={(e) => handlePriceUpdate(s.id, e.target.value)}
                       />
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* Staff Tab */}
        {activeTab === 'staff' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-xl text-slate-900">Current Team</h3>
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">{workers.length} Members</span>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {workers.map(w => (
                    <div key={w.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 group">
                      <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-slate-900 shadow-sm relative">
                           {w.name.charAt(0)}
                           {w.status === 'Active' ? (
                             <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white"><CheckCircle size={8} color="white" /></div>
                           ) : (
                             <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-0.5 border-2 border-white"><Clock size={8} color="white" /></div>
                           )}
                         </div>
                         <div>
                           <p className="font-bold text-slate-900 text-sm">{w.name}</p>
                           <p className="text-[10px] text-gray-500 font-bold uppercase">{w.role}</p>
                           {w.email && <p className="text-[10px] text-gray-400">{w.email}</p>}
                         </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {w.status === 'Pending' && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md font-bold">Invited</span>}
                        <button 
                          onClick={() => removeWorker(w.id)}
                          className="text-gray-300 hover:text-red-500 p-2 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
             
             <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 h-fit">
                <h3 className="font-bold text-xl text-slate-900 mb-2">Invite New Member</h3>
                <p className="text-xs text-gray-500 mb-6 font-medium">Send an email invitation to join the team.</p>
                
                <form onSubmit={handleAddWorker} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Name</label>
                    <input 
                      className="w-full p-4 border-2 border-white rounded-xl bg-white shadow-sm outline-none focus:border-slate-900 font-medium" 
                      placeholder="e.g. Kwame Mensah"
                      value={workerName} 
                      onChange={e => setWorkerName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-4 text-gray-400" size={18} />
                      <input 
                        type="email"
                        className="w-full pl-12 p-4 border-2 border-white rounded-xl bg-white shadow-sm outline-none focus:border-slate-900 font-medium" 
                        placeholder="kwame@example.com"
                        value={workerEmail} 
                        onChange={e => setWorkerEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Role & Access</label>
                    <select 
                      className="w-full p-4 border-2 border-white rounded-xl bg-white shadow-sm outline-none focus:border-slate-900 font-medium appearance-none"
                      value={workerRole}
                      onChange={e => setWorkerRole(e.target.value as any)}
                    >
                       <option value="Attendant">Attendant (Job Assignments)</option>
                       <option value="Cashier">Cashier (Payments Only)</option>
                       <option value="Manager">Manager (Full Access)</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-800 transition-transform active:scale-95 flex items-center justify-center space-x-2">
                    <Mail size={18} />
                    <span>Send Invitation</span>
                  </button>
                </form>
             </div>
          </div>
        )}

        {/* App Tab */}
        {activeTab === 'app' && (
          <div className="space-y-4">
             <div className="flex items-center justify-between p-6 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
               <div className="flex items-center space-x-5">
                 <div className="p-3 bg-yellow-100 text-yellow-700 rounded-xl">
                   <Briefcase size={24} />
                 </div>
                 <div>
                   <h4 className="font-bold text-lg text-slate-900">Loyalty Program</h4>
                   <p className="text-sm text-gray-500">Auto-award points (10 pts = 1 Free Wash)</p>
                 </div>
               </div>
               <button 
                 onClick={() => setToggleLoyalty(!toggleLoyalty)}
                 className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${toggleLoyalty ? 'bg-green-500' : 'bg-gray-200'}`}
               >
                 <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${toggleLoyalty ? 'translate-x-6' : ''}`}></div>
               </button>
             </div>

             <div className="flex items-center justify-between p-6 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
               <div className="flex items-center space-x-5">
                 <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
                   <Shield size={24} />
                 </div>
                 <div>
                   <h4 className="font-bold text-lg text-slate-900">Admin Security</h4>
                   <p className="text-sm text-gray-500">Require PIN for refunds and deletions</p>
                 </div>
               </div>
               <div className="w-14 h-8 bg-gray-200 rounded-full p-1 flex items-center">
                 <div className="bg-white w-6 h-6 rounded-full shadow-md"></div>
               </div>
             </div>

             <div className="p-6 border border-red-100 bg-red-50 rounded-2xl mt-8">
                <h4 className="font-bold text-red-800 mb-2 flex items-center"><Power size={18} className="mr-2"/> Danger Zone</h4>
                <p className="text-sm text-red-600 mb-4">Resetting the app will clear all jobs, customers, and expenses stored locally.</p>
                <button className="bg-white border-2 border-red-100 text-red-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-50 hover:border-red-200">Reset All Data</button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};
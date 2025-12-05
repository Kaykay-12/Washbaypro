import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VehicleType, Service, Customer, JobStatus } from '../types';
import { VEHICLE_ICONS, BAYS, CURRENCY } from '../constants';
import { Search, Camera, Check, Plus, ChevronLeft, ChevronRight, User } from 'lucide-react';

export const NewJob: React.FC = () => {
  const { customers, services, workers, addJob, setCurrentScreen, addCustomer } = useApp();

  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>(VehicleType.SEDAN);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedBay, setSelectedBay] = useState<number>(1);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  // Filter customers
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery) || 
    c.vehiclePlate?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCustomer = () => {
    if (searchQuery.length < 3) return;
    const newC: Customer = {
      id: `c-${Date.now()}`,
      name: 'New Customer',
      phone: searchQuery,
      loyaltyPoints: 0,
      lastVisit: new Date().toISOString()
    };
    addCustomer(newC);
    setSelectedCustomer(newC);
    setSearchQuery('');
    setStep(2);
  };

  const toggleService = (service: Service) => {
    if (selectedServices.find(s => s.id === service.id)) {
      setSelectedServices(prev => prev.filter(s => s.id !== service.id));
    } else {
      setSelectedServices(prev => [...prev, service]);
    }
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCapturedPhoto(ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleFinish = () => {
    if (!selectedCustomer) return;
    const total = selectedServices.reduce((sum, s) => sum + s.price, 0);
    
    addJob({
      id: `job-${Date.now()}`,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      vehiclePlate: vehiclePlate || selectedCustomer.vehiclePlate || 'Unknown',
      vehicleType,
      services: selectedServices,
      totalAmount: total,
      assignedWorkerId: selectedWorkerId || workers[0].id,
      bayId: selectedBay,
      status: JobStatus.QUEUE,
      startTime: new Date().toISOString(),
      notes: notes,
      photos: capturedPhoto ? [capturedPhoto] : []
    });

    setCurrentScreen('queue');
  };

  const totalCost = selectedServices.reduce((sum, s) => sum + s.price, 0);

  // Common Header for steps
  const StepHeader = ({ title, sub }: { title: string, sub: string }) => (
    <div className="mb-8 text-center">
      <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
      <p className="text-gray-500 font-medium mt-2">{sub}</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto pb-20">
      {/* Progress Dots */}
      <div className="flex justify-center space-x-3 mb-8">
        {[1, 2, 3, 4].map(i => (
           <div key={i} className={`h-2 rounded-full transition-all duration-300 ${step >= i ? 'w-8 bg-slate-900' : 'w-2 bg-gray-300'}`}></div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200 p-6 md:p-10 border border-gray-100 min-h-[500px] relative">
        
        {/* Step 1: Customer */}
        {step === 1 && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <StepHeader title="Select Customer" sub="Search for an existing client or add a new one." />
            
            <div className="relative mb-6">
              <Search className="absolute left-4 top-4 text-gray-400" size={24} />
              <input 
                type="text"
                placeholder="Name, Phone or Plate..."
                autoFocus
                className="w-full pl-14 p-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-slate-900 focus:ring-0 text-xl font-bold text-slate-900 transition-all outline-none"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredCustomers.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => { setSelectedCustomer(c); setVehiclePlate(c.vehiclePlate || ''); setStep(2); }}
                  className="w-full p-4 rounded-2xl border-2 border-gray-100 hover:border-slate-900 bg-white flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-lg group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      {c.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-lg text-slate-900">{c.name}</p>
                      <p className="text-sm text-gray-400 font-medium">{c.phone}</p>
                    </div>
                  </div>
                  {c.loyaltyPoints > 9 ? (
                     <span className="bg-gh-yellow text-black text-xs font-bold px-3 py-1 rounded-full">FREE WASH</span>
                  ) : (
                     <div className="p-2 rounded-full bg-gray-50 group-hover:bg-gray-100">
                       <ChevronRight size={20} className="text-gray-400 group-hover:text-slate-900" />
                     </div>
                  )}
                </button>
              ))}
              
              {filteredCustomers.length === 0 && searchQuery.length > 2 && (
                <button 
                  onClick={handleCreateCustomer}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-800 transition-transform active:scale-95"
                >
                  <Plus size={24} /> <span>Add New: "{searchQuery}"</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Vehicle Info */}
        {step === 2 && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <StepHeader title="Vehicle Details" sub="Choose vehicle type and enter plate number." />
            
            <div className="mb-8">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Vehicle Class</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {Object.entries(VehicleType).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setVehicleType(val)}
                    className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center space-y-2 transition-all duration-200 ${
                      vehicleType === val 
                        ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200' 
                        : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-3xl">{VEHICLE_ICONS[val]}</span>
                    <span className="text-[10px] font-bold text-center leading-tight px-1">{val.split('/')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">License Plate</label>
              <input 
                type="text" 
                className="w-full p-6 text-4xl font-black font-mono uppercase bg-gray-50 border-2 border-transparent focus:bg-white focus:border-slate-900 rounded-2xl text-center tracking-widest outline-none transition-all placeholder-gray-300"
                placeholder="GH-0000"
                value={vehiclePlate}
                onChange={e => setVehiclePlate(e.target.value.toUpperCase())}
              />
            </div>

            <div className="flex justify-between pt-4 mt-auto">
               <button onClick={() => setStep(1)} className="text-gray-400 font-bold px-6 hover:text-slate-900 transition-colors">Back</button>
               <button onClick={() => setStep(3)} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 hover:bg-slate-800 transition-transform active:scale-95">Next Step</button>
            </div>
          </div>
        )}

        {/* Step 3: Services */}
        {step === 3 && (
          <div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col h-full">
             <StepHeader title="Select Services" sub="Choose wash packages and add-ons." />
             
             <div className="space-y-3 mb-6 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[300px]">
                {services.map(s => {
                  const isSelected = !!selectedServices.find(sel => sel.id === s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleService(s)}
                      className={`w-full p-4 rounded-2xl border-2 flex justify-between items-center transition-all duration-200 ${
                        isSelected 
                          ? 'border-slate-900 bg-slate-50' 
                          : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                    >
                      <div className="text-left flex items-center space-x-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-slate-900 bg-slate-900' : 'border-gray-300'}`}>
                          {isSelected && <Check size={14} className="text-white" />}
                        </div>
                        <div>
                           <p className={`font-bold text-lg ${isSelected ? 'text-slate-900' : 'text-gray-600'}`}>{s.name}</p>
                           <p className="text-xs text-gray-400 font-medium">{s.durationMins} mins • {s.category}</p>
                        </div>
                      </div>
                      <p className="font-bold text-xl text-slate-900">{CURRENCY}{s.price}</p>
                    </button>
                  );
                })}
             </div>

             <div className="bg-slate-900 text-white p-5 rounded-2xl flex justify-between items-center shadow-lg shadow-slate-300 mb-6">
               <span className="text-gray-300 font-medium">Estimated Total</span>
               <span className="text-3xl font-black">{CURRENCY} {totalCost}</span>
             </div>

             <div className="flex justify-between pt-2">
                <button onClick={() => setStep(2)} className="text-gray-400 font-bold px-6 hover:text-slate-900">Back</button>
                <button 
                 onClick={() => setStep(4)} 
                 disabled={selectedServices.length === 0}
                 className="bg-gh-red disabled:bg-gray-200 disabled:text-gray-400 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-red-100 hover:bg-red-700 transition-all active:scale-95"
               >
                  Confirm
                </button>
             </div>
          </div>
        )}

        {/* Step 4: Finalize */}
        {step === 4 && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
             <StepHeader title="Assignment" sub="Assign a bay and attendant to start." />

             <div className="space-y-6">
               <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Select Bay</label>
                 <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                   {BAYS.map(bay => (
                     <button
                       key={bay}
                       onClick={() => setSelectedBay(bay)}
                       className={`flex-shrink-0 w-20 h-20 rounded-2xl font-black text-2xl flex items-center justify-center border-2 transition-all ${
                         selectedBay === bay 
                           ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                           : 'bg-white text-gray-300 border-gray-100 hover:border-gray-300 hover:text-gray-500'
                       }`}
                     >
                       {bay}
                     </button>
                   ))}
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Attendant</label>
                    <div className="relative">
                       <User className="absolute left-4 top-4 text-gray-400" size={20} />
                       <select 
                         className="w-full pl-12 p-4 border-2 border-gray-100 rounded-2xl bg-white outline-none focus:border-slate-900 appearance-none font-bold text-slate-700"
                         value={selectedWorkerId}
                         onChange={(e) => setSelectedWorkerId(e.target.value)}
                       >
                         <option value="">Auto-Assign</option>
                         {workers.filter(w => w.role === 'Attendant' && w.status !== 'Pending').map(w => (
                           <option key={w.id} value={w.id}>{w.name}</option>
                         ))}
                       </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Photo (Optional)</label>
                    <label className="w-full h-[58px] border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-colors">
                        {capturedPhoto ? (
                          <div className="flex items-center space-x-2 text-green-600 font-bold">
                            <Check size={20} /> <span>Photo Added</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Camera size={20} />
                            <span className="text-sm font-bold">Capture</span>
                          </div>
                        )}
                        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoCapture} />
                     </label>
                  </div>
               </div>
               
               <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Notes</label>
                 <textarea 
                    className="w-full p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 focus:bg-white focus:border-slate-900 outline-none resize-none h-24 font-medium text-slate-700"
                    placeholder="Any special instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                 />
               </div>

               <div className="pt-4">
                 <button 
                  onClick={handleFinish} 
                  className="w-full bg-gh-green text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-green-100 hover:bg-green-700 transition-all active:scale-95 flex items-center justify-center space-x-2"
                >
                   <Check size={24} /> <span>Start Job Ticket</span>
                 </button>
                 <button onClick={() => setStep(3)} className="w-full text-center text-gray-400 font-bold mt-4 hover:text-slate-900">Go Back</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
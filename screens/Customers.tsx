import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Customer } from '../types';
import { Search, Plus, Phone, Car, Star, ChevronLeft, ChevronRight, X, User } from 'lucide-react';
import { VEHICLE_ICONS } from '../constants';

export const Customers: React.FC = () => {
  const { customers, addCustomer } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  // New Customer Form State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPlate, setNewPlate] = useState('');

  // Filter customers logic
  const filteredCustomers = customers.filter(c => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    
    const matchesName = c.name.toLowerCase().includes(term);
    const matchesPhone = c.phone.includes(term);
    const matchesPlate = c.vehiclePlate ? c.vehiclePlate.toLowerCase().includes(term) : false;

    return matchesName || matchesPhone || matchesPlate;
  });

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const newC: Customer = {
      id: `c-${Date.now()}`,
      name: newName,
      phone: newPhone,
      vehiclePlate: newPlate,
      loyaltyPoints: 0,
      lastVisit: new Date().toISOString()
    };
    
    addCustomer(newC);
    setIsModalOpen(false);
    setNewName('');
    setNewPhone('');
    setNewPlate('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Customers</h2>
           <p className="text-gray-500 font-medium">{customers.length} total records</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold flex items-center space-x-2 shadow-xl shadow-slate-200 hover:bg-slate-800 transition-transform active:scale-95"
        >
           <Plus size={20} />
           <span>Add New</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-4 text-gray-400" size={24} />
        <input 
          type="text"
          placeholder="Search name, phone or plate..."
          className="w-full pl-14 pr-12 p-4 border-2 border-transparent rounded-2xl bg-white shadow-sm focus:border-slate-900 focus:ring-0 text-lg font-medium transition-all outline-none"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-4 text-gray-400 hover:text-slate-900"
            >
              <X size={24} />
            </button>
        )}
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedCustomers.map(customer => (
          <div key={customer.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center font-bold text-xl text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  {customer.name.substring(0, 1)}
                </div>
                <div>
                   <h3 className="font-bold text-lg text-slate-900 leading-tight">{customer.name}</h3>
                   <span className="text-xs font-bold text-gray-400">Last: {new Date(customer.lastVisit).toLocaleDateString()}</span>
                </div>
              </div>
              {customer.loyaltyPoints > 0 && (
                <div className="bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1 border border-yellow-100">
                   <Star size={12} fill="currentColor" />
                   <span>{customer.loyaltyPoints}</span>
                </div>
              )}
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center text-sm font-medium text-gray-600 space-x-3">
                 <Phone size={16} className="text-gray-400" />
                 <span>{customer.phone}</span>
              </div>
              {customer.vehiclePlate && (
                <div className="flex items-center text-sm font-medium text-gray-600 space-x-3">
                   <Car size={16} className="text-gray-400" />
                   <span className="font-mono bg-white border border-gray-200 px-2 py-0.5 rounded text-xs text-slate-900">{customer.vehiclePlate}</span>
                   {customer.vehicleType && <span className="text-xs text-gray-400">({VEHICLE_ICONS[customer.vehicleType]})</span>}
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
               <button className="text-sm font-bold text-slate-900 hover:underline">Details &rarr;</button>
            </div>
          </div>
        ))}
        {filteredCustomers.length === 0 && (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-[2rem]">
            <Search size={48} className="mb-4 opacity-20" />
            <p className="font-medium">No customers found.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredCustomers.length > 0 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-gray-500 font-medium">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-xl border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:shadow-md transition-all text-slate-900 bg-gray-50"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-xl border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:shadow-md transition-all text-slate-900 bg-gray-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="text-center mb-6">
                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-900">
                   <User size={32} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900">New Customer</h3>
              </div>
              
              <form onSubmit={handleAddCustomer} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Name</label>
                  <input type="text" required className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-slate-900 rounded-xl font-bold outline-none transition-all" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Ama Kofi" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Phone</label>
                  <input type="tel" required className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-slate-900 rounded-xl font-bold outline-none transition-all" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="024..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Plate (Optional)</label>
                  <input type="text" className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-slate-900 rounded-xl font-bold outline-none transition-all uppercase" value={newPlate} onChange={e => setNewPlate(e.target.value.toUpperCase())} placeholder="GH-..." />
                </div>
                <div className="flex space-x-3 pt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-100 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-transform active:scale-95">Save</button>
                </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
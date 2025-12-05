import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, Customer, Worker, Service, JobStatus, Expense, Screen } from '../types';
import { MOCK_SERVICES, MOCK_WORKERS, MOCK_CUSTOMERS } from '../constants';

interface AppContextType {
  jobs: Job[];
  customers: Customer[];
  workers: Worker[];
  services: Service[];
  expenses: Expense[];
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  addJob: (job: Job) => void;
  updateJobStatus: (id: string, status: JobStatus) => void;
  addCustomer: (customer: Customer) => void;
  addExpense: (expense: Expense) => void;
  toggleLoyalty: boolean;
  setToggleLoyalty: (v: boolean) => void;
  updateService: (service: Service) => void;
  addWorker: (worker: Worker) => void;
  removeWorker: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [workers, setWorkers] = useState<Worker[]>(MOCK_WORKERS);
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [toggleLoyalty, setToggleLoyalty] = useState(true);

  // Load initial dummy data for demo purposes
  useEffect(() => {
    // Simulate some completed jobs
    const pastJob: Job = {
      id: 'job-001',
      customerId: 'c1',
      customerName: 'John Doe',
      customerPhone: '0244123456',
      vehiclePlate: 'GT-2023-21',
      vehicleType: 'SUV/4x4' as any,
      services: [MOCK_SERVICES[1]],
      totalAmount: 40,
      assignedWorkerId: 'w1',
      bayId: 1,
      status: JobStatus.PAID,
      startTime: new Date().toISOString(),
      photos: []
    };
    setJobs([pastJob]);
  }, []);

  const addJob = (job: Job) => {
    setJobs(prev => [job, ...prev]);
    // Update customer loyalty
    if (toggleLoyalty) {
      setCustomers(prev => prev.map(c => {
        if (c.id === job.customerId) {
          return { ...c, loyaltyPoints: c.loyaltyPoints + 1, lastVisit: new Date().toISOString() };
        }
        return c;
      }));
    }
  };

  const updateJobStatus = (id: string, status: JobStatus) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j));
  };

  const addCustomer = (customer: Customer) => {
    setCustomers(prev => [...prev, customer]);
  };

  const addExpense = (expense: Expense) => {
    setExpenses(prev => [expense, ...prev]);
  };

  const updateService = (updatedService: Service) => {
    setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
  };

  const addWorker = (worker: Worker) => {
    setWorkers(prev => [...prev, worker]);
  };

  const removeWorker = (id: string) => {
    setWorkers(prev => prev.filter(w => w.id !== id));
  };

  return (
    <AppContext.Provider value={{
      jobs, customers, workers, services, expenses,
      currentScreen, setCurrentScreen,
      addJob, updateJobStatus, addCustomer, addExpense,
      toggleLoyalty, setToggleLoyalty,
      updateService, addWorker, removeWorker
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
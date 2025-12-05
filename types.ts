export enum VehicleType {
  SEDAN = 'Sedan/Taxi',
  SUV = 'SUV/4x4',
  TRUCK = 'Truck/Bus',
  BIKE = 'Motorbike',
  TRICYCLE = 'Pragya/Aboboyaa'
}

export enum JobStatus {
  QUEUE = 'In Queue',
  WASHING = 'Washing',
  DRYING = 'Drying',
  COMPLETED = 'Completed',
  PAID = 'Paid'
}

export enum PaymentMethod {
  CASH = 'Cash',
  MOMO = 'MTN MoMo',
  TELECEL = 'Telecel Cash',
  CARD = 'Visa/Mastercard',
  SPLIT = 'Split Payment'
}

export interface Service {
  id: string;
  name: string;
  price: number; // In GHS
  category: 'Exterior' | 'Interior' | 'Full' | 'Special';
  durationMins: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  vehiclePlate?: string;
  vehicleType?: VehicleType;
  loyaltyPoints: number;
  lastVisit: string;
}

export interface Worker {
  id: string;
  name: string;
  email?: string;
  role: 'Attendant' | 'Manager' | 'Cashier';
  status: 'Active' | 'Pending';
  photoUrl?: string;
}

export interface Job {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  vehiclePlate: string;
  vehicleType: VehicleType;
  services: Service[];
  totalAmount: number;
  assignedWorkerId: string;
  bayId: number;
  status: JobStatus;
  startTime: string;
  endTime?: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
  photos: string[]; // Base64 strings or URLs
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'Fuel' | 'Soap' | 'Utility' | 'Salary' | 'Maintenance' | 'Other';
  date: string;
}

export type Screen = 'dashboard' | 'new-job' | 'queue' | 'customers' | 'reports' | 'settings' | 'expenses';
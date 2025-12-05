import { Service, VehicleType, Worker, Customer } from './types';

export const CURRENCY = 'GHS';

export const MOCK_SERVICES: Service[] = [
  { id: 's1', name: 'Express Wash', price: 20, category: 'Exterior', durationMins: 15 },
  { id: 's2', name: 'Standard Full', price: 40, category: 'Full', durationMins: 45 },
  { id: 's3', name: 'Executive Wash', price: 70, category: 'Full', durationMins: 60 },
  { id: 's4', name: 'Engine Wash', price: 50, category: 'Special', durationMins: 30 },
  { id: 's5', name: 'Interior Detail', price: 100, category: 'Interior', durationMins: 90 },
  { id: 's6', name: 'Under Wash', price: 30, category: 'Exterior', durationMins: 20 },
  { id: 's7', name: 'Body Polish', price: 80, category: 'Special', durationMins: 45 },
];

export const MOCK_WORKERS: Worker[] = [
  { id: 'w1', name: 'Kwame A.', role: 'Attendant', status: 'Active', email: 'kwame@washbay.com' },
  { id: 'w2', name: 'Emmanuel O.', role: 'Attendant', status: 'Active', email: 'emmanuel@washbay.com' },
  { id: 'w3', name: 'Kojo Mensah', role: 'Manager', status: 'Active', email: 'kojo@washbay.com' },
  { id: 'w4', name: 'Sarah B.', role: 'Cashier', status: 'Active', email: 'sarah@washbay.com' },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'John Doe', phone: '0244123456', vehiclePlate: 'GT-2023-21', vehicleType: VehicleType.SUV, loyaltyPoints: 25, lastVisit: '2023-10-01' },
  { id: 'c2', name: 'Ama Serwaa', phone: '0509988776', vehiclePlate: 'AS-5500-22', vehicleType: VehicleType.SEDAN, loyaltyPoints: 8, lastVisit: '2023-10-05' },
];

export const BAYS = [1, 2, 3, 4, 5];

export const VEHICLE_ICONS: Record<VehicleType, string> = {
  [VehicleType.SEDAN]: '🚗',
  [VehicleType.SUV]: '🚙',
  [VehicleType.TRUCK]: '🚛',
  [VehicleType.BIKE]: '🏍️',
  [VehicleType.TRICYCLE]: '🛺',
};
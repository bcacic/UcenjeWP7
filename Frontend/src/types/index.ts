// API types matching the swagger definitions
export interface Slavljenik {
  sifra?: number;
  ime: string;
  prezime: string;
  email: string;
  telefon: string;
  datum?: string | null;
  napomena?: string;
  datumKreiranja?: string;
  datumAzuriranja?: string;
}

export interface Rodjendan {
  sifra?: number;
  slavljenikSifra: number;
  ime: string;
  datum: string;
  krajDatum?: string;
  paket?: 'basic' | 'standard' | 'premium';
  brojGostiju?: number;
  status?: 'upcoming' | 'completed' | 'cancelled';
  cijena?: number;
  kapara?: number;
  kaparaPlacena?: boolean;
  napomena?: string;
  datumKreiranja?: string;
  datumAzuriranja?: string;
}

// UI-specific types with our existing properties
export interface BirthdayBoy extends Partial<Slavljenik> {
  id: string;
  name: string;
  age: string;
  dateOfBirth: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Birthday extends Partial<Rodjendan> {
  id: string;
  birthdayBoyId: string;
  date: string;
  startTime: string;
  endTime: string;
  packageType: 'basic' | 'standard' | 'premium';
  guestCount: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  price: number;
  deposit: number;
  depositPaid: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalBirthdays: number;
  upcomingBirthdays: number;
  completedBirthdays: number;
  cancelledBirthdays: number;
  totalBirthdayBoys: number;
  totalRevenue: number;
}

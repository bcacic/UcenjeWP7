
import { useQuery } from '@tanstack/react-query';
import { birthdayApi } from '@/api/birthdayApi';
import { birthdayBoyApi } from '@/api/birthdayBoyApi';
import { Rodjendan, Slavljenik } from '@/types';
import { parseISO, isAfter, isBefore, startOfDay, format } from 'date-fns';
import { hr } from 'date-fns/locale';

export interface DashboardData {
  totalRevenue: number;
  newCustomers: number;
  upcomingBirthdays: number;
  completedBirthdays: number;
  recentActivities: Array<{
    id: number;
    type: 'new_booking' | 'payment' | 'update' | 'cancellation';
    date: string;
    description: string;
  }>;
}

export function useDashboardData() {
  // Fetch birthdays
  const birthdaysQuery = useQuery({
    queryKey: ['birthdays'],
    queryFn: birthdayApi.getAll,
  });

  // Fetch birthday boys
  const birthdayBoysQuery = useQuery({
    queryKey: ['birthdayBoys'],
    queryFn: birthdayBoyApi.getAll,
  });

  // Prepare dashboard data based on fetched data
  const dashboardData: DashboardData = {
    totalRevenue: 0,
    newCustomers: 0,
    upcomingBirthdays: 0,
    completedBirthdays: 0,
    recentActivities: [],
  };

  if (birthdaysQuery.data && birthdayBoysQuery.data) {
    const birthdays = birthdaysQuery.data;
    const birthdayBoys = birthdayBoysQuery.data;
    const today = startOfDay(new Date());

    // Calculate upcoming and completed birthdays
    dashboardData.upcomingBirthdays = birthdays.filter(birthday => {
      const birthdayDate = parseISO(birthday.datum);
      return isAfter(birthdayDate, today) && birthday.status !== 'cancelled';
    }).length;

    dashboardData.completedBirthdays = birthdays.filter(birthday => {
      const birthdayDate = parseISO(birthday.datum);
      return isBefore(birthdayDate, today) || birthday.status === 'completed';
    }).length;

    // Calculate total revenue
    dashboardData.totalRevenue = birthdays.reduce((total, birthday) => {
      return total + (birthday.cijena || 0);
    }, 0);

    // Set number of customers
    dashboardData.newCustomers = birthdayBoys.length;

    // Prepare recent activities
    const activities: any[] = [
      // Convert birthdays to activities
      ...birthdays.map((birthday: Rodjendan) => ({
        id: birthday.sifra,
        type: birthday.status === 'cancelled' ? 'cancellation' : 
              birthday.kaparaPlacena ? 'payment' : 'new_booking',
        date: birthday.datumAzuriranja || birthday.datumKreiranja || birthday.datum,
        description: mapBirthdayToActivity(birthday, birthdayBoys),
        sortDate: new Date(birthday.datumAzuriranja || birthday.datumKreiranja || birthday.datum)
      })),
      
      // Convert birthday boys to activities
      ...birthdayBoys.map((boy: Slavljenik) => ({
        id: boy.sifra ? boy.sifra + 1000 : Math.random() * 1000,
        type: 'new_booking',
        date: boy.datumAzuriranja || boy.datumKreiranja || new Date().toISOString(),
        description: `Novi slavljenik: ${boy.ime} ${boy.prezime}`,
        sortDate: new Date(boy.datumAzuriranja || boy.datumKreiranja || new Date().toISOString())
      }))
    ];

    // Sort by date descending and take the latest 3
    dashboardData.recentActivities = activities
      .sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime())
      .slice(0, 3)
      .map(({ id, type, date, description }) => ({ id, type, date, description }));
  }

  return {
    dashboardData,
    isLoading: birthdaysQuery.isLoading || birthdayBoysQuery.isLoading,
    isError: birthdaysQuery.isError || birthdayBoysQuery.isError,
    error: birthdaysQuery.error || birthdayBoysQuery.error
  };
}

// Helper function to create description from birthday and birthday boys
function mapBirthdayToActivity(birthday: Rodjendan, birthdayBoys: Slavljenik[]): string {
  const slavljenik = birthdayBoys.find(boy => boy.sifra === birthday.slavljenikSifra);
  const fullName = slavljenik ? `${slavljenik.ime} ${slavljenik.prezime}` : 'Nepoznat slavljenik';

  if (birthday.status === 'cancelled') {
    return `Otkazan rođendan za ${fullName}`;
  } else if (birthday.kaparaPlacena) {
    return `Primljena akontacija od ${fullName}`;
  } else {
    return `Nova rezervacija rođendana za ${fullName}`;
  }
}

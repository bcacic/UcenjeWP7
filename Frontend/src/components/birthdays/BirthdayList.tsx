
import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, Search, Plus, Calendar as CalendarIcon, Clock, Users } from 'lucide-react';
import { format, parseISO, isBefore, isAfter, startOfDay } from 'date-fns';
import { hr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import StatusBadge from '@/components/ui/StatusBadge';
import { Birthday, Rodjendan } from '@/types';
import { birthdayApi } from '@/api/birthdayApi';
import { mapToBirthday } from '@/utils/mappers';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const PackageBadge = ({ type }: { type: Birthday['packageType'] }) => {
  const config = {
    basic: {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      label: 'Osnovni'
    },
    standard: {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      label: 'Standardni'
    },
    premium: {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      label: 'Premium'
    },
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config[type].bg} ${config[type].text}`}>
      {config[type].label}
    </span>
  );
};

const BirthdayList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const filterType = searchParams.get('filter') || 'all'; // 'all', 'upcoming', or 'completed'
  
  // Fetch birthdays from API
  const { data: birthdays = [], isLoading, error } = useQuery({
    queryKey: ['birthdays'],
    queryFn: async () => {
      try {
        const rodjendani = await birthdayApi.getAll();
        return rodjendani.map(mapToBirthday);
      } catch (error) {
        console.error('Greška pri dohvaćanju rođendana:', error);
        toast.error('Neuspjelo učitavanje rođendana. Molimo pokušajte ponovno.');
        throw error;
      }
    }
  });

  // Filter birthdays based on the filter type
  const today = startOfDay(new Date());
  const filteredByDateBirthdays = birthdays.filter(birthday => {
    const birthdayDate = new Date(birthday.date);
    
    if (filterType === 'upcoming') {
      return isAfter(birthdayDate, today) || format(birthdayDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
    } else if (filterType === 'completed') {
      return isBefore(birthdayDate, today);
    }
    return true; // for 'all'
  });

  // Further filter birthdays based on search term
  const filteredBirthdays = filteredByDateBirthdays.filter(birthday => 
    birthday.date.includes(searchTerm) || 
    birthday.status.includes(searchTerm) ||
    birthday.packageType.includes(searchTerm)
  );

  let pageTitle = 'Rođendani';
  if (filterType === 'upcoming') {
    pageTitle = 'Nadolazeći Rođendani';
  } else if (filterType === 'completed') {
    pageTitle = 'Završeni Rođendani';
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="w-72 h-10 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-40 h-10 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="text-red-500 mb-4">Greška pri učitavanju rođendana</div>
        <Button onClick={() => window.location.reload()}>Pokušaj ponovno</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-tight">{pageTitle}</h2>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pretraži rođendane..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button asChild>
          <Link to="/birthdays/new">
            <Plus className="h-4 w-4 mr-2" />
            Dodaj rođendan
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBirthdays.length === 0 ? (
          <div className="col-span-full flex items-center justify-center h-64">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Nije pronađen nijedan rođendan</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Dodajte novi rođendan za početak.
              </p>
              <Button asChild className="mt-4">
                <Link to="/birthdays/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Dodaj rođendan
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          filteredBirthdays.map((birthday) => (
            <Link key={birthday.id} to={`/birthdays/${birthday.id}`}>
              <Card className="h-full p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200 animate-scale">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <StatusBadge status={birthday.status} />
                      <PackageBadge type={birthday.packageType} />
                    </div>
                    <h3 className="text-lg font-medium">Rođendan #{birthday.id}</h3>
                  </div>
                  <div className="text-lg font-medium">{birthday.price} €</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {format(new Date(birthday.date), 'dd. MMMM yyyy', { locale: hr })}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    {birthday.startTime} - {birthday.endTime}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {birthday.guestCount} gostiju
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Akontacija: {birthday.deposit} €</p>
                    <p className="text-xs text-muted-foreground">
                      {birthday.depositPaid ? 'Akontacija plaćena' : 'Akontacija nije plaćena'}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default BirthdayList;

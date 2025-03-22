
import React from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { hr } from 'date-fns/locale';
import { Calendar, User, EuroIcon, CalendarDays, ChevronRight, PlusCircle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDashboardData } from '@/hooks/useDashboardData';

const Dashboard = () => {
  const { dashboardData, isLoading, isError } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Učitavanje podataka...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
        <h3 className="text-lg font-medium text-red-800">Greška prilikom učitavanja podataka</h3>
        <p className="text-red-600 mt-2">Molimo pokušajte ponovno kasnije ili kontaktirajte podršku.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center mb-2">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Nadolazeći rođendani</p>
            </div>
            <div className="text-2xl font-semibold">{dashboardData.upcomingBirthdays}</div>
          </div>
          <Link to="/birthdays?filter=upcoming" className="text-primary hover:underline text-sm mt-2 inline-block">
            Pregledaj nadolazeće rođendane <ChevronRight className="h-4 w-4 ml-1 inline-block align-middle" />
          </Link>
        </Card>

        <Card className="flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center mb-2">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Slavljenici</p>
            </div>
            <div className="text-2xl font-semibold">{dashboardData.newCustomers}</div>
          </div>
          <Link to="/birthday-boys" className="text-primary hover:underline text-sm mt-2 inline-block">
            Pregledaj slavljenike <ChevronRight className="h-4 w-4 ml-1 inline-block align-middle" />
          </Link>
        </Card>

        <Card className="flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center mb-2">
              <EuroIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Ukupan prihod</p>
            </div>
            <div className="text-2xl font-semibold">{dashboardData.totalRevenue} €</div>
          </div>
          <Link to="/birthdays" className="text-primary hover:underline text-sm mt-2 inline-block">
            Pregledaj sve rezervacije <ChevronRight className="h-4 w-4 ml-1 inline-block align-middle" />
          </Link>
        </Card>

         <Card className="flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center mb-2">
              <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Završeni rođendani</p>
            </div>
            <div className="text-2xl font-semibold">{dashboardData.completedBirthdays}</div>
          </div>
          <Link to="/birthdays?filter=completed" className="text-primary hover:underline text-sm mt-2 inline-block">
            Pregledaj završene rođendane <ChevronRight className="h-4 w-4 ml-1 inline-block align-middle" />
          </Link>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Nedavne aktivnosti</h3>
          <Button asChild variant="outline" size="sm">
            <Link to="/birthdays/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Zakaži rođendan
            </Link>
          </Button>
        </div>
        <div className="divide-y divide-border">
          {dashboardData.recentActivities.map((activity) => (
            <div key={activity.id} className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{activity.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(activity.date), 'dd. MMMM yyyy HH:mm', { locale: hr })}
                  </p>
                </div>
                {activity.type === 'new_booking' && (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Novo
                  </span>
                )}
                {activity.type === 'payment' && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    Plaćanje
                  </span>
                )}
                {activity.type === 'cancellation' && (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                    Otkazano
                  </span>
                )}
                {activity.type === 'update' && (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    Ažurirano
                  </span>
                )}
              </div>
            </div>
          ))}
          {dashboardData.recentActivities.length === 0 && (
            <div className="py-4 text-center text-muted-foreground">
              Nema nedavnih aktivnosti
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

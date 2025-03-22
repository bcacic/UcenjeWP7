
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { CalendarDays, Clock, Users, CreditCard, Trash2, Pencil, ArrowLeft, User } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import PageTitle from '@/components/ui/PageTitle';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Birthday, BirthdayBoy } from '@/types';
import BirthdayForm from '@/components/birthdays/BirthdayForm';
import { birthdayApi } from '@/api/birthdayApi';
import { birthdayBoyApi } from '@/api/birthdayBoyApi';
import { mapToBirthday, mapToBirthdayBoy } from '@/utils/mappers';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const BirthdayDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch birthday details
  const {
    data: birthday,
    isLoading: isLoadingBirthday,
    error: birthdayError
  } = useQuery({
    queryKey: ['birthday', id],
    queryFn: async () => {
      if (id === 'new') return null;

      try {
        const rodjendan = await birthdayApi.getById(parseInt(id!));
        return mapToBirthday(rodjendan);
      } catch (error) {
        console.error('Error fetching birthday:', error);
        toast.error('Neuspjelo učitavanje detalja rođendana');
        throw error;
      }
    },
    enabled: id !== 'new' && !!id
  });

  // Fetch birthday boy details if birthday is loaded
  const {
    data: birthdayBoy,
    isLoading: isLoadingBirthdayBoy
  } = useQuery({
    queryKey: ['birthdayBoy', birthday?.birthdayBoyId],
    queryFn: async () => {
      if (!birthday?.birthdayBoyId) return null;

      try {
        const slavljenik = await birthdayBoyApi.getById(parseInt(birthday.birthdayBoyId));
        return mapToBirthdayBoy(slavljenik);
      } catch (error) {
        console.error('Error fetching birthday boy:', error);
        return null;
      }
    },
    enabled: !!birthday?.birthdayBoyId
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await birthdayApi.delete(parseInt(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['birthdays'] });
      toast.success('Rođendan uspješno obrisan!');
      navigate('/birthdays');
    },
    onError: (error: any) => {
      console.error('Error deleting birthday:', error);
      toast.error('Neuspjelo brisanje rođendana. Molimo pokušajte ponovno.');
    }
  });

  const handleDelete = () => {
    if (id) {
      deleteMutation.mutate(id);
    }
  };

  const isLoading = isLoadingBirthday || isLoadingBirthdayBoy;

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Layout>
    );
  }

  if (id === 'new' || isEditing) {
    return (
      <Layout>
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => id === 'new' ? navigate('/birthdays') : setIsEditing(false)}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {id === 'new' ? 'Nazad na rođendane' : 'Nazad na detalje'}
          </Button>
          <PageTitle
            title={id === 'new' ? 'Novi rođendan' : 'Uredi rođendan'}
            subtitle={id === 'new' ? 'Zakaži novu rođendansku proslavu' : 'Ažuriraj detalje rođendanske proslave'}
          />
        </div>
        <BirthdayForm
          birthday={birthday || undefined}
          isEdit={id !== 'new'}
        />
      </Layout>
    );
  }

  if (birthdayError || !birthday) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Rođendan nije pronađen</h2>
          <p className="text-muted-foreground mb-6">
            Rođendan koji tražite ne postoji ili je uklonjen.
          </p>
          <Button asChild>
            <Link to="/birthdays">Natrag na rođendane</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/birthdays')}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Natrag na rođendane
          </Button>
          <PageTitle title={`Rođendan #${birthday.id}`} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Uredi
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Obriši
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Jeste li sigurni?</AlertDialogTitle>
                <AlertDialogDescription>
                  Ovo će trajno izbrisati ovu rođendansku proslavu. Ova radnja se ne može poništiti.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Odustani</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                  Obriši
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <StatusBadge status={birthday.status} />
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    {birthday.packageType === 'basic' ? 'Osnovni' :
                      birthday.packageType === 'standard' ? 'Standardni' : 'Premium'} paket
                  </span>
                </div>
                <h3 className="text-xl font-semibold">
                  Rođendanska proslava za {birthdayBoy?.name}
                </h3>
              </div>
              <div className="text-2xl font-semibold">{birthday.price} €</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-primary/10 rounded-full p-2 mr-3">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Datum</p>
                    <p className="font-medium">{format(new Date(birthday.date), 'PPPP')}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-primary/10 rounded-full p-2 mr-3">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Vrijeme</p>
                    <p className="font-medium">{birthday.startTime} - {birthday.endTime}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-primary/10 rounded-full p-2 mr-3">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Broj gostiju</p>
                    <p className="font-medium">{birthday.guestCount} gostiju</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-primary/10 rounded-full p-2 mr-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Akontacija</p>
                    <p className="font-medium">
                      {birthday.deposit} €
                      <span className="text-sm ml-1 text-muted-foreground">
                        ({birthday.depositPaid ? 'Plaćeno' : 'Nije plaćeno'})
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {birthday.notes && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-2">Bilješke</h4>
                <p className="text-muted-foreground">{birthday.notes}</p>
              </div>
            )}
          </Card>
        </div>

        {birthdayBoy && (
          <div>
            <Card>
              <h3 className="text-lg font-medium mb-4">Slavljenik</h3>
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 rounded-full p-3 mr-3">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{birthdayBoy.name}</h4>
                  <p className="text-sm text-muted-foreground">{birthdayBoy.age} godina</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Roditelj/Skrbnik</p>
                  <p>{birthdayBoy.parentName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kontakt broj</p>
                  <p>{birthdayBoy.parentPhone}</p>
                </div>
                {birthdayBoy.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Bilješke</p>
                    <p>{birthdayBoy.notes}</p>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/birthday-boys/${birthdayBoy.id}`}>
                    Pregledaj profil
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BirthdayDetail;

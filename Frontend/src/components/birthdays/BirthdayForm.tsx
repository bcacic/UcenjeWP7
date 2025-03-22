
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Birthday, BirthdayBoy, Slavljenik } from '@/types';
import { toast } from 'sonner';
import { birthdayApi } from '@/api/birthdayApi';
import { birthdayBoyApi } from '@/api/birthdayBoyApi';
import { mapToBirthdayBoy, mapToRodjendan } from '@/utils/mappers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface BirthdayFormProps {
  birthday?: Birthday;
  isEdit?: boolean;
}

const BirthdayForm = ({ birthday, isEdit = false }: BirthdayFormProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch birthday boys
  const { data: birthdayBoys = [], isLoading: isLoadingBirthdayBoys } = useQuery({
    queryKey: ['birthdayBoys'],
    queryFn: async () => {
      try {
        const slavljenici = await birthdayBoyApi.getAll();
        return slavljenici.map(mapToBirthdayBoy);
      } catch (error) {
        console.error('Error fetching birthday boys:', error);
        toast.error('Greška prilikom učitavanja slavljenika');
        return [];
      }
    }
  });

  // Form state
  const [formData, setFormData] = useState<Partial<Birthday>>(
    birthday || {
      birthdayBoyId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '13:00',
      endTime: '16:00',
      packageType: 'standard',
      guestCount: 10,
      status: 'upcoming',
      price: 180,
      deposit: 45,
      depositPaid: false,
      notes: '',
    }
  );

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: Partial<Birthday>) => {
      const rodjendan = mapToRodjendan(data);
      return await birthdayApi.create(rodjendan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['birthdays'] });
      toast.success('Rođendan uspješno kreiran!');
      navigate('/birthdays');
    },
    onError: (error: any) => {
      console.error('Error creating birthday:', error);
      toast.error('Greška prilikom kreiranja rođendana. Molimo pokušajte ponovno.');
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Birthday>) => {
      if (!data.id) throw new Error('ID je obavezan za ažuriranje');
      const rodjendan = mapToRodjendan(data);
      return await birthdayApi.update(parseInt(data.id), rodjendan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['birthdays'] });
      toast.success('Rođendan uspješno ažuriran!');
      navigate('/birthdays');
    },
    onError: (error: any) => {
      console.error('Error updating birthday:', error);
      toast.error('Greška prilikom ažuriranja rođendana. Molimo pokušajte ponovno.');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEdit) {
        await updateMutation.mutateAsync(formData);
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Error is handled by the mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    field: keyof Birthday,
    value: string | number | boolean
  ) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      handleChange('date', format(date, 'yyyy-MM-dd'));
    }
  };

  if (isLoadingBirthdayBoys) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-gray-200 rounded w-1/3"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-medium mb-4">Detalji rođendana</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthdayBoyId">Slavljenik</Label>
                  <Select
                    value={formData.birthdayBoyId}
                    onValueChange={(value) => handleChange('birthdayBoyId', value)}
                  >
                    <SelectTrigger id="birthdayBoyId">
                      <SelectValue placeholder="Odaberite slavljenika" />
                    </SelectTrigger>
                    <SelectContent>
                      {birthdayBoys.map((boy) => (
                        <SelectItem key={boy.id} value={boy.id}>
                          {boy.name} ({boy.age} godina)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Datum</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date
                          ? format(new Date(formData.date), 'PPP')
                          : 'Odaberite datum'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.date ? new Date(formData.date) : undefined}
                        onSelect={handleDateSelect}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Vrijeme početka</Label>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input
                      type="time"
                      id="startTime"
                      value={formData.startTime}
                      onChange={(e) => handleChange('startTime', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">Vrijeme završetka</Label>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input
                      type="time"
                      id="endTime"
                      value={formData.endTime}
                      onChange={(e) => handleChange('endTime', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guestCount">Broj gostiju</Label>
                  <Input
                    type="number"
                    id="guestCount"
                    min={1}
                    max={30}
                    value={formData.guestCount}
                    onChange={(e) => handleChange('guestCount', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'upcoming' | 'completed' | 'cancelled') =>
                      handleChange('status', value)
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Odaberite status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Predstoji</SelectItem>
                      <SelectItem value="completed">Završen</SelectItem>
                      <SelectItem value="cancelled">Otkazan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Bilješke</Label>
                <Textarea
                  id="notes"
                  placeholder="Posebni zahtjevi ili napomene..."
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-medium mb-4">Paket i plaćanje</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tip paketa</Label>
                <RadioGroup
                  value={formData.packageType}
                  onValueChange={(value: 'basic' | 'standard' | 'premium') =>
                    handleChange('packageType', value)
                  }
                  className="grid grid-cols-1 gap-2"
                >
                  <div className={cn(
                    "flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted",
                    formData.packageType === "basic" && "bg-muted"
                  )}>
                    <div className="relative flex h-4 w-4 items-center justify-center mr-2.5 mr-2.5">
                      <RadioGroupItem value="basic" id="basic" />
                      {formData.packageType === "basic" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                        </div>
                      )}
                    </div>
                    <Label htmlFor="basic" className="flex-1 cursor-pointer">
                      <div>Osnovni</div>
                      <div className="text-sm text-muted-foreground">125€ - Do 10 gostiju</div>
                    </Label>
                  </div>
                  <div className={cn(
                    "flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted",
                    formData.packageType === "standard" && "bg-muted"
                  )}>
                    <div className="relative flex h-4 w-4 items-center justify-center mr-2.5">
                      <RadioGroupItem value="standard" id="standard" />
                      {formData.packageType === "standard" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                        </div>
                      )}
                    </div>
                    <Label htmlFor="standard" className="flex-1 cursor-pointer">
                      <div>Standardni</div>
                      <div className="text-sm text-muted-foreground">180€ - Do 15 gostiju</div>
                    </Label>
                  </div>
                  <div className={cn(
                    "flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted",
                    formData.packageType === "premium" && "bg-muted"
                  )}>
                    <div className="relative flex h-4 w-4 items-center justify-center mr-2.5">
                      <RadioGroupItem value="premium" id="premium" />
                      {formData.packageType === "premium" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                        </div>
                      )}
                    </div>
                    <Label htmlFor="premium" className="flex-1 cursor-pointer">
                      <div>Premium</div>
                      <div className="text-sm text-muted-foreground">250€ - Do 20 gostiju</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Cijena (€)</Label>
                  <Input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deposit">Akontacija (€)</Label>
                  <Input
                    type="number"
                    id="deposit"
                    value={formData.deposit}
                    onChange={(e) => handleChange('deposit', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="depositPaid"
                    checked={formData.depositPaid}
                    onCheckedChange={(checked) =>
                      handleChange('depositPaid', checked === true)
                    }
                    className="h-3.5 w-3.5 rounded-full"
                  />
                  <label
                    htmlFor="depositPaid"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Akontacija je plaćena
                  </label>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Spremanje...' : isEdit ? 'Ažuriraj rođendan' : 'Kreiraj rođendan'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/birthdays')}
              className="w-full"
            >
              Odustani
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BirthdayForm;

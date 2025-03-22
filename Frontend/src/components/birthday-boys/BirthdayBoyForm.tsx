
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { BirthdayBoy } from '@/types';
import { toast } from 'sonner';
import { birthdayBoyApi } from '@/api/birthdayBoyApi';
import { mapToSlavljenik } from '@/utils/mappers';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface BirthdayBoyFormProps {
  birthdayBoy?: BirthdayBoy;
  isEdit?: boolean;
}

const BirthdayBoyForm = ({ birthdayBoy, isEdit = false }: BirthdayBoyFormProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<BirthdayBoy>>(
    birthdayBoy || {
      name: '',
      age: '0',
      dateOfBirth: new Date().toISOString().split('T')[0],
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      notes: '',
    }
  );

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: Partial<BirthdayBoy>) => {
      const slavljenik = mapToSlavljenik(data);
      return await birthdayBoyApi.create(slavljenik);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['birthdayBoys'] });
      toast.success('Slavljenik je uspješno kreiran!');
      navigate('/birthday-boys');
    },
    onError: (error: any) => {
      console.error('Greška pri kreiranju slavljenika:', error);
      toast.error('Neuspjelo kreiranje slavljenika. Molimo pokušajte ponovno.');
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: Partial<BirthdayBoy>) => {
      if (!data.id) throw new Error('ID je obavezan za ažuriranje');
      const slavljenik = mapToSlavljenik(data);
      return await birthdayBoyApi.update(parseInt(data.id), slavljenik);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['birthdayBoys'] });
      toast.success('Slavljenik je uspješno ažuriran!');
      navigate('/birthday-boys');
    },
    onError: (error: any) => {
      console.error('Greška pri ažuriranju slavljenika:', error);
      toast.error('Neuspjelo ažuriranje slavljenika. Molimo pokušajte ponovno.');
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
      console.error('Greška pri podnošenju obrasca:', error);
      // Error is handled by the mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    field: keyof BirthdayBoy,
    value: string | number
  ) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Osobne informacije</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ime djeteta</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Unesite ime djeteta"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Datum rođenja</Label>
              <Input
                type="date"
                id="dateOfBirth"
                value={formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : ''}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentName">Ime roditelja/skrbnika</Label>
              <Input
                id="parentName"
                value={formData.parentName || ''}
                onChange={(e) => handleChange('parentName', e.target.value)}
                placeholder="Unesite ime roditelja"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentPhone">Telefon roditelja/skrbnika</Label>
              <Input
                id="parentPhone"
                value={formData.parentPhone || ''}
                onChange={(e) => handleChange('parentPhone', e.target.value)}
                placeholder="Unesite telefonski broj roditelja"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentEmail">Email roditelja/skrbnika</Label>
              <Input
                id="parentEmail"
                value={formData.parentEmail || ''}
                onChange={(e) => handleChange('parentEmail', e.target.value)}
                placeholder="Unesite email roditelja"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Bilješke</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Bilo koji posebni zahtjevi, alergije ili bilješke..."
                rows={4}
              />
            </div>
          </div>
        </Card>

        <div className="flex flex-col md:flex-row gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/birthday-boys')}
          >
            Odustani
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Spremanje...' : isEdit ? 'Ažuriraj slavljenika' : 'Dodaj slavljenika'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default BirthdayBoyForm;

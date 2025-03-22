import { Birthday, BirthdayBoy, Rodjendan, Slavljenik } from '@/types';
import { format, parseISO, differenceInYears } from 'date-fns';

// Calculate age from date of birth
export const calculateAge = (dateOfBirth: string | undefined | null): number => {
  if (!dateOfBirth) return 0;
  try {
    const birthDate = parseISO(dateOfBirth);
    return differenceInYears(new Date(), birthDate);
  } catch (error) {
    console.error('Error calculating age:', error);
    return 0;
  }
};

// Map API Slavljenik to UI BirthdayBoy
export const mapToBirthdayBoy = (slavljenik: Slavljenik): BirthdayBoy => {
  return {
    id: slavljenik.sifra?.toString() || '',
    name: `${slavljenik.ime} ${slavljenik.prezime}`,
    age: calculateAge(slavljenik.datum).toString(),
    dateOfBirth: slavljenik.datum || '',
    parentName: slavljenik.ime, // Using 'ime' as parent name since API doesn't have separate fields
    parentPhone: slavljenik.telefon,
    parentEmail: slavljenik.email,
    notes: slavljenik.napomena || '',
    createdAt: slavljenik.datumKreiranja || new Date().toISOString(),
    updatedAt: slavljenik.datumAzuriranja || new Date().toISOString(),
  };
};

// Map UI BirthdayBoy to API Slavljenik
export const mapToSlavljenik = (birthdayBoy: Partial<BirthdayBoy>): Slavljenik => {
  const nameParts = birthdayBoy.name?.split(' ') || ['', ''];
  const ime = nameParts[0] || '';
  const prezime = nameParts.slice(1).join(' ') || '';

  return {
    sifra: birthdayBoy.id ? parseInt(birthdayBoy.id) : undefined,
    ime: ime,
    prezime: prezime,
    telefon: birthdayBoy.parentPhone || '',
    email: birthdayBoy.parentEmail || '',
    datum: birthdayBoy.dateOfBirth || new Date().toISOString(),
    napomena: birthdayBoy.notes,
  };
};

// Map API Rodjendan to UI Birthday
export const mapToBirthday = (rodjendan: Rodjendan): Birthday => {
  // Parse the date
  const dateObj = parseISO(rodjendan.datum);
  const formattedDate = format(dateObj, 'yyyy-MM-dd');
  const startTime = format(dateObj, 'HH:mm');

  // Calculate end time from krajDatum if available, otherwise default to 3 hours later
  let endTime: string;
  if (rodjendan.krajDatum) {
    endTime = format(parseISO(rodjendan.krajDatum), 'HH:mm');
  } else {
    endTime = format(new Date(dateObj.getTime() + 3 * 60 * 60 * 1000), 'HH:mm');
  }

  return {
    id: rodjendan.sifra?.toString() || '',
    birthdayBoyId: rodjendan.slavljenikSifra?.toString() || '',
    date: formattedDate,
    startTime,
    endTime,
    packageType: rodjendan.paket as 'basic' | 'standard' | 'premium' || 'standard',
    guestCount: rodjendan.brojGostiju || 10,
    status: rodjendan.status as 'upcoming' | 'completed' | 'cancelled' || 'upcoming',
    price: rodjendan.cijena || 200,
    deposit: rodjendan.kapara || 50,
    depositPaid: rodjendan.kaparaPlacena || false,
    notes: rodjendan.napomena || '',
    createdAt: rodjendan.datumKreiranja || new Date().toISOString(),
    updatedAt: rodjendan.datumAzuriranja || new Date().toISOString(),
  };
};

// Map UI Birthday to API Rodjendan
export const mapToRodjendan = (birthday: Partial<Birthday>): Rodjendan => {
  // Combine date and start time
  let dateTimeString = birthday.date || new Date().toISOString();
  if (birthday.startTime) {
    const [hours, minutes] = birthday.startTime.split(':');
    const date = new Date(dateTimeString);
    date.setHours(parseInt(hours), parseInt(minutes));
    dateTimeString = date.toISOString();
  }

  // Combine date and end time for krajDatum
  let endTimeString = undefined;
  if (birthday.date && birthday.endTime) {
    const [hours, minutes] = birthday.endTime.split(':');
    const date = new Date(birthday.date);
    date.setHours(parseInt(hours), parseInt(minutes));
    endTimeString = date.toISOString();
  }

  return {
    sifra: birthday.id ? parseInt(birthday.id) : undefined,
    slavljenikSifra: birthday.birthdayBoyId ? parseInt(birthday.birthdayBoyId) : 0,
    ime: birthday.notes || 'Birthday Party',
    datum: dateTimeString,
    krajDatum: endTimeString,
    paket: birthday.packageType,
    brojGostiju: birthday.guestCount,
    status: birthday.status,
    cijena: birthday.price,
    kapara: birthday.deposit,
    kaparaPlacena: birthday.depositPaid,
    napomena: birthday.notes,
  };
};

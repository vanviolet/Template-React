import { LucideIcon } from 'lucide-react';

export interface EventTypeOption {
  id: string;
  nameKey: string;
  defaultName: string;
  descKey: string;
  defaultDesc: string;
  icon: LucideIcon;
  badge?: string;
  category: 'social' | 'corporate' | 'family';
}

export interface SeatingOption {
  id: string;
  nameKey: string;
  defaultName: string;
  capacity: string;
  icon: LucideIcon;
}

export interface CateringOption {
  id: string;
  nameKey: string;
  defaultName: string;
  pricePerPax: number;
  descriptionKey: string;
  defaultDescription: string;
  popular?: boolean;
}

export interface ServiceOption {
  id: string;
  nameKey: string;
  defaultName: string;
  price: number;
  icon: LucideIcon;
}

export interface WizardFormData {
  // Step 1: Event Type
  eventType: string;

  // Step 2: Date & Guest
  eventName: string;
  eventDate: Date | null;
  timeSlot: string;
  guestCount: number;
  seatingLayout: string;

  // Step 3: Catering & Addons
  cateringType: string;
  dietaryRequirements: string[];
  addons: string[];

  // Step 4: Contact & Organizer
  organizerName: string;
  contactEmail: string;
  contactPhone: string;
  companyName?: string;
  specialNotes?: string;

  // Step 5: Agreement
  agreeTerms: boolean;
}

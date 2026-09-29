import { z } from 'zod';

export const step1Schema = z.object({
  eventType: z.string().min(1, 'Pilih salah satu jenis acara'),
});

export const step2Schema = z.object({
  eventName: z.string().min(2, 'Nama acara minimal 2 karakter'),
  eventDate: z.date({
    required_error: 'Tanggal acara wajib dipilih',
    invalid_type_error: 'Tanggal tidak valid',
  }),
  guestCount: z.number().min(10, 'Jumlah tamu minimal 10 orang').max(5000, 'Maksimal 5000 orang'),
  timeSlot: z.string().min(1, 'Pilih waktu acara'),
  seatingLayout: z.string().min(1, 'Pilih tata letak kursi'),
});

export const step3Schema = z.object({
  cateringType: z.string().min(1, 'Pilih paket katering'),
  dietaryRequirements: z.array(z.string()),
  addons: z.array(z.string()),
});

export const step4Schema = z.object({
  organizerName: z.string().min(2, 'Nama penanggung jawab minimal 2 karakter'),
  contactEmail: z.string().email('Format email tidak valid'),
  contactPhone: z.string().min(9, 'Nomor telepon minimal 9 digit'),
  companyName: z.string().optional(),
  specialNotes: z.string().optional(),
});

export const step5Schema = z.object({
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: 'Anda harus menyetujui syarat dan ketentuan pemesanan',
  }),
});

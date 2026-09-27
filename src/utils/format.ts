export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string, locale = 'id-ID'): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatPhoneNumber(phone: string): string {
  if (!phone) return '-';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    return `+62 ${cleaned.slice(1, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
  }
  if (cleaned.startsWith('62')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)}-${cleaned.slice(5, 9)}-${cleaned.slice(9)}`;
  }
  return phone;
}

export function formatNik(nik: string): string {
  if (!nik) return '-';
  const cleaned = nik.replace(/\D/g, '');
  if (cleaned.length === 16) {
    return `${cleaned.slice(0, 6)}******${cleaned.slice(12)}`;
  }
  return nik;
}

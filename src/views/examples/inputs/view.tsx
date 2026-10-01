import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DollarSign,
  Phone,
  CreditCard,
  Calendar as CalendarIcon,
  Clock,
  CheckSquare,
  Search,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { RupiahInput, PhoneInput, NikInput } from '@/components/form/number.input';
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/date.picker';
import { DateTimePicker } from '@/components/ui/date.time.picker';
import { TimePicker } from '@/components/ui/time.picker';
import { Checkbox } from '@/components/ui/checkbox';

export default function InputsExampleView() {
  const { t } = useTranslation();

  // Form states
  const [rupiahValue, setRupiahValue] = useState<number | undefined>(7500000);
  const [phoneValue, setPhoneValue] = useState<string>('081234567890');
  const [nikValue, setNikValue] = useState<string>('3171012304950002');
  const [selectedProdi, setSelectedProdi] = useState<string>('ti');
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => new Date(2026, 9, 15));
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(() => new Date(2026, 9, 15, 9, 30));
  const [selectedTime, setSelectedTime] = useState<string>('09:30');
  const [agreementChecked, setAgreementChecked] = useState<boolean>(true);
  const [emailNotification, setEmailNotification] = useState<boolean>(true);
  const [smsNotification, setSmsNotification] = useState<boolean>(false);

  const PRODI_OPTIONS = [
    { label: 'S1 Teknik Informatika (Fakultas Teknologi Informasi)', value: 'ti' },
    { label: 'S1 Sistem Informasi (Fakultas Teknologi Informasi)', value: 'si' },
    { label: 'S1 Bisnis Digital (Fakultas Ekonomi & Bisnis)', value: 'bd' },
    { label: 'S1 Manajemen Bisnis (Fakultas Ekonomi & Bisnis)', value: 'mb' },
    { label: 'S1 Desain Komunikasi Visual (Fakultas Industri Kreatif)', value: 'dkv' },
    { label: 'S1 Rekayasa Perangkat Lunak (Fakultas Teknologi Informasi)', value: 'rpl' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Sliders className="h-5 w-5 text-primary" />
          <span>Showcase Input & Form Components</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Koleksi komponen input terstandarisasi: Number Format (Rupiah, No HP, NIK KTP), Searchable Combobox, Date/Time Pickers, dan Checkbox.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Rupiah / Currency Input */}
        <Card className="rounded-2xl border-border/70 shadow-xs hover:border-border transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <DollarSign className="h-4 w-4" />
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                react-number-format
              </Badge>
            </div>
            <CardTitle className="text-sm font-semibold mt-2">Input Mata Uang (Rupiah)</CardTitle>
            <CardDescription className="text-xs">
              Otomatis prefix "Rp ", pemisah ribuan titik (.), desimal koma (,), dan parsing ke float numeric.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">
                Biaya Kuliah / SPP
              </label>
              <RupiahInput
                value={rupiahValue}
                onValueChangeCustom={setRupiahValue}
                placeholder="0"
                className="h-9 text-xs font-mono"
              />
            </div>
            <div className="p-2.5 rounded-xl bg-muted/50 border border-border/50 text-[11px] font-mono flex items-center justify-between">
              <span className="text-muted-foreground">Raw Value:</span>
              <span className="font-semibold text-primary">
                {rupiahValue !== undefined ? Number(rupiahValue).toLocaleString('id-ID') : '0'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 2. Phone Number Input */}
        <Card className="rounded-2xl border-border/70 shadow-xs hover:border-border transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Phone className="h-4 w-4" />
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                Format Indonesia
              </Badge>
            </div>
            <CardTitle className="text-sm font-semibold mt-2">Nomor Telepon / WhatsApp</CardTitle>
            <CardDescription className="text-xs">
              Masking otomatis format nomor telepon seluler Indonesia (08XX-XXXX-XXXXX).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">
                Nomor Handphone
              </label>
              <PhoneInput
                value={phoneValue}
                onValueChangeCustom={setPhoneValue}
                placeholder="0812-3456-7890"
                className="h-9 text-xs font-mono"
              />
            </div>
            <div className="p-2.5 rounded-xl bg-muted/50 border border-border/50 text-[11px] font-mono flex items-center justify-between">
              <span className="text-muted-foreground">Raw Value:</span>
              <span className="font-semibold text-primary">{phoneValue || '-'}</span>
            </div>
          </CardContent>
        </Card>

        {/* 3. NIK KTP Input */}
        <Card className="rounded-2xl border-border/70 shadow-xs hover:border-border transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <CreditCard className="h-4 w-4" />
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                16 Digit
              </Badge>
            </div>
            <CardTitle className="text-sm font-semibold mt-2">Nomor Induk Kependudukan (NIK)</CardTitle>
            <CardDescription className="text-xs">
              Validasi dan masking 16 digit angka KTP dengan mask underscore (_).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">
                NIK KTP Calon Mahasiswa
              </label>
              <NikInput
                value={nikValue}
                onValueChangeCustom={setNikValue}
                placeholder="3171012345670001"
                className="h-9 text-xs font-mono"
              />
            </div>
            <div className="p-2.5 rounded-xl bg-muted/50 border border-border/50 text-[11px] font-mono flex items-center justify-between">
              <span className="text-muted-foreground">Panjang:</span>
              <span className="font-semibold text-primary">{nikValue?.length || 0} / 16 digit</span>
            </div>
          </CardContent>
        </Card>

        {/* 4. Searchable Combobox */}
        <Card className="rounded-2xl border-border/70 shadow-xs hover:border-border transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Search className="h-4 w-4" />
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                Search & Filter
              </Badge>
            </div>
            <CardTitle className="text-sm font-semibold mt-2">Searchable Combobox</CardTitle>
            <CardDescription className="text-xs">
              Dropdown pilihan dengan pencarian terintegrasi, keyboard accessibility, dan popover positioning.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">
                Pilih Program Studi
              </label>
              <Combobox
                options={PRODI_OPTIONS}
                value={selectedProdi}
                onChange={setSelectedProdi}
                placeholder="Cari program studi..."
              />
            </div>
            <div className="p-2.5 rounded-xl bg-muted/50 border border-border/50 text-[11px] font-mono flex items-center justify-between">
              <span className="text-muted-foreground">Selected Key:</span>
              <span className="font-semibold text-primary">{selectedProdi}</span>
            </div>
          </CardContent>
        </Card>

        {/* 5. Date & Time Pickers */}
        <Card className="rounded-2xl border-border/70 shadow-xs hover:border-border transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <CalendarIcon className="h-4 w-4" />
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                Date & Time
              </Badge>
            </div>
            <CardTitle className="text-sm font-semibold mt-2">Date & Time Picker</CardTitle>
            <CardDescription className="text-xs">
              Pemilihan tanggal, jam, serta kombinasi date-time terpadu untuk form registrasi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Tanggal Lahir</label>
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder="Pilih tanggal..."
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Jadwal Sesi Tes</label>
              <DateTimePicker
                value={selectedDateTime}
                onChange={setSelectedDateTime}
                placeholder="Pilih tanggal & jam..."
              />
            </div>
          </CardContent>
        </Card>

        {/* 6. Checkbox Group */}
        <Card className="rounded-2xl border-border/70 shadow-xs hover:border-border transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <CheckSquare className="h-4 w-4" />
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                Boolean
              </Badge>
            </div>
            <CardTitle className="text-sm font-semibold mt-2">Checkbox & Konfirmasi</CardTitle>
            <CardDescription className="text-xs">
              Pilihan persetujuan syarat ketentuan, notifikasi, dan state interaktif multi-opsi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2.5">
              <label className="flex items-start gap-2.5 p-2 rounded-xl border border-border/60 hover:bg-muted/30 cursor-pointer transition-colors">
                <Checkbox
                  checked={agreementChecked}
                  onCheckedChange={(checked) => setAgreementChecked(Boolean(checked))}
                  className="mt-0.5"
                />
                <div className="text-xs">
                  <span className="font-medium text-foreground">Setuju Syarat & Ketentuan</span>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Data yang diisikan adalah benar dan dapat dipertanggungjawabkan.
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-xl border border-border/60 hover:bg-muted/30 cursor-pointer transition-colors">
                <Checkbox
                  checked={emailNotification}
                  onCheckedChange={(checked) => setEmailNotification(Boolean(checked))}
                />
                <span className="text-xs font-medium text-foreground">Kirim Notifikasi via Email</span>
              </label>

              <label className="flex items-center gap-2.5 p-2 rounded-xl border border-border/60 hover:bg-muted/30 cursor-pointer transition-colors">
                <Checkbox
                  checked={smsNotification}
                  onCheckedChange={(checked) => setSmsNotification(Boolean(checked))}
                />
                <span className="text-xs font-medium text-foreground">Kirim Notifikasi via SMS / WA</span>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

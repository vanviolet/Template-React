import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Calendar as CalendarIcon,
  Users,
  CheckCircle2,
  RotateCcw,
  Receipt,
  FileCheck,
  PartyPopper,
  Info,
} from 'lucide-react';
import { Stepper, StepItem } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DatePicker } from '@/components/ui/date.picker';
import { PhoneInput } from '@/components/form/number.input';
import { showToast } from '@/components/ui/toast';
import { NumericFormat } from 'react-number-format';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/date';
import { formatRupiah } from '@/utils/format';

import {
  INITIAL_WIZARD_DATA,
  EVENT_TYPE_OPTIONS,
  SEATING_LAYOUTS,
  CATERING_PACKAGES,
  ADDON_SERVICES,
} from './constants';
import { WizardFormData } from './types';
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
} from './schema';

export function EventWizard() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || 'id';

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<WizardFormData>(INITIAL_WIZARD_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [bookingCode, setBookingCode] = useState<string>('');

  const stepperItems: StepItem[] = [
    {
      id: 'step-1',
      title: t('wizard.steps.step1Title', 'Event Type'),
      subtitle: t('wizard.stepNumber', { number: 1, defaultValue: 'Step 1' }),
      description: t('wizard.steps.step1Desc', 'Choose your event format'),
    },
    {
      id: 'step-2',
      title: t('wizard.steps.step2Title', 'Schedule & Venue'),
      subtitle: t('wizard.stepNumber', { number: 2, defaultValue: 'Step 2' }),
      description: t('wizard.steps.step2Desc', 'Date, timing and seating style'),
    },
    {
      id: 'step-3',
      title: t('wizard.steps.step3Title', 'Catering & Addons'),
      subtitle: t('wizard.stepNumber', { number: 3, defaultValue: 'Step 3' }),
      description: t('wizard.steps.step3Desc', 'Food menu and AV entertainment'),
    },
    {
      id: 'step-4',
      title: t('wizard.steps.step4Title', 'Contact Details'),
      subtitle: t('wizard.stepNumber', { number: 4, defaultValue: 'Step 4' }),
      description: t('wizard.steps.step4Desc', 'Organizer and venue point of contact'),
    },
    {
      id: 'step-5',
      title: t('wizard.steps.step5Title', 'Review & Confirm'),
      subtitle: t('wizard.stepNumber', { number: 5, defaultValue: 'Step 5' }),
      description: t('wizard.steps.step5Desc', 'Verify choices & finalize booking'),
    },
  ];

  // Helper to validate current step before proceeding
  const validateStep = (stepIndex: number): boolean => {
    setErrors({});
    let result;

    if (stepIndex === 0) {
      result = step1Schema.safeParse({ eventType: formData.eventType });
    } else if (stepIndex === 1) {
      result = step2Schema.safeParse({
        eventName: formData.eventName || (formData.eventType ? `${formData.eventType.toUpperCase()} CELEBRATION` : 'Event'),
        eventDate: formData.eventDate,
        guestCount: formData.guestCount,
        timeSlot: formData.timeSlot,
        seatingLayout: formData.seatingLayout,
      });
      // Set default name if empty
      if (!formData.eventName) {
        const found = EVENT_TYPE_OPTIONS.find((e) => e.id === formData.eventType);
        setFormData((prev) => ({
          ...prev,
          eventName: found ? `${found.defaultName} Celebration` : 'My Event',
        }));
      }
    } else if (stepIndex === 2) {
      result = step3Schema.safeParse({
        cateringType: formData.cateringType,
        dietaryRequirements: formData.dietaryRequirements,
        addons: formData.addons,
      });
    } else if (stepIndex === 3) {
      result = step4Schema.safeParse({
        organizerName: formData.organizerName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        companyName: formData.companyName,
        specialNotes: formData.specialNotes,
      });
    } else if (stepIndex === 4) {
      result = step5Schema.safeParse({
        agreeTerms: formData.agreeTerms,
      });
    }

    if (result && !result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) {
          fieldErrors[String(field)] = issue.message;
        }
      });
      setErrors(fieldErrors);
      showToast.error(
        t('wizard.validationError', 'Mohon lengkapi data yang diperlukan sebelum melanjutkan'),
        { title: 'Validation Required' }
      );
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < stepperItems.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Final submission
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setErrors({});
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepJump = (targetIndex: number) => {
    if (targetIndex < currentStep) {
      // Always allowed to go back to visited steps
      setErrors({});
      setCurrentStep(targetIndex);
    } else if (targetIndex > currentStep) {
      // Validate current before jumping ahead
      if (validateStep(currentStep)) {
        setCurrentStep(targetIndex);
      }
    }
  };

  const handleSubmit = () => {
    const generatedCode = `EVT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingCode(generatedCode);
    setIsSubmitted(true);
    showToast.success(
      t('wizard.bookingSuccess', 'Pemesanan acara berhasil dibuat! Tim kami akan segera menghubungi Anda.'),
      { title: 'Success' }
    );
  };

  const handleReset = () => {
    setFormData(INITIAL_WIZARD_DATA);
    setCurrentStep(0);
    setErrors({});
    setIsSubmitted(false);
    showToast.info(t('wizard.resetNotice', 'Formulir wizard telah direset ke kondisi awal'), {
      title: 'Information',
    });
  };

  // Calculations
  const selectedCatering = CATERING_PACKAGES.find((p) => p.id === formData.cateringType) || CATERING_PACKAGES[0];
  const cateringTotal = (selectedCatering?.pricePerPax || 0) * (formData.guestCount || 0);
  const addonsTotal = formData.addons.reduce((acc, addonId) => {
    const found = ADDON_SERVICES.find((s) => s.id === addonId);
    return acc + (found?.price || 0);
  }, 0);
  const grandTotal = cateringTotal + addonsTotal;

  // Selected event type object
  const currentEvent = EVENT_TYPE_OPTIONS.find((e) => e.id === formData.eventType);

  // If already submitted, show beautiful celebration screen
  if (isSubmitted) {
    return (
      <Card className="max-w-3xl mx-auto border-border shadow-sm">
        <CardContent className="p-6 sm:p-10 lg:p-12 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 ring-8 ring-emerald-500/5">
            <PartyPopper className="h-8 w-8 animate-bounce" />
          </div>

          <div className="space-y-2">
            <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
              {t('wizard.confirmedStatus', 'Konfirmasi Sukses')}
            </Badge>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {t('wizard.thankYouTitle', 'Pemesanan Acara Berhasil Disimpan!')}
            </h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              {t('wizard.thankYouDesc', 'Tim event banquet kami akan meninjau detail dan menghubungi Anda dalam kurun waktu 1x24 jam.')}
            </p>
          </div>

          {/* Ticket Card */}
          <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4 sm:p-5 text-left max-w-lg mx-auto space-y-3">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                  {t('wizard.bookingReference', 'Kode Booking')}
                </span>
                <span className="text-sm sm:text-base font-bold font-mono text-primary">
                  {bookingCode}
                </span>
              </div>
              <Badge variant="secondary" className="capitalize text-xs">
                {currentEvent?.defaultName}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground block">{t('wizard.summary.date', 'Tanggal Acara')}</span>
                <span className="font-semibold text-foreground">
                  {formData.eventDate ? formatDate(formData.eventDate, 'd MMMM yyyy', lang) : '-'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">{t('wizard.summary.guests', 'Jumlah Tamu')}</span>
                <span className="font-semibold text-foreground">{formData.guestCount} Undangan</span>
              </div>
              <div>
                <span className="text-muted-foreground block">{t('wizard.summary.organizer', 'Penanggung Jawab')}</span>
                <span className="font-semibold text-foreground">{formData.organizerName}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">{t('wizard.summary.total', 'Estimasi Biaya')}</span>
                <span className="font-bold text-primary">{formatRupiah(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button variant="default" onClick={handleReset} className="w-full sm:w-auto">
              <RotateCcw className="h-3.5 w-3.5 mr-2" />
              {t('wizard.bookAnother', 'Rencanakan Acara Lainnya')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Wizard Card */}
      <Card className="border-border shadow-xs overflow-hidden">
        <CardContent className="p-3.5 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* Desktop Left Rail: Vertical Stepper (Visible on >= lg) */}
            <div className="hidden lg:flex lg:col-span-4 xl:col-span-3 flex-col items-start border-r border-border pr-6 xl:pr-8">
              <div className="w-full sticky top-4">
                <div className="mb-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t('wizard.navigationHeader', 'Tahapan Formulir')}
                  </span>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {t('wizard.stepCounter', {
                      current: currentStep + 1,
                      total: stepperItems.length,
                      defaultValue: `Langkah ${currentStep + 1} dari ${stepperItems.length}`,
                    })}
                  </div>
                </div>

                <Stepper
                  steps={stepperItems}
                  currentStep={currentStep}
                  orientation="vertical"
                  showLabels={true}
                  clickable={true}
                  onStepClick={handleStepJump}
                  variant="double-ring"
                  size="default"
                  className="w-full"
                />
              </div>
            </div>

            {/* Mobile Step Header (Visible on < lg, compact and clean!) */}
            <div className="lg:hidden col-span-1 space-y-3 pb-4 border-b border-border">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                    {stepperItems[currentStep]?.subtitle}
                  </span>
                  <span className="font-bold text-foreground text-sm">
                    {stepperItems[currentStep]?.title}
                  </span>
                </div>
                <Badge variant="secondary" className="font-mono text-[11px] px-2 py-0.5">
                  {currentStep + 1} / {stepperItems.length}
                </Badge>
              </div>

              {/* Progress track */}
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${((currentStep + 1) / stepperItems.length) * 100}%` }}
                />
              </div>

              {/* Compact horizontal clickable step circles */}
              <div className="flex items-center justify-between pt-1">
                {stepperItems.map((step, idx) => {
                  const isDone = idx < currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => handleStepJump(idx)}
                      className={cn(
                        'flex items-center justify-center h-7 w-7 rounded-full text-xs font-semibold transition-all cursor-pointer',
                        isCurrent && 'bg-background text-primary ring-2 ring-primary ring-offset-2 ring-offset-background font-bold shadow-xs',
                        isDone && 'bg-primary/10 text-primary border border-primary/30',
                        !isCurrent && !isDone && 'bg-muted/70 text-muted-foreground border border-border/80'
                      )}
                      title={step.title}
                    >
                      {isDone ? <Check className="h-3.5 w-3.5 stroke-[2.5]" /> : idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Content Area: Step Form Body */}
            <div className="col-span-1 lg:col-span-8 xl:col-span-9 flex flex-col justify-between min-h-[420px]">
              <div className="space-y-5">
                {/* Step Subtitle & Title */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground block tracking-wide uppercase">
                    {t('wizard.stepNumber', { number: currentStep + 1, defaultValue: `Step ${currentStep + 1}` })}
                  </span>

                  {/* Dynamic Headings based on Step */}
                  {currentStep === 0 && (
                    <>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground">
                        {t('wizard.step1.headline', 'What kind of event are you planning?')}
                      </h2>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                        {t(
                          'wizard.step1.subline',
                          'Engagement, henna night, wedding, corporate event, prom or christmas party. Please choose from the options so we can help you planning your event.'
                        )}
                      </p>
                    </>
                  )}

                  {currentStep === 1 && (
                    <>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground">
                        {t('wizard.step2.headline', 'When and where will it take place?')}
                      </h2>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                        {t(
                          'wizard.step2.subline',
                          'Pilih tanggal pelaksanaan, estimasi jumlah tamu undangan, serta tata letak ruangan yang diinginkan.'
                        )}
                      </p>
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground">
                        {t('wizard.step3.headline', 'Catering & Entertainment Packages')}
                      </h2>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                        {t(
                          'wizard.step3.subline',
                          'Pilih menu hidangan terbaik untuk para tamu serta layanan tambahan hiburan dan multimedia.'
                        )}
                      </p>
                    </>
                  )}

                  {currentStep === 3 && (
                    <>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground">
                        {t('wizard.step4.headline', 'Organizer & Contact Information')}
                      </h2>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                        {t(
                          'wizard.step4.subline',
                          'Mohon isi kontak penanggung jawab agar tim venue coordinator dapat mengonfirmasi jadwal survei lokasi.'
                        )}
                      </p>
                    </>
                  )}

                  {currentStep === 4 && (
                    <>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground">
                        {t('wizard.step5.headline', 'Review & Confirm Your Reservation')}
                      </h2>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                        {t(
                          'wizard.step5.subline',
                          'Tinjau kembali seluruh rincian pemesanan dan perkiraan anggaran sebelum mengirimkan konfirmasi.'
                        )}
                      </p>
                    </>
                  )}
                </div>

                {/* Step 1: Option Cards Grid (2 cols on mobile, 3 cols on tablet/desktop) */}
                {currentStep === 0 && (
                  <div className="pt-2">
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3.5">
                      {EVENT_TYPE_OPTIONS.map((item) => {
                        const Icon = item.icon;
                        const isSelected = formData.eventType === item.id;

                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, eventType: item.id }));
                              setErrors((prev) => ({ ...prev, eventType: '' }));
                            }}
                            className={cn(
                              'group relative flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-xl border transition-all duration-200 cursor-pointer select-none text-center min-h-[115px] sm:min-h-[135px]',
                              isSelected
                                ? 'border-primary ring-2 ring-primary/20 bg-primary/[0.03] dark:bg-primary/[0.08] shadow-xs'
                                : 'border-border/80 bg-card hover:border-primary/40 hover:bg-muted/30 shadow-2xs'
                            )}
                          >
                            {/* Checkmark or radio circle indicator */}
                            <div className="absolute top-2.5 right-2.5 flex items-center justify-center">
                              {isSelected ? (
                                <div className="h-4.5 w-4.5 sm:h-5 sm:w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs animate-in zoom-in-75 duration-150">
                                  <Check className="h-3 w-3 stroke-[3]" />
                                </div>
                              ) : (
                                <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full border border-border group-hover:border-primary/40 transition-colors" />
                              )}
                            </div>

                            {/* Center Icon */}
                            <div
                              className={cn(
                                'flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl mb-2 sm:mb-3 transition-transform group-hover:scale-110 duration-200',
                                isSelected
                                  ? 'text-primary bg-primary/10'
                                  : 'text-muted-foreground group-hover:text-foreground'
                              )}
                            >
                              <Icon className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.6]" />
                            </div>

                            {/* Label */}
                            <span
                              className={cn(
                                'text-[11px] sm:text-xs font-semibold tracking-tight transition-colors line-clamp-1',
                                isSelected ? 'text-primary font-bold' : 'text-foreground'
                              )}
                            >
                              {item.defaultName}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {errors.eventType && (
                      <p className="text-xs text-destructive mt-2">{errors.eventType}</p>
                    )}
                  </div>
                )}

                {/* Step 2: Schedule & Seating */}
                {currentStep === 1 && (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {/* Event Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          {t('wizard.form.eventName', 'Nama / Judul Acara')} *
                        </label>
                        <Input
                          placeholder="e.g. Sarah & Michael Wedding Gala"
                          value={formData.eventName}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, eventName: e.target.value }))
                          }
                          error={Boolean(errors.eventName)}
                        />
                        {errors.eventName && (
                          <p className="text-[11px] text-destructive">{errors.eventName}</p>
                        )}
                      </div>

                      {/* Guest Count */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          {t('wizard.form.guestCount', 'Estimasi Jumlah Undangan (Pax)')} *
                        </label>
                        <NumericFormat
                          customInput={Input}
                          value={formData.guestCount}
                          thousandSeparator="."
                          decimalSeparator=","
                          suffix=" Orang"
                          allowNegative={false}
                          onValueChange={(values) => {
                            setFormData((prev) => ({
                              ...prev,
                              guestCount: values.floatValue || 0,
                            }));
                          }}
                          error={Boolean(errors.guestCount)}
                        />
                        {errors.guestCount && (
                          <p className="text-[11px] text-destructive">{errors.guestCount}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {/* Date Picker */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          {t('wizard.form.eventDate', 'Tanggal Pelaksanaan')} *
                        </label>
                        <DatePicker
                          value={formData.eventDate}
                          onChange={(date) =>
                            setFormData((prev) => ({ ...prev, eventDate: date }))
                          }
                          label={t('wizard.form.pickDate', 'Pilih Tanggal Acara')}
                          minDate={new Date()}
                          className="w-full max-w-full"
                        />
                        {errors.eventDate && (
                          <p className="text-[11px] text-destructive">{errors.eventDate}</p>
                        )}
                      </div>

                      {/* Time Slot */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          {t('wizard.form.timeSlot', 'Pilihan Waktu Acara')}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'morning', label: 'Pagi (09-13)' },
                            { id: 'afternoon', label: 'Siang (13-17)' },
                            { id: 'evening', label: 'Malam (18-22)' },
                            { id: 'fullday', label: 'Seharian' },
                          ].map((slot) => (
                            <button
                              key={slot.id}
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, timeSlot: slot.id }))
                              }
                              className={cn(
                                'px-2.5 py-2 text-xs rounded-lg border text-left transition-colors cursor-pointer truncate',
                                formData.timeSlot === slot.id
                                  ? 'border-primary bg-primary/5 text-primary font-bold ring-1 ring-primary/30'
                                  : 'border-border bg-card text-muted-foreground hover:bg-muted/40'
                              )}
                            >
                              {slot.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Seating Layout Cards */}
                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-semibold text-foreground block">
                        {t('wizard.form.seatingLayout', 'Model Tata Letak Ruangan (Seating Layout)')}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
                        {SEATING_LAYOUTS.map((seat) => {
                          const SeatIcon = seat.icon;
                          const isSelected = formData.seatingLayout === seat.id;

                          return (
                            <div
                              key={seat.id}
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, seatingLayout: seat.id }))
                              }
                              className={cn(
                                'flex flex-col p-3 rounded-xl border transition-all cursor-pointer select-none text-left',
                                isSelected
                                  ? 'border-primary ring-1 ring-primary/30 bg-primary/5 text-primary'
                                  : 'border-border bg-card text-card-foreground hover:bg-muted/30'
                              )}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <SeatIcon className="h-4 w-4 text-primary" />
                                {isSelected && (
                                  <div className="h-3.5 w-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                    <Check className="h-2 w-2 stroke-[3]" />
                                  </div>
                                )}
                              </div>
                              <span className="text-xs font-bold leading-tight line-clamp-1">
                                {seat.defaultName}
                              </span>
                              <span className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                                {seat.capacity}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Catering & Addons */}
                {currentStep === 2 && (
                  <div className="space-y-4 pt-2">
                    {/* Catering Package Cards */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-foreground block">
                        {t('wizard.catering.packageTitle', 'Pilihan Paket Menu Makanan & Minuman')}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {CATERING_PACKAGES.map((pkg) => {
                          const isSelected = formData.cateringType === pkg.id;

                          return (
                            <div
                              key={pkg.id}
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, cateringType: pkg.id }))
                              }
                              className={cn(
                                'relative p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between',
                                isSelected
                                  ? 'border-primary ring-1 ring-primary/30 bg-primary/5'
                                  : 'border-border bg-card hover:bg-muted/30'
                              )}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-foreground">
                                      {pkg.defaultName}
                                    </span>
                                    {pkg.popular && (
                                      <Badge variant="default" className="text-[9px] py-0 px-1.5 h-4">
                                        Best Choice
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                                    {pkg.defaultDescription}
                                  </p>
                                </div>

                                <div className="h-4 w-4 shrink-0 rounded-full border border-border flex items-center justify-center">
                                  {isSelected && (
                                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                                  )}
                                </div>
                              </div>

                              <div className="mt-3 pt-2 border-t border-border/50 flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">Harga per pax:</span>
                                <span className="font-bold text-primary">
                                  {formatRupiah(pkg.pricePerPax)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Add-on Services Multi-selection */}
                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-semibold text-foreground block">
                        {t('wizard.services.title', 'Layanan Ekstra & Perlengkapan Acara')}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
                        {ADDON_SERVICES.map((srv) => {
                          const SrvIcon = srv.icon;
                          const isSelected = formData.addons.includes(srv.id);

                          return (
                            <div
                              key={srv.id}
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  addons: isSelected
                                    ? prev.addons.filter((id) => id !== srv.id)
                                    : [...prev.addons, srv.id],
                                }));
                              }}
                              className={cn(
                                'p-3 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between',
                                isSelected
                                  ? 'border-primary ring-1 ring-primary/30 bg-primary/5'
                                  : 'border-border bg-card hover:bg-muted/30'
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <SrvIcon className="h-4 w-4 text-primary" />
                                <div
                                  className={cn(
                                    'h-3.5 w-3.5 rounded flex items-center justify-center border',
                                    isSelected
                                      ? 'bg-primary border-primary text-white'
                                      : 'border-border'
                                  )}
                                >
                                  {isSelected && <Check className="h-2 w-2 stroke-[3]" />}
                                </div>
                              </div>
                              <div className="mt-2">
                                <span className="text-xs font-bold block leading-tight text-foreground line-clamp-1">
                                  {srv.defaultName}
                                </span>
                                <span className="text-[10px] font-semibold text-muted-foreground block mt-1">
                                  +{formatRupiah(srv.price)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Contact Details */}
                {currentStep === 3 && (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          {t('wizard.form.organizerName', 'Nama Lengkap Pemesan')} *
                        </label>
                        <Input
                          placeholder="e.g. Hendra Pratama"
                          value={formData.organizerName}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, organizerName: e.target.value }))
                          }
                          error={Boolean(errors.organizerName)}
                        />
                        {errors.organizerName && (
                          <p className="text-[11px] text-destructive">{errors.organizerName}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          {t('wizard.form.email', 'Alamat Email')} *
                        </label>
                        <Input
                          type="email"
                          placeholder="hendra@example.com"
                          value={formData.contactEmail}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))
                          }
                          error={Boolean(errors.contactEmail)}
                        />
                        {errors.contactEmail && (
                          <p className="text-[11px] text-destructive">{errors.contactEmail}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {/* Phone with Mask */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          {t('wizard.form.phone', 'Nomor Telepon / WhatsApp')} *
                        </label>
                        <PhoneInput
                          value={formData.contactPhone}
                          onValueChangeCustom={(val) =>
                            setFormData((prev) => ({ ...prev, contactPhone: val }))
                          }
                          error={Boolean(errors.contactPhone)}
                        />
                        {errors.contactPhone && (
                          <p className="text-[11px] text-destructive">{errors.contactPhone}</p>
                        )}
                      </div>

                      {/* Company (Optional) */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          {t('wizard.form.company', 'Nama Perusahaan / Komunitas (Opsional)')}
                        </label>
                        <Input
                          placeholder="e.g. PT Artha Graha Nusantara"
                          value={formData.companyName}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, companyName: e.target.value }))
                          }
                        />
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        {t('wizard.form.notes', 'Catatan Khusus & Preferensi Ruangan')}
                      </label>
                      <textarea
                        rows={3}
                        className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-xs shadow-2xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        placeholder="Contoh: Butuh panggung tambahan ukuran 4x6 meter, akses kursi roda untuk tamu VIP..."
                        value={formData.specialNotes}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, specialNotes: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Step 5: Review & Cost Summary */}
                {currentStep === 4 && (
                  <div className="space-y-4 pt-2">
                    {/* Summary Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {/* Event Overview */}
                      <div className="rounded-xl border border-border bg-card p-3.5 sm:p-4 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                          {t('wizard.summary.eventOverview', 'Rincian Acara')}
                        </span>
                        <div className="text-sm font-bold text-foreground">
                          {formData.eventName || 'Acara Pesta'}
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>
                            <span className="font-semibold text-foreground">Tipe: </span>
                            {currentEvent?.defaultName}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">Tanggal: </span>
                            {formData.eventDate ? formatDate(formData.eventDate, 'd MMMM yyyy', lang) : '-'}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">Waktu: </span>
                            <span className="capitalize">{formData.timeSlot}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">Tamu: </span>
                            {formData.guestCount} Undangan
                          </div>
                        </div>
                      </div>

                      {/* Catering & Addons */}
                      <div className="rounded-xl border border-border bg-card p-3.5 sm:p-4 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                          {t('wizard.summary.cateringServices', 'Paket & Layanan')}
                        </span>
                        <div className="text-sm font-bold text-foreground">
                          {selectedCatering.defaultName}
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>
                            <span className="font-semibold text-foreground">Layout: </span>
                            <span className="capitalize">{formData.seatingLayout}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">Add-on: </span>
                            {formData.addons.length > 0
                              ? formData.addons
                                  .map((id) => ADDON_SERVICES.find((s) => s.id === id)?.defaultName)
                                  .filter(Boolean)
                                  .join(', ')
                              : 'Tidak ada tambahan'}
                          </div>
                        </div>
                      </div>

                      {/* Cost Breakdown */}
                      <div className="col-span-1 sm:col-span-2 lg:col-span-1 rounded-xl border border-primary/30 bg-primary/[0.03] dark:bg-primary/[0.08] p-3.5 sm:p-4 space-y-2 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                            {t('wizard.summary.costEstimate', 'Perkiraan Anggaran')}
                          </span>
                          <div className="text-xs space-y-1 mt-2">
                            <div className="flex justify-between text-muted-foreground">
                              <span>Katering ({formData.guestCount} pax):</span>
                              <span>{formatRupiah(cateringTotal)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                              <span>Layanan Tambahan:</span>
                              <span>{formatRupiah(addonsTotal)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-primary/20 flex justify-between items-baseline">
                          <span className="text-xs font-bold text-foreground">Total Estimasi:</span>
                          <span className="text-base font-extrabold text-primary">
                            {formatRupiah(grandTotal)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Agreement Checkbox */}
                    <div className="pt-2">
                      <label className="flex items-start gap-2.5 p-3 rounded-xl border border-border bg-card cursor-pointer hover:bg-muted/20 select-none">
                        <input
                          type="checkbox"
                          checked={formData.agreeTerms}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, agreeTerms: e.target.checked }))
                          }
                          className="mt-0.5 h-4 w-4 rounded border-input text-primary focus:ring-primary cursor-pointer shrink-0"
                        />
                        <span className="text-xs text-muted-foreground leading-normal">
                          {t(
                            'wizard.agreeCheckbox',
                            'Saya mengonfirmasi bahwa data yang dimasukkan sudah benar dan menyetujui syarat & ketentuan reservasi venue.'
                          )}
                        </span>
                      </label>
                      {errors.agreeTerms && (
                        <p className="text-xs text-destructive mt-1.5">{errors.agreeTerms}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Navigation Controls */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-border gap-2">
                {currentStep > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    className="cursor-pointer text-xs"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                    <span>{t('common.previous', 'Sebelumnya')}</span>
                  </Button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="default"
                    onClick={handleNext}
                    className="min-w-28 cursor-pointer shadow-sm text-xs"
                  >
                    {currentStep === stepperItems.length - 1 ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                        <span>{t('wizard.confirmBooking', 'Konfirmasi Pemesanan')}</span>
                      </>
                    ) : (
                      <>
                        <span>{t('wizard.next', 'Next')}</span>
                        <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import {
  format as dfFormat,
  formatDistanceToNow as dfFormatDistanceToNow,
  formatRelative as dfFormatRelative,
  parse as dfParse,
  isValid as dfIsValid,
  isToday as dfIsToday,
  isYesterday as dfIsYesterday,
  isTomorrow as dfIsTomorrow,
  isSameDay as dfIsSameDay,
  isSameMonth as dfIsSameMonth,
  isSameYear as dfIsSameYear,
  startOfDay as dfStartOfDay,
  endOfDay as dfEndOfDay,
  startOfWeek as dfStartOfWeek,
  endOfWeek as dfEndOfWeek,
  startOfMonth as dfStartOfMonth,
  endOfMonth as dfEndOfMonth,
  addDays as dfAddDays,
  subDays as dfSubDays,
  addMonths as dfAddMonths,
  subMonths as dfSubMonths,
  addWeeks as dfAddWeeks,
  subWeeks as dfSubWeeks,
  eachDayOfInterval as dfEachDayOfInterval,
  getDaysInMonth as dfGetDaysInMonth,
  getDay as dfGetDay,
  setHours as dfSetHours,
  setMinutes as dfSetMinutes,
  type Locale,
} from 'date-fns';
import { id } from 'date-fns/locale/id';
import { enUS } from 'date-fns/locale/en-US';

export const LOCALES: Record<string, Locale> = {
  id: id,
  'id-ID': id,
  en: enUS,
  'en-US': enUS,
};

export const DEFAULT_LOCALE = id;

/**
 * Returns date-fns Locale object based on language code ('id' | 'en' etc.)
 */
export function getDateFnsLocale(lang?: string): Locale {
  if (!lang) return DEFAULT_LOCALE;
  const normalized = lang.toLowerCase();
  if (normalized.startsWith('en')) return enUS;
  if (normalized.startsWith('id')) return id;
  return LOCALES[lang] || DEFAULT_LOCALE;
}

export const DATE_FORMATS = {
  /** e.g. 27.09.2021 */
  dot: 'dd.MM.yyyy',
  /** e.g. 27/09/2021 */
  slash: 'dd/MM/yyyy',
  /** e.g. 2021-09-27 */
  iso: 'yyyy-MM-dd',
  /** e.g. 27 Sep 2021 */
  short: 'dd MMM yyyy',
  /** e.g. 27 September 2021 */
  medium: 'dd MMMM yyyy',
  /** e.g. Senin, 27 September 2021 */
  long: 'EEEE, dd MMMM yyyy',
  /** e.g. July 2019 */
  monthYear: 'MMMM yyyy',
  /** e.g. 09:30 */
  time24: 'HH:mm',
  /** e.g. 09:30 AM */
  time12: 'hh:mm a',
  /** e.g. 27.09.2021 09:30 */
  dateTimeDot: 'dd.MM.yyyy HH:mm',
  /** e.g. 27 Sep 2021, 09:30 */
  dateTimeShort: 'dd MMM yyyy, HH:mm',
  /** e.g. 27 Sep 2021, 09:30 AM */
  dateTimeShort12: 'dd MMM yyyy, hh:mm a',
} as const;

export function toDate(value: Date | string | number): Date {
  return value instanceof Date ? value : new Date(value);
}

export function isValidDate(value: unknown): value is Date {
  if (!value) return false;
  const d = value instanceof Date ? value : new Date(value as string | number);
  return dfIsValid(d);
}

/**
 * Format a date with custom pattern and automatic or explicit locale
 */
export function formatDate(
  date: Date | string | number | null | undefined,
  pattern: string = DATE_FORMATS.dot,
  lang?: string
): string {
  if (!date) return '';
  const d = toDate(date);
  if (!dfIsValid(d)) return '';
  return dfFormat(d, pattern, { locale: getDateFnsLocale(lang) });
}

/**
 * Format time only (12 or 24 hour)
 */
export function formatTime(
  date: Date | string | number | null | undefined,
  pattern: string = DATE_FORMATS.time12,
  lang?: string
): string {
  return formatDate(date, pattern, lang);
}

/**
 * Format date & time together
 */
export function formatDateTime(
  date: Date | string | number | null | undefined,
  pattern: string = DATE_FORMATS.dateTimeShort12,
  lang?: string
): string {
  return formatDate(date, pattern, lang);
}

/**
 * Format relative to now (e.g. "2 jam yang lalu", "in 3 days")
 */
export function formatRelativeTime(
  date: Date | string | number,
  baseDate: Date = new Date(),
  lang?: string
): string {
  const d = toDate(date);
  if (!dfIsValid(d)) return '';
  return dfFormatRelative(d, baseDate, { locale: getDateFnsLocale(lang) });
}

/**
 * Format distance to now (e.g. "5 menit lalu", "sekitar 1 bulan")
 */
export function formatDistance(
  date: Date | string | number,
  lang?: string,
  addSuffix: boolean = true
): string {
  const d = toDate(date);
  if (!dfIsValid(d)) return '';
  return dfFormatDistanceToNow(d, {
    locale: getDateFnsLocale(lang),
    addSuffix,
  });
}

/**
 * Parse date string using pattern
 */
export function parseDate(
  dateStr: string,
  pattern: string = DATE_FORMATS.dot,
  referenceDate: Date = new Date(),
  lang?: string
): Date | null {
  try {
    const parsed = dfParse(dateStr, pattern, referenceDate, {
      locale: getDateFnsLocale(lang),
    });
    return dfIsValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

// Re-export common date-fns helpers with consistent naming
export const isToday = dfIsToday;
export const isYesterday = dfIsYesterday;
export const isTomorrow = dfIsTomorrow;
export const isSameDay = dfIsSameDay;
export const isSameMonth = dfIsSameMonth;
export const isSameYear = dfIsSameYear;
export const startOfDay = dfStartOfDay;
export const endOfDay = dfEndOfDay;
export const startOfWeek = dfStartOfWeek;
export const endOfWeek = dfEndOfWeek;
export const startOfMonth = dfStartOfMonth;
export const endOfMonth = dfEndOfMonth;
export const addDays = dfAddDays;
export const subDays = dfSubDays;
export const addMonths = dfAddMonths;
export const subMonths = dfSubMonths;
export const addWeeks = dfAddWeeks;
export const subWeeks = dfSubWeeks;
export const eachDayOfInterval = dfEachDayOfInterval;
export const getDaysInMonth = dfGetDaysInMonth;
export const getDay = dfGetDay;
export const setHours = dfSetHours;
export const setMinutes = dfSetMinutes;

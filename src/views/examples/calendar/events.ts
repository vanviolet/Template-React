import type { EventInput } from '@fullcalendar/react';

export type CalendarEventTone = 'primary' | 'info' | 'success' | 'warning' | 'purple' | 'amber';
export type CalendarCategory = 'all' | 'meetings' | 'events' | 'holidays' | 'timeoff';

export interface CalendarParticipant {
  name: string;
  avatar?: string;
  initials?: string;
}

export interface CalendarDemoEvent extends EventInput {
  id: string;
  title: string;
  start: string;
  end: string;
  tone: CalendarEventTone;
  category: 'meetings' | 'events' | 'holidays' | 'timeoff';
  location?: string;
  meetingUrl?: string;
  statusBadge?: 'today' | 'conflicted' | 'upcoming';
  conflictCount?: number;
  participants?: CalendarParticipant[];
  attendeeCount?: number;
  description?: string;
  allDay?: boolean;
  isMultiDay?: boolean;
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function toIsoDateTime(date: Date, hours: number, minutes: number): string {
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(hours)}:${pad(minutes)}:00`;
}

export function toIsoDateOnly(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function createCalendarDemoEvents(translate: (key: string) => string): CalendarDemoEvent[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const date = today.getDate();

  // Helper to construct dates relative to today
  const makeDate = (dayOffset: number, startHour: number, startMin: number, durationMinutes: number) => {
    const s = new Date(year, month, date + dayOffset, startHour, startMin);
    const e = new Date(s.getTime() + durationMinutes * 60 * 1000);
    return {
      start: `${s.getFullYear()}-${pad(s.getMonth() + 1)}-${pad(s.getDate())}T${pad(startHour)}:${pad(startMin)}:00`,
      end: `${e.getFullYear()}-${pad(e.getMonth() + 1)}-${pad(e.getDate())}T${pad(e.getHours())}:${pad(e.getMinutes())}:00`,
    };
  };

  const makeMultiDay = (startDayOffset: number, daysSpan: number) => {
    const s = new Date(year, month, date + startDayOffset);
    const e = new Date(year, month, date + startDayOffset + daysSpan);
    return {
      start: toIsoDateOnly(s),
      end: toIsoDateOnly(e),
    };
  };

  return [
    // Multi-day Event 1: 3-Day Summit (Starts Today)
    {
      id: 'edtech-summit-2026',
      title: '🚀 EdTech & AI Innovation Summit 2026',
      category: 'events',
      tone: 'purple',
      ...makeMultiDay(0, 3), // Spans 3 days!
      allDay: true,
      isMultiDay: true,
      location: 'Grand Convention Hall & Virtual',
      meetingUrl: 'https://zoom.us/j/summit2026',
      participants: [
        { name: 'Prof. Jenkins', initials: 'PJ' },
        { name: 'Dr. Sarah', initials: 'DS' },
        { name: 'Tech Guild', initials: 'TG' },
      ],
      attendeeCount: 120,
      description: 'Konferensi internasional 3 hari yang membahas inovasi sistem pendidikan, AI asistif, dan masa depan kurikulum digital.',
      classNames: ['fc-event-purple'],
    },

    // Multi-day Event 2: 2-Day Design Sprint (Tomorrow to Day After)
    {
      id: 'design-sprint-portal',
      title: '🎨 2-Day Design Sprint: Next-Gen Student Portal',
      category: 'meetings',
      tone: 'primary',
      ...makeMultiDay(1, 2), // Spans 2 days!
      allDay: true,
      isMultiDay: true,
      location: 'Design Studio & Figma Live',
      meetingUrl: 'https://meet.google.com/design-sprint',
      participants: [
        { name: 'UX Lead', initials: 'UX' },
        { name: 'Product Owner', initials: 'PO' },
      ],
      attendeeCount: 8,
      description: 'Sesi kolaborasi intensif 2 hari tim produk dan desainer untuk merancang antarmuka portal siswa generasi baru.',
      classNames: ['fc-event-primary'],
    },

    // Highlight Event 1: Weekly Team Meeting (Today)
    {
      id: 'weekly-team-meeting',
      title: 'Weekly Team Meeting',
      category: 'meetings',
      tone: 'primary',
      ...makeDate(0, 15, 0, 90), // 3:00 PM - 4:30 PM Today
      statusBadge: 'today',
      location: 'on Zoom',
      meetingUrl: 'https://zoom.us/j/123456789',
      participants: [
        { name: 'Alex Johnson', initials: 'AJ' },
        { name: 'Sarah Miller', initials: 'SM' },
        { name: 'David Lee', initials: 'DL' },
      ],
      attendeeCount: 7,
      description: 'Weekly sync with core engineering and design team members to discuss ongoing sprints.',
      classNames: ['fc-event-primary'],
    },

    // Highlight Event 2: Product Launch Event (Conflicted)
    {
      id: 'product-launch-event',
      title: 'Product Launch Event',
      category: 'events',
      tone: 'amber',
      ...makeDate(0, 15, 0, 90), // 3:00 PM - 4:30 PM Today (Conflicted!)
      statusBadge: 'conflicted',
      conflictCount: 2,
      location: 'Main Auditorium & Stream',
      participants: [
        { name: 'Marketing Lead', initials: 'ML' },
        { name: 'Product Owner', initials: 'PO' },
      ],
      attendeeCount: 15,
      description: 'Official keynote unveiling of the new education platform dashboard release.',
      classNames: ['fc-event-amber'],
    },

    // Timed Event: Brainstorming Session
    {
      id: 'brainstorming-session',
      title: 'Brainstorming Session',
      category: 'meetings',
      tone: 'info',
      ...makeDate(0, 9, 0, 30), // 9:00 AM - 9:30 AM Today
      location: 'Conference Room B',
      participants: [
        { name: 'Design Team', initials: 'DT' },
      ],
      attendeeCount: 4,
      classNames: ['fc-event-info'],
    },

    // Timed Event: Bi-Weekly Marketing
    {
      id: 'biweekly-marketing',
      title: 'Bi-Weekly Marketing Team Meeting',
      category: 'meetings',
      tone: 'primary',
      ...makeDate(0, 9, 30, 30), // 9:30 AM - 10:00 AM Today
      location: 'on Google Meet',
      meetingUrl: 'https://meet.google.com/abc-defg-hij',
      participants: [
        { name: 'Chloe Kim', initials: 'CK' },
        { name: 'Ryan Scott', initials: 'RS' },
      ],
      attendeeCount: 5,
      classNames: ['fc-event-primary'],
    },

    // Timed Event: Workshop Design Thinking (Warm peach card matching Fullcalendar2.jpg)
    {
      id: 'workshop-design',
      title: 'Workshop: "Mastering Design Thinking"',
      category: 'events',
      tone: 'amber',
      ...makeDate(0, 11, 30, 90), // 11:30 AM - 1:00 PM Today
      location: 'Innovation Lab Room 4',
      participants: [
        { name: 'UX Lead', initials: 'UX' },
        { name: 'Researcher', initials: 'RS' },
      ],
      attendeeCount: 8,
      description: 'Hands-on practical workshop covering human-centered design principles and wireframing.',
      classNames: ['fc-event-amber'],
    },

    // Timed Event: Tomorrow Project Review
    {
      id: 'project-review',
      title: 'Project Review Meeting',
      category: 'meetings',
      tone: 'info',
      ...makeDate(1, 9, 0, 30), // Tomorrow 9:00 AM - 9:30 AM
      location: 'on Zoom',
      participants: [
        { name: 'Product Lead', initials: 'PL' },
        { name: 'Senior Dev', initials: 'SD' },
      ],
      attendeeCount: 3,
      classNames: ['fc-event-info'],
    },

    // Timed Event: Sales Team Training Session
    {
      id: 'sales-training',
      title: 'Sales Team Training Session - Improving Sales Techniques',
      category: 'events',
      tone: 'primary',
      ...makeDate(1, 10, 0, 90), // Tomorrow 10:00 AM - 11:30 AM
      location: 'on Zoom',
      meetingUrl: 'https://zoom.us/j/987654321',
      participants: [
        { name: 'Sales Director', initials: 'SD' },
        { name: 'Elena Rostova', initials: 'ER' },
        { name: 'Marcus Bell', initials: 'MB' },
      ],
      attendeeCount: 12,
      description: 'Interactive session exploring enterprise client engagement techniques and proposal workflows.',
      classNames: ['fc-event-primary'],
    },

    // Timed Event: Quarterly Finance
    {
      id: 'quarterly-finance',
      title: 'Quarterly Financial Review - Analysis',
      category: 'meetings',
      tone: 'primary',
      ...makeDate(1, 12, 0, 60), // Tomorrow 12:00 PM
      location: 'Finance Suite A',
      attendeeCount: 4,
      classNames: ['fc-event-primary'],
    },

    // Timed Event: Strategy Planning Session
    {
      id: 'strategy-planning',
      title: 'Strategy Planning Session',
      category: 'meetings',
      tone: 'purple',
      ...makeDate(2, 11, 0, 30), // Day +2 11:00 AM - 11:30 AM
      location: 'Executive Boardroom',
      participants: [
        { name: 'Executive Team', initials: 'ET' },
      ],
      attendeeCount: 6,
      classNames: ['fc-event-purple'],
    },

    // Timed Event: Feature Roadmap Discussion
    {
      id: 'feature-roadmap',
      title: 'New Feature Implementation Roadmap Discussion',
      category: 'meetings',
      tone: 'info',
      ...makeDate(2, 11, 30, 90), // Day +2 11:30 AM - 1:00 PM
      location: 'on Zoom',
      participants: [
        { name: 'Tech Lead', initials: 'TL' },
        { name: 'Architect', initials: 'AR' },
      ],
      attendeeCount: 9,
      classNames: ['fc-event-info'],
    },

    // Multi-day Event 3: Company Wellness Days & Holiday (Weekend / 2 days)
    {
      id: 'company-wellness-retreat',
      title: '🌿 Company Wellness & Annual Retreat',
      category: 'holidays',
      tone: 'success',
      ...makeMultiDay(4, 2),
      allDay: true,
      isMultiDay: true,
      location: 'Puncak Mountain Resort',
      description: 'Program liburan bersama dan wellness 2 hari seluruh karyawan.',
      classNames: ['fc-event-success'],
    },
  ];
}

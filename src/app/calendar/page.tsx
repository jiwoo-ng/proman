'use client';

import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  ExternalLink,
  Calendar as CalendarIcon,
  X,
} from 'lucide-react';
import { dataStore } from '@/lib/mock-data';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const eventTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  meeting: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
  milestone: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
  deadline: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  review: { bg: '#faf5ff', text: '#7c3aed', border: '#ddd6fe' },
  other: { bg: '#f9fafb', text: '#4b5563', border: '#e5e7eb' },
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 16)); // April 2026
  const [view, setView] = useState<'month' | 'week'>('month');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showGoogleConnect, setShowGoogleConnect] = useState(false);

  const events = dataStore.getCalendarEvents();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.start.startsWith(dateStr));
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const selectedEventData = selectedEvent ? events.find(e => e.id === selectedEvent) : null;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', margin: 0 }}>Calendar</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Schedule and track project events</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowGoogleConnect(!showGoogleConnect)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', color: '#374151' }}
          >
            <CalendarIcon size={18} color="#16a34a" />
            Connect Google Calendar
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: 'linear-gradient(135deg, #16a34a, #22c55e)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={18} /> Add Event
          </button>
        </div>
      </div>

      {/* Google Calendar connect notice */}
      {showGoogleConnect && (
        <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '20px 24px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarIcon size={20} color="#16a34a" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>Google Calendar Integration</div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>Connect your Google account to sync events bidirectionally</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ padding: '8px 20px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
              Connect with Google
            </button>
            <button onClick={() => setShowGoogleConnect(false)} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={18} color="#9ca3af" />
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        {/* Calendar grid */}
        <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          {/* Calendar header */}
          <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button onClick={prevMonth} style={{ padding: '6px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}>
                <ChevronLeft size={18} color="#374151" />
              </button>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: '#111827', minWidth: '180px', textAlign: 'center' }}>
                {MONTHS[month]} {year}
              </h2>
              <button onClick={nextMonth} style={{ padding: '6px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}>
                <ChevronRight size={18} color="#374151" />
              </button>
            </div>
            <div style={{ display: 'flex', gap: '4px', padding: '3px', background: '#f3f4f6', borderRadius: '8px' }}>
              {(['month', 'week'] as const).map(v => (
                <button key={v} onClick={() => setView(v)} style={{ padding: '5px 14px', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', background: view === v ? 'white' : 'transparent', color: view === v ? '#111827' : '#6b7280', boxShadow: view === v ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', textTransform: 'capitalize' }}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {DAYS.map(day => (
              <div key={day} style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#6b7280', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {calendarDays.map((day, idx) => {
              const dayEvents = day ? getEventsForDay(day) : [];
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              return (
                <div
                  key={idx}
                  style={{
                    minHeight: '100px',
                    padding: '8px',
                    borderRight: (idx + 1) % 7 !== 0 ? '1px solid #f3f4f6' : 'none',
                    borderBottom: '1px solid #f3f4f6',
                    background: isToday ? '#f0fdf4' : day ? 'white' : '#fafafa',
                  }}
                >
                  {day && (
                    <>
                      <div style={{ fontSize: '13px', fontWeight: isToday ? 700 : 400, color: isToday ? '#16a34a' : '#374151', marginBottom: '4px', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isToday ? '#16a34a' : 'transparent', ...(isToday ? { color: 'white' } : {}) }}>
                        {day}
                      </div>
                      {dayEvents.slice(0, 2).map(event => {
                        const colors = eventTypeColors[event.type] || eventTypeColors.other;
                        return (
                          <div
                            key={event.id}
                            onClick={() => setSelectedEvent(event.id)}
                            style={{
                              padding: '2px 6px',
                              background: colors.bg,
                              color: colors.text,
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 500,
                              marginBottom: '2px',
                              cursor: 'pointer',
                              borderLeft: `2px solid ${colors.border}`,
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {event.title}
                          </div>
                        );
                      })}
                      {dayEvents.length > 2 && (
                        <div style={{ fontSize: '10px', color: '#9ca3af', paddingLeft: '6px' }}>+{dayEvents.length - 2} more</div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar - upcoming events */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Selected event detail */}
          {selectedEventData && (
            <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, background: eventTypeColors[selectedEventData.type].bg, color: eventTypeColors[selectedEventData.type].text, textTransform: 'capitalize' }}>
                  {selectedEventData.type}
                </span>
                <button onClick={() => setSelectedEvent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={16} color="#9ca3af" />
                </button>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px', color: '#111827' }}>{selectedEventData.title}</h3>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 12px' }}>{selectedEventData.description}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151' }}>
                  <Clock size={14} color="#9ca3af" />
                  {new Date(selectedEventData.start).toLocaleString()}
                </div>
                {selectedEventData.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151' }}>
                    <MapPin size={14} color="#9ca3af" />
                    {selectedEventData.location}
                  </div>
                )}
                {selectedEventData.attendees.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151', marginBottom: '6px' }}>
                      <Users size={14} color="#9ca3af" /> Attendees
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', paddingLeft: '22px' }}>
                      {selectedEventData.attendees.map(a => (
                        <span key={a} style={{ padding: '2px 8px', background: '#f0fdf4', color: '#166534', borderRadius: '12px', fontSize: '11px' }}>{a}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upcoming events list */}
          <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0, color: '#111827' }}>Upcoming Events</h3>
            </div>
            {events
              .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
              .slice(0, 6)
              .map(event => {
                const colors = eventTypeColors[event.type] || eventTypeColors.other;
                return (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event.id)}
                    style={{
                      padding: '12px 20px',
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                      borderLeft: `3px solid ${colors.border}`,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#111827', marginBottom: '4px' }}>{event.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                        {new Date(event.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span style={{ padding: '1px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 500, background: colors.bg, color: colors.text, textTransform: 'capitalize' }}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

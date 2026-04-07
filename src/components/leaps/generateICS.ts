import { format, addDays } from 'date-fns';
import type { LeapPrediction } from '../../data/leapData';

// generateICS — generates iCalendar (.ics) string from leap predictions for calendar export.
export default function generateICS(predictions: LeapPrediction[], childName: string): string {
  const now = new Date();
  const stamp = format(now, "yyyyMMdd'T'HHmmss'Z'");

  const events = predictions
    .filter((p) => p.status !== 'past')
    .flatMap((p) => {
      const uid1 = `leap-${p.leap.number}-stormy@bladdertracker`;
      const uid2 = `leap-${p.leap.number}-sunny@bladdertracker`;
      const stormyEnd = format(addDays(p.peakDate, 1), 'yyyyMMdd');
      const sunnyEnd = format(addDays(p.sunnyDate, 1), 'yyyyMMdd');
      return [
        `BEGIN:VEVENT\r\nUID:${uid1}\r\nDTSTAMP:${stamp}\r\nDTSTART;VALUE=DATE:${format(p.stormyStart, 'yyyyMMdd')}\r\nDTEND;VALUE=DATE:${stormyEnd}\r\nSUMMARY:⛈️ ${childName} Leap ${p.leap.number} – Stormy Phase\r\nDESCRIPTION:${p.leap.title}: ${p.leap.description}\r\nEND:VEVENT`,
        `BEGIN:VEVENT\r\nUID:${uid2}\r\nDTSTAMP:${stamp}\r\nDTSTART;VALUE=DATE:${format(p.peakDate, 'yyyyMMdd')}\r\nDTEND;VALUE=DATE:${sunnyEnd}\r\nSUMMARY:🌟 ${childName} Leap ${p.leap.number} – Sunny Phase\r\nDESCRIPTION:${p.leap.title}: Skills emerging — ${p.leap.skills.join(', ')}\r\nEND:VEVENT`,
      ];
    });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BladderTracker//Leap Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');
}

const moneyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

// MySQL DECIMAL values arrive as strings ("90.00"), so convert before formatting
export const formatMoney = (value) => moneyFormatter.format(Number(value) || 0);

// Short form for chart axes: 1250 -> $1.3k
export const formatMoneyShort = (value) =>
  Math.abs(value) >= 1000 ? `$${(value / 1000).toFixed(1).replace(/\.0$/, '')}k` : `$${value}`;

export const formatDateRange = (checkIn, checkOut) => `${checkIn} → ${checkOut}`;

// Dates are plain "YYYY-MM-DD" strings. Parsing them as UTC avoids timezone off-by-one days.
const toUtc = (date) => new Date(`${date}T00:00:00Z`);

export function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const nights = Math.round((toUtc(checkOut) - toUtc(checkIn)) / 86_400_000);
  return nights > 0 ? nights : 0;
}

export function addDays(date, days) {
  if (!date) return '';
  const result = toUtc(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}

// "AcherPati" -> "A", "Jean-Luc Victor" -> "JV", "" -> "?"
export function getInitials(name = '') {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export const ROOM_STATUSES = [
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'maintenance', label: 'Maintenance' }
];

export const BOOKING_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'checked_in', label: 'Checked in' },
  { value: 'checked_out', label: 'Checked out' },
  { value: 'cancelled', label: 'Cancelled' }
];

const ALL_STATUS_LABELS = Object.fromEntries(
  [...ROOM_STATUSES, ...BOOKING_STATUSES].map((s) => [s.value, s.label])
);

export const statusLabel = (value) => ALL_STATUS_LABELS[value] || value;

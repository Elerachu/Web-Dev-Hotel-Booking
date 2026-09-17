import { CalendarCheck, ChartColumn, DoorOpen, LayoutDashboard, Users } from 'lucide-react';

// One list drives both the sidebar links and the page title in the top bar.
export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/guests', label: 'Guests', icon: Users },
  { to: '/rooms', label: 'Rooms', icon: DoorOpen },
  { to: '/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/revenue', label: 'Revenue', icon: ChartColumn }
];

export function titleForPath(pathname) {
  const match = NAV_ITEMS.find((item) => (item.end ? pathname === item.to : pathname.startsWith(item.to)));
  return match ? match.label : 'Dashboard';
}

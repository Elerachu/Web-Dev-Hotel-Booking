import { Link } from 'react-router-dom';
import { bookingsApi } from '../api/bookings.js';
import { reportsApi } from '../api/reports.js';
import { useApiData } from '../hooks/useApiData.js';
import StatCard from '../components/ui/StatCard.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import DataTable, { Cell } from '../components/ui/DataTable.jsx';
import { formatDateRange } from '../utils/format.js';

const RECENT_LIMIT = 5;

const COLUMNS = [
  { key: 'guest', label: 'Guest' },
  { key: 'room', label: 'Room' },
  { key: 'dates', label: 'Dates' },
  { key: 'status', label: 'Status' }
];

export default function Dashboard() {
  const summary = useApiData(() => reportsApi.summary());
  const bookings = useApiData(() => bookingsApi.listWithDetails());

  // newest bookings first (highest id = created most recently)
  const recent = [...(bookings.data || [])].sort((a, b) => b.booking_id - a.booking_id).slice(0, RECENT_LIMIT);
  const s = summary.data;
  const show = (value) => (summary.loading ? '–' : summary.error ? '!' : value);

  return (
    <div className="space-y-10">
      {summary.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Couldn't load the numbers: {summary.error.message}
        </p>
      )}

      <section aria-label="Hotel summary" className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        <StatCard label="Total guests" value={show(s?.total_guests)} />
        <StatCard label="Available rooms" value={show(s?.available_rooms)} />
        <StatCard label="Active bookings" value={show(s?.active_bookings)} />
        <StatCard label="Occupancy" value={show(`${s?.occupancy_rate}%`)} progress={s ? s.occupancy_rate : undefined} />
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-medium tracking-tight text-ink">Recent bookings</h2>
          <Link
            to="/bookings"
            className="rounded text-[15px] font-medium text-lagoon-700 outline-none hover:text-lagoon-900 hover:underline focus-visible:ring-4 focus-visible:ring-lagoon-200"
          >
            View all bookings
          </Link>
        </div>

        <DataTable
          columns={COLUMNS}
          loading={bookings.loading}
          error={bookings.error}
          onRetry={bookings.reload}
          isEmpty={recent.length === 0}
          emptyMessage="No bookings yet. New bookings will appear here."
        >
          {recent.map((booking) => (
            <tr key={booking.booking_id}>
              <Cell>{booking.guest_name}</Cell>
              <Cell className="tabular">{booking.room_number}</Cell>
              <Cell className="tabular whitespace-nowrap">{formatDateRange(booking.check_in_date, booking.check_out_date)}</Cell>
              <Cell>
                <StatusBadge status={booking.status} />
              </Cell>
            </tr>
          ))}
        </DataTable>
      </section>
    </div>
  );
}

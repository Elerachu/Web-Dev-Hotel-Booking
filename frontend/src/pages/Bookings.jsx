import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookingsApi } from '../api/bookings.js';
import { useApiData } from '../hooks/useApiData.js';
import { useToast } from '../context/ToastContext.jsx';
import Button from '../components/ui/Button.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import DataTable, { Cell, RowActions } from '../components/ui/DataTable.jsx';
import FilterTabs from '../components/ui/FilterTabs.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import BookingFormModal from '../components/forms/BookingFormModal.jsx';
import { BOOKING_STATUSES, formatDateRange, formatMoney, nightsBetween } from '../utils/format.js';

const TABS = [{ value: 'all', label: 'All' }, ...BOOKING_STATUSES];

const COLUMNS = [
  { key: 'guest', label: 'Guest' },
  { key: 'room', label: 'Room' },
  { key: 'dates', label: 'Dates' },
  { key: 'nights', label: 'Nights' },
  { key: 'total', label: 'Total' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions', className: 'w-40' }
];

export default function Bookings() {
  const notify = useToast();
  const { data, loading, error, reload } = useApiData(() => bookingsApi.listWithDetails());

  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('status');
  const tab = TABS.some((t) => t.value === requested) ? requested : 'all';

  // All bookings are already loaded with guest and room details, so these tabs filter in the browser
  const bookings = [...(data || [])]
    .filter((booking) => tab === 'all' || booking.status === tab)
    .sort((a, b) => b.check_in_date.localeCompare(a.check_in_date) || b.booking_id - a.booking_id);

  const [editing, setEditing] = useState(undefined);
  const [deleting, setDeleting] = useState(null);

  const handleSaved = (message) => {
    setEditing(undefined);
    notify(message);
    reload();
  };

  const tabLabel = TABS.find((t) => t.value === tab).label.toLowerCase();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <FilterTabs
          label="Filter bookings by status"
          tabs={TABS}
          value={tab}
          onChange={(value) => setSearchParams(value === 'all' ? {} : { status: value })}
        />
        <Button onClick={() => setEditing(null)}>New booking</Button>
      </div>

      <DataTable
        columns={COLUMNS}
        loading={loading}
        error={error}
        onRetry={reload}
        isEmpty={bookings.length === 0}
        emptyMessage={tab === 'all' ? 'No bookings yet. Create the first booking for a guest.' : `No ${tabLabel} bookings.`}
      >
        {bookings.map((booking) => (
          <tr key={booking.booking_id}>
            <Cell>{booking.guest_name}</Cell>
            <Cell className="tabular">{booking.room_number}</Cell>
            <Cell className="tabular whitespace-nowrap">{formatDateRange(booking.check_in_date, booking.check_out_date)}</Cell>
            <Cell className="tabular">{nightsBetween(booking.check_in_date, booking.check_out_date)}</Cell>
            <Cell className="tabular">{formatMoney(booking.total_price)}</Cell>
            <Cell>
              <StatusBadge status={booking.status} />
            </Cell>
            <Cell>
              <RowActions
                itemName={`booking for ${booking.guest_name}`}
                onEdit={() => setEditing(booking)}
                onDelete={() => setDeleting(booking)}
              />
            </Cell>
          </tr>
        ))}
      </DataTable>

      <BookingFormModal
        open={editing !== undefined}
        booking={editing}
        onClose={() => setEditing(undefined)}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete booking"
        message={`Delete ${deleting?.guest_name}'s booking for room ${deleting?.room_number} (${deleting?.check_in_date} to ${deleting?.check_out_date})? This can't be undone.`}
        confirmLabel="Delete booking"
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          await bookingsApi.remove(deleting.booking_id);
          notify('Booking deleted');
          reload();
        }}
      />
    </div>
  );
}

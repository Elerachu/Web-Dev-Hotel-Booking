import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { roomsApi } from '../api/rooms.js';
import { useApiData } from '../hooks/useApiData.js';
import { useToast } from '../context/ToastContext.jsx';
import Button from '../components/ui/Button.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import DataTable, { Cell, RowActions } from '../components/ui/DataTable.jsx';
import FilterTabs from '../components/ui/FilterTabs.jsx';
import StatusBadge from '../components/ui/StatusBadge.jsx';
import RoomFormModal from '../components/forms/RoomFormModal.jsx';
import { formatMoney, ROOM_STATUSES } from '../utils/format.js';

const TABS = [{ value: 'all', label: 'All' }, ...ROOM_STATUSES];

const COLUMNS = [
  { key: 'number', label: 'Room #' },
  { key: 'type', label: 'Type' },
  { key: 'price', label: 'Price / night' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions', className: 'w-40' }
];

const EMPTY_MESSAGES = {
  all: 'No rooms yet. Add the hotel’s rooms to start taking bookings.',
  available: 'No rooms are available right now.',
  occupied: 'No rooms are occupied right now.',
  maintenance: 'No rooms are under maintenance.'
};

export default function Rooms() {
  const notify = useToast();

  // The selected tab lives in the URL (/rooms?status=occupied), so refreshing keeps it
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('status');
  const tab = TABS.some((t) => t.value === requested) ? requested : 'all';

  // The backend does the filtering: GET /api/rooms?status=occupied
  const { data, loading, error, reload } = useApiData(() => roomsApi.list(tab === 'all' ? undefined : tab), [tab]);
  const rooms = data || [];

  const [editing, setEditing] = useState(undefined);
  const [deleting, setDeleting] = useState(null);

  const changeTab = (value) => setSearchParams(value === 'all' ? {} : { status: value });

  const handleSaved = (message) => {
    setEditing(undefined);
    notify(message);
    reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <FilterTabs label="Filter rooms by status" tabs={TABS} value={tab} onChange={changeTab} />
        <Button onClick={() => setEditing(null)}>Add room</Button>
      </div>

      <DataTable
        columns={COLUMNS}
        loading={loading}
        error={error}
        onRetry={reload}
        isEmpty={rooms.length === 0}
        emptyMessage={EMPTY_MESSAGES[tab]}
      >
        {rooms.map((room) => (
          <tr key={room.room_id}>
            <Cell className="tabular">{room.room_number}</Cell>
            <Cell>{room.room_type}</Cell>
            <Cell className="tabular">{formatMoney(room.price_per_night)}</Cell>
            <Cell>
              <StatusBadge status={room.status} />
            </Cell>
            <Cell>
              <RowActions
                itemName={`room ${room.room_number}`}
                onEdit={() => setEditing(room)}
                onDelete={() => setDeleting(room)}
              />
            </Cell>
          </tr>
        ))}
      </DataTable>

      <RoomFormModal open={editing !== undefined} room={editing} onClose={() => setEditing(undefined)} onSaved={handleSaved} />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete room"
        message={`Delete room ${deleting?.room_number}? Every booking for this room will be deleted too. This can't be undone.`}
        confirmLabel="Delete room"
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          await roomsApi.remove(deleting.room_id);
          notify('Room deleted');
          reload();
        }}
      />
    </div>
  );
}

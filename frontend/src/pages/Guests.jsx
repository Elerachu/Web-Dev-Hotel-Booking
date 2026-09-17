import { useState } from 'react';
import { guestsApi } from '../api/guests.js';
import { useApiData } from '../hooks/useApiData.js';
import { useToast } from '../context/ToastContext.jsx';
import Button from '../components/ui/Button.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import DataTable, { Cell, RowActions } from '../components/ui/DataTable.jsx';
import GuestFormModal from '../components/forms/GuestFormModal.jsx';

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'passport', label: 'Passport #' },
  { key: 'actions', label: 'Actions', className: 'w-40' }
];

export default function Guests() {
  const notify = useToast();
  const { data, loading, error, reload } = useApiData(() => guestsApi.list());
  const guests = data || [];

  // editing: undefined = popup closed, null = adding a new guest, object = editing that guest
  const [editing, setEditing] = useState(undefined);
  const [deleting, setDeleting] = useState(null);

  const handleSaved = (message) => {
    setEditing(undefined);
    notify(message);
    reload();
  };

  const addButton = <Button onClick={() => setEditing(null)}>Add guest</Button>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-lg text-slate-500">Guests registered in the system.</p>
        {addButton}
      </div>

      <DataTable
        columns={COLUMNS}
        loading={loading}
        error={error}
        onRetry={reload}
        isEmpty={guests.length === 0}
        emptyMessage="No guests yet. Add a guest before creating their booking."
        emptyAction={addButton}
      >
        {guests.map((guest) => (
          <tr key={guest.guest_id}>
            <Cell>{guest.name}</Cell>
            <Cell>{guest.email || <span className="text-slate-400">No email</span>}</Cell>
            <Cell className="tabular">{guest.phone}</Cell>
            <Cell className="tabular">{guest.passport_number}</Cell>
            <Cell>
              <RowActions itemName={guest.name} onEdit={() => setEditing(guest)} onDelete={() => setDeleting(guest)} />
            </Cell>
          </tr>
        ))}
      </DataTable>

      <GuestFormModal open={editing !== undefined} guest={editing} onClose={() => setEditing(undefined)} onSaved={handleSaved} />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete guest"
        message={`Delete ${deleting?.name}? All of their bookings will be deleted too. This can't be undone.`}
        confirmLabel="Delete guest"
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          await guestsApi.remove(deleting.guest_id);
          notify('Guest deleted');
          reload();
        }}
      />
    </div>
  );
}

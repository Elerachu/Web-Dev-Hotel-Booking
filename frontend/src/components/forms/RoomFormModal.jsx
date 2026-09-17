import { useEffect, useState } from 'react';
import Modal, { ModalActions } from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { FormError, SelectInput, TextInput } from '../ui/Field.jsx';
import { roomsApi } from '../../api/rooms.js';
import { ROOM_STATUSES } from '../../utils/format.js';

const EMPTY = { room_number: '', room_type: '', price_per_night: '', status: 'available' };

export default function RoomFormModal({ open, room, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(room);

  useEffect(() => {
    if (!open) return;
    setError('');
    setForm(
      room
        ? {
            room_number: String(room.room_number),
            room_type: room.room_type,
            price_per_night: String(Number(room.price_per_night)),
            status: room.status
          }
        : EMPTY
    );
  }, [open, room]);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      room_number: Number(form.room_number),
      room_type: form.room_type.trim(),
      price_per_night: Number(form.price_per_night),
      status: form.status
    };

    try {
      if (isEdit) await roomsApi.update(room.room_id, payload);
      else await roomsApi.create(payload);
      onSaved(isEdit ? 'Room updated' : 'Room added');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} title={isEdit ? 'Edit room' : 'Add room'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <TextInput
          id="room-number"
          label="Room number"
          type="number"
          min={1}
          step={1}
          value={form.room_number}
          onChange={update('room_number')}
          required
        />
        <TextInput
          id="room-type"
          label="Room type"
          placeholder="Single, Double, Suite..."
          value={form.room_type}
          onChange={update('room_type')}
          required
          maxLength={50}
        />
        <TextInput
          id="room-price"
          label="Price per night"
          type="number"
          min={0.01}
          step={0.01}
          value={form.price_per_night}
          onChange={update('price_per_night')}
          required
        />
        <SelectInput id="room-status" label="Status" value={form.status} onChange={update('status')}>
          {ROOM_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </SelectInput>
        <FormError message={error} />
        <ModalActions>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Save room
          </Button>
        </ModalActions>
      </form>
    </Modal>
  );
}

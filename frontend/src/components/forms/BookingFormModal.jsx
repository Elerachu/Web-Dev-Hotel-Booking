import { useEffect, useState } from 'react';
import Modal, { ModalActions } from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { FormError, SelectInput, TextInput } from '../ui/Field.jsx';
import { bookingsApi } from '../../api/bookings.js';
import { guestsApi } from '../../api/guests.js';
import { roomsApi } from '../../api/rooms.js';
import { addDays, BOOKING_STATUSES, formatMoney, nightsBetween } from '../../utils/format.js';

const EMPTY = {
  guest_id: '',
  room_id: '',
  check_in_date: '',
  check_out_date: '',
  total_price: '',
  status: 'pending'
};

export default function BookingFormModal({ open, booking, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [optionsError, setOptionsError] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(booking);

  // Fill the form and load the guest + room dropdowns every time the popup opens
  useEffect(() => {
    if (!open) return;
    setError('');
    setOptionsError('');
    setForm(
      booking
        ? {
            guest_id: String(booking.guest_id),
            room_id: String(booking.room_id),
            check_in_date: booking.check_in_date,
            check_out_date: booking.check_out_date,
            total_price: String(Number(booking.total_price)),
            status: booking.status
          }
        : EMPTY
    );

    Promise.all([guestsApi.list(), roomsApi.list()])
      .then(([guestList, roomList]) => {
        setGuests([...guestList].sort((a, b) => a.name.localeCompare(b.name)));
        setRooms(roomList);
      })
      .catch((err) => setOptionsError(err.message));
  }, [open, booking]);

  // Total = nights x room price. Recalculated only when the room or a date changes,
  // so a price typed by hand (e.g. a discount) is kept otherwise.
  const withAutoTotal = (next) => {
    const room = rooms.find((r) => String(r.room_id) === next.room_id);
    const nights = nightsBetween(next.check_in_date, next.check_out_date);
    if (room && nights > 0) {
      return { ...next, total_price: (nights * Number(room.price_per_night)).toFixed(2) };
    }
    return next;
  };

  const update = (field) => (event) => {
    const value = event.target.value;
    setForm((current) => {
      const next = { ...current, [field]: value };
      // moving check-in past check-out clears check-out instead of leaving an impossible stay
      if (field === 'check_in_date' && next.check_out_date && next.check_out_date <= value) {
        next.check_out_date = '';
      }
      return ['room_id', 'check_in_date', 'check_out_date'].includes(field) ? withAutoTotal(next) : next;
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    if (nightsBetween(form.check_in_date, form.check_out_date) < 1) {
      setError('Check-out must be at least one day after check-in.');
      return;
    }

    setSaving(true);
    setError('');
    const payload = {
      guest_id: Number(form.guest_id),
      room_id: Number(form.room_id),
      check_in_date: form.check_in_date,
      check_out_date: form.check_out_date,
      total_price: Number(form.total_price),
      status: form.status
    };

    try {
      if (isEdit) await bookingsApi.update(booking.booking_id, payload);
      else await bookingsApi.create(payload);
      onSaved(isEdit ? 'Booking updated' : 'Booking saved');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} title={isEdit ? 'Edit booking' : 'New booking'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <SelectInput id="booking-guest" label="Guest" value={form.guest_id} onChange={update('guest_id')} required>
          <option value="">Select a guest</option>
          {guests.map((guest) => (
            <option key={guest.guest_id} value={guest.guest_id}>
              {guest.name}
            </option>
          ))}
        </SelectInput>

        <SelectInput id="booking-room" label="Room" value={form.room_id} onChange={update('room_id')} required>
          <option value="">Select a room</option>
          {rooms.map((room) => {
            // rooms under maintenance can't be picked for a new booking,
            // but an existing booking keeps showing its current room
            const blocked = room.status === 'maintenance' && String(room.room_id) !== String(booking?.room_id);
            return (
              <option key={room.room_id} value={room.room_id} disabled={blocked}>
                Room {room.room_number}, {room.room_type}, {formatMoney(room.price_per_night)}/night
                {blocked ? ' (maintenance)' : ''}
              </option>
            );
          })}
        </SelectInput>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput
            id="booking-check-in"
            label="Check-in"
            type="date"
            value={form.check_in_date}
            onChange={update('check_in_date')}
            required
          />
          <TextInput
            id="booking-check-out"
            label="Check-out"
            type="date"
            value={form.check_out_date}
            min={addDays(form.check_in_date, 1) || undefined}
            onChange={update('check_out_date')}
            required
          />
        </div>

        <TextInput
          id="booking-total"
          label="Total price"
          type="number"
          min={0}
          step={0.01}
          value={form.total_price}
          onChange={update('total_price')}
          required
          hint="Pick a room and both dates to auto-fill this"
        />

        <SelectInput id="booking-status" label="Status" value={form.status} onChange={update('status')}>
          {BOOKING_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </SelectInput>

        <FormError message={optionsError || error} />
        <ModalActions>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Save booking
          </Button>
        </ModalActions>
      </form>
    </Modal>
  );
}

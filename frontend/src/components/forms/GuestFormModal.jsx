import { useEffect, useState } from 'react';
import Modal, { ModalActions } from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { FormError, TextInput } from '../ui/Field.jsx';
import { guestsApi } from '../../api/guests.js';

const EMPTY = { name: '', email: '', phone: '', passport_number: '' };

// Used for both "Add guest" (guest = null) and "Edit guest" (guest = the row being edited)
export default function GuestFormModal({ open, guest, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(guest);

  useEffect(() => {
    if (!open) return;
    setError('');
    setForm(
      guest
        ? {
            name: guest.name,
            email: guest.email || '',
            phone: guest.phone,
            passport_number: guest.passport_number
          }
        : EMPTY
    );
  }, [open, guest]);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      // email is optional and UNIQUE in the database: send null, not "", when it is left blank,
      // otherwise two guests without an email would clash
      email: form.email.trim() || null,
      phone: form.phone.trim(),
      passport_number: form.passport_number.trim()
    };

    try {
      if (isEdit) await guestsApi.update(guest.guest_id, payload);
      else await guestsApi.create(payload);
      onSaved(isEdit ? 'Guest updated' : 'Guest added');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} title={isEdit ? 'Edit guest' : 'Add guest'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <TextInput id="guest-name" label="Full name" value={form.name} onChange={update('name')} required maxLength={100} />
        <TextInput
          id="guest-email"
          label="Email"
          type="email"
          value={form.email}
          onChange={update('email')}
          maxLength={100}
          hint="Optional"
        />
        <TextInput id="guest-phone" label="Phone" type="tel" value={form.phone} onChange={update('phone')} required maxLength={20} />
        <TextInput
          id="guest-passport"
          label="Passport number"
          value={form.passport_number}
          onChange={update('passport_number')}
          required
          maxLength={30}
        />
        <FormError message={error} />
        <ModalActions>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Save guest
          </Button>
        </ModalActions>
      </form>
    </Modal>
  );
}

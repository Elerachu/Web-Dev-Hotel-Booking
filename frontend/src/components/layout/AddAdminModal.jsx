import { useState } from 'react';
import Modal, { ModalActions } from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { FormError, TextInput } from '../ui/Field.jsx';
import { authApi } from '../../api/auth.js';
import { useToast } from '../../context/ToastContext.jsx';

const EMPTY = { name: '', email: '', password: '' };

// Creates another admin login. The current admin stays logged in.
export default function AddAdminModal({ open, onClose }) {
  const notify = useToast();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const close = () => {
    setForm(EMPTY);
    setError('');
    onClose();
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { admin } = await authApi.signup(form);
      notify(`${admin.name} can now log in`);
      close();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} title="Add admin" onClose={close}>
      <form onSubmit={submit} className="space-y-4">
        <TextInput id="admin-name" label="Full name" value={form.name} onChange={update('name')} required autoComplete="off" />
        <TextInput id="admin-email" label="Email" type="email" value={form.email} onChange={update('email')} required autoComplete="off" />
        <TextInput
          id="admin-password"
          label="Password"
          type="password"
          value={form.password}
          onChange={update('password')}
          required
          minLength={8}
          autoComplete="new-password"
          hint="At least 8 characters. Share it with the new admin privately."
        />
        <FormError message={error} />
        <ModalActions>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Save admin
          </Button>
        </ModalActions>
      </form>
    </Modal>
  );
}

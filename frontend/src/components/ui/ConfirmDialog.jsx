import { useState } from 'react';
import Modal, { ModalActions } from './Modal.jsx';
import Button from './Button.jsx';
import { FormError } from './Field.jsx';

// "Are you sure?" popup for deletes. onConfirm may be async; errors are shown inside the popup.
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const close = () => {
    setError('');
    onClose();
  };

  const confirm = async () => {
    setBusy(true);
    setError('');
    try {
      await onConfirm();
      close();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} title={title} onClose={close} width="max-w-md">
      <p className="text-[15px] leading-relaxed text-slate-600">{message}</p>
      <FormError message={error} />
      <ModalActions>
        <Button variant="ghost" onClick={close} data-autofocus>
          Cancel
        </Button>
        <Button variant="danger" loading={busy} onClick={confirm}>
          {confirmLabel}
        </Button>
      </ModalActions>
    </Modal>
  );
}

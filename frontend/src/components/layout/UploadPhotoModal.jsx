import { useEffect, useState } from 'react';
import Modal, { ModalActions } from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import Avatar from '../ui/Avatar.jsx';
import { FormError } from '../ui/Field.jsx';
import { authApi } from '../../api/auth.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const MAX_BYTES = 2 * 1024 * 1024; // same 2 MB limit as the backend
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default function UploadPhotoModal({ open, onClose }) {
  const { admin, setAdmin } = useAuth();
  const notify = useToast();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(null); // 'upload' | 'remove' | null

  // show the chosen image before it is uploaded; free the temporary URL afterwards
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const close = () => {
    setFile(null);
    setError('');
    onClose();
  };

  const chooseFile = (event) => {
    const chosen = event.target.files?.[0];
    setError('');
    if (!chosen) return;
    if (!ACCEPTED.includes(chosen.type)) {
      setError('Choose a JPG, PNG, WEBP or GIF image.');
      return;
    }
    if (chosen.size > MAX_BYTES) {
      setError('This image is larger than 2 MB. Choose a smaller one.');
      return;
    }
    setFile(chosen);
  };

  const upload = async (event) => {
    event.preventDefault();
    if (!file) return;
    setBusy('upload');
    try {
      setAdmin(await authApi.uploadPhoto(file));
      notify('Photo updated');
      close();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  const removePhoto = async () => {
    setBusy('remove');
    try {
      setAdmin(await authApi.removePhoto());
      notify('Photo removed');
      close();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <Modal open={open} title="Upload photo" onClose={close} width="max-w-md">
      <form onSubmit={upload}>
        <div className="flex items-center gap-5">
          {previewUrl ? (
            <img src={previewUrl} alt="New photo preview" className="h-24 w-24 shrink-0 rounded-full object-cover" />
          ) : (
            <Avatar name={admin?.name} photoUrl={admin?.photo_url} size="lg" />
          )}
          <div className="min-w-0">
            <label
              htmlFor="photo-file"
              className="inline-flex cursor-pointer rounded-full border border-slate-300 px-4 py-2 text-[15px] font-medium text-ink transition-colors hover:border-lagoon-500 hover:bg-lagoon-50 focus-within:ring-4 focus-within:ring-lagoon-100"
            >
              Choose image
              <input id="photo-file" type="file" accept={ACCEPTED.join(',')} onChange={chooseFile} className="sr-only" />
            </label>
            <p className="mt-2 truncate text-sm text-slate-500">
              {file ? file.name : 'JPG, PNG, WEBP or GIF, up to 2 MB'}
            </p>
          </div>
        </div>

        <FormError message={error} />

        <ModalActions>
          {admin?.photo_url && !file && (
            <Button variant="ghost" className="mr-auto text-red-600 hover:text-red-700" loading={busy === 'remove'} onClick={removePhoto}>
              Remove photo
            </Button>
          )}
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" disabled={!file} loading={busy === 'upload'}>
            Save photo
          </Button>
        </ModalActions>
      </form>
    </Modal>
  );
}

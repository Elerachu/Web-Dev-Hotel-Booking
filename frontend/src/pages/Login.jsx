import { useEffect, useState } from 'react';
import { authApi } from '../api/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
import { usePageMeta } from '../hooks/usePageMeta.js';
import Button from '../components/ui/Button.jsx';
import { FormError, TextInput } from '../components/ui/Field.jsx';

import hotelPhoto from '../assets/hotel-login.png';

export default function Login() {
  usePageMeta('Log in', '/favicon-login.svg'); // login page favicon placeholder

  const { login, createFirstAdmin } = useAuth();
  // null while asking the backend; true = normal login; false = no admins yet, show setup form
  const [hasAdmins, setHasAdmins] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const checkStatus = () => {
    setError('');
    authApi
      .status()
      .then((result) => setHasAdmins(result.hasAdmins))
      .catch((err) => setError(err.message));
  };

  useEffect(checkStatus, []);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (hasAdmins) await login(form.email, form.password);
      else await createFirstAdmin(form);
      // App.jsx sends signed-in admins to the dashboard automatically
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const isSetup = hasAdmins === false;

  return (
    <div className="grid min-h-full lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <section className="relative hidden overflow-hidden bg-lagoon-900 px-14 py-12 text-white lg:flex lg:flex-col">
        <img
          src={hotelPhoto}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div aria-hidden="true" className="absolute inset-0 bg-lagoon-800/30 mix-blend-multiply" />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-b from-lagoon-550/60 via-transparent via-40% to-lagoon-750/92"
        />

        <span className="relative text-[1.35rem] font-semibold tracking-tight">Hotel admin</span>
        <div className="relative mt-auto max-w-sm">
          <p className="text-4xl leading-tight font-semibold tracking-tight">Every room, guest booking and revenue in one place.</p>
          <p className="mt-4 text-lagoon-100">For front-desk staff and hotel managers.</p>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <span className="mb-10 block text-xl font-semibold tracking-tight text-lagoon-900 lg:hidden">Hotel admin</span>

          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            {isSetup ? 'Create the first admin' : 'Log in'}
          </h1>
          <p className="mt-2 text-slate-500">
            {isSetup
              ? 'No admin accounts exist yet. This account can add other admins later.'
              : 'Use the email and password for your admin account.'}
          </p>

          {hasAdmins === null && !error && <p className="mt-8 text-slate-400">Loading…</p>}

          {hasAdmins === null && error && (
            <div className="mt-8">
              <FormError message={error} />
              <Button variant="ghost" className="mt-3" onClick={checkStatus}>
                Try again
              </Button>
            </div>
          )}

          {hasAdmins !== null && (
            <form onSubmit={submit} className="mt-8 space-y-4">
              {isSetup && (
                <TextInput id="login-name" label="Full name" value={form.name} onChange={update('name')} required autoComplete="name" />
              )}
              <TextInput
                id="login-email"
                label="Email"
                type="email"
                value={form.email}
                onChange={update('email')}
                required
                autoComplete="email"
              />
              <TextInput
                id="login-password"
                label="Password"
                type="password"
                value={form.password}
                onChange={update('password')}
                required
                minLength={isSetup ? 8 : undefined}
                autoComplete={isSetup ? 'new-password' : 'current-password'}
                hint={isSetup ? 'At least 8 characters' : undefined}
              />
              <FormError message={error} />
              <Button type="submit" loading={submitting} className="mt-2 w-full py-3">
                {isSetup ? 'Create admin and log in' : 'Log in'}
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AccountScreen({ userId, userName, onLogin, onLogout }) {
  const [email, setEmail] = useState('');
  const [savedCount, setSavedCount] = useState(null);

  useEffect(() => {
    if (!userId) {
      setEmail('');
      setSavedCount(null);
      return;
    }

    const loadAccount = async () => {
      const [{ data: authData }, { count, error }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from('private_recipes').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      ]);
      setEmail(authData.user?.email || '');
      if (!error) setSavedCount(count || 0);
    };
    loadAccount();
  }, [userId]);

  if (!userId) {
    return (
      <main className="p-4 w-full max-w-md mx-auto pb-24">
        <section className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <h2 className="text-lg font-medium text-olive">Your account</h2>
          <p className="text-sm text-gray-600 mt-2 mb-5">Sign in to save recipes and keep them available across devices.</p>
          <button onClick={onLogin} className="w-full py-2.5 rounded-full bg-olive text-white text-sm font-medium">Sign in</button>
        </section>
      </main>
    );
  }

  return (
    <main className="p-4 w-full max-w-md mx-auto pb-24">
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-xs uppercase tracking-wide text-gray-400">Signed in as</p>
        <h2 className="text-lg font-medium text-olive mt-1">{userName || 'Chef BonBon user'}</h2>
        {email && <p className="text-sm text-gray-600 mt-1">{email}</p>}
        <div className="mt-5 p-4 rounded-lg bg-warm">
          <p className="text-xs text-gray-500">Saved recipes</p>
          <p className="text-2xl font-medium text-olive mt-1">{savedCount === null ? '—' : savedCount}</p>
        </div>
        <button onClick={onLogout} className="w-full mt-5 py-2.5 rounded-full border border-rust text-rust text-sm font-medium">Sign out</button>
      </section>
    </main>
  );
}

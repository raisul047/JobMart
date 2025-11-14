"use client"

import React, { useEffect, useState } from 'react';
import { useProtectedRoute } from '@/lib/useProtectedRoute';

type Profile = {
  id: string;
  name: string;
  email: string;
  skills?: string[];
  desiredJobRoles?: string[];
  desiredLocations?: string[];
};

function csvToArray(s: string | undefined) {
  if (!s) return [];
  return s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function ProfilePage() {
  const { isLoading, isAuthed } = useProtectedRoute();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [skillsText, setSkillsText] = useState('');
  const [rolesText, setRolesText] = useState('');
  const [locationsText, setLocationsText] = useState('');

  useEffect(() => {
    if (isAuthed) fetchProfile();
  }, [isAuthed]);

  async function fetchProfile() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/user');
      if (res.status === 401) {
        setError('You must be signed in to edit your profile.');
        setLoading(false);
        return;
      }
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to load profile');
      setProfile(json.data);
      setSkillsText((json.data.skills || []).join(', '));
      setRolesText((json.data.desiredJobRoles || []).join(', '));
      setLocationsText((json.data.desiredLocations || []).join(', '));
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const body = {
        skills: csvToArray(skillsText),
        desiredJobRoles: csvToArray(rolesText),
        desiredLocations: csvToArray(locationsText),
      };
      const res = await fetch('/api/user', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.status === 401) {
        setError('Unauthorized. Please sign in.');
        setLoading(false);
        return;
      }
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to save');
      setProfile(json.data);
      setError(null);
      alert('Profile updated');
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  if (isLoading || (loading && !profile)) return <div className="p-6">Loading...</div>;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <form onSubmit={onSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input value={profile?.name || ''} disabled className="mt-1 block w-full rounded px-3 py-2 bg-slate-800 text-white" />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input value={profile?.email || ''} disabled className="mt-1 block w-full rounded px-3 py-2 bg-slate-800 text-white" />
        </div>

        <div>
          <label className="block text-sm font-medium">Skills (comma separated)</label>
          <input value={skillsText} onChange={(e) => setSkillsText(e.target.value)} placeholder="e.g. React, TypeScript, Node.js" className="mt-1 block w-full rounded px-3 py-2 bg-slate-900 text-white" />
        </div>

        <div>
          <label className="block text-sm font-medium">Desired Roles (comma separated)</label>
          <input value={rolesText} onChange={(e) => setRolesText(e.target.value)} placeholder="e.g. Frontend Developer, UI Engineer" className="mt-1 block w-full rounded px-3 py-2 bg-slate-900 text-white" />
        </div>

        <div>
          <label className="block text-sm font-medium">Desired Locations (comma separated)</label>
          <input value={locationsText} onChange={(e) => setLocationsText(e.target.value)} placeholder="e.g. Remote, Dhaka" className="mt-1 block w-full rounded px-3 py-2 bg-slate-900 text-white" />
        </div>

        {error && <div className="text-sm text-red-400">{error}</div>}

        <div className="flex items-center gap-2">
          <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-sky-600 text-white">Save</button>
          <button type="button" onClick={fetchProfile} className="px-3 py-2 rounded bg-gray-700 text-white">Reload</button>
        </div>
      </form>
    </main>
  );
}

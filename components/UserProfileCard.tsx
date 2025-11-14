'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface UserProfile {
  name: string;
  email: string;
  skills: string[];
  profileImageUrl?: string;
}

export default function UserProfileCard() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const result = await res.json();
          setProfile(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [session]);

  if (loading) {
    return <div className="rounded-lg border bg-muted/5 p-4">Loading...</div>;
  }

  const user = profile || session?.user;
  if (!user) {
    return <div className="rounded-lg border bg-muted/5 p-4">No profile data</div>;
  }

  const initials = user.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('') || 'U';

  return (
    <section aria-labelledby="profile-heading" className="rounded-lg border bg-muted/5 p-4">
      <h2 id="profile-heading" className="text-lg font-semibold">Your profile</h2>
      <div className="mt-3 flex items-start gap-4">
        <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-white font-semibold">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-slate-400">{user.email}</div>
          <div className="mt-2 text-sm">
            <strong className="mr-1">Skills:</strong>
            {user.skills?.length ? (
              <span className="text-sm text-slate-300">{user.skills.join(', ')}</span>
            ) : (
              <span className="text-sm text-slate-400">No skills listed</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

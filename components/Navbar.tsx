'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isSignedIn = status === 'authenticated';

  return (
    <header className="w-full border-b bg-muted/40">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={isSignedIn ? '/dashboard' : '/'} className="text-lg font-semibold">JobMart</Link>
          {isSignedIn && (
            <nav className="hidden sm:flex gap-2">
              <Link href="/dashboard" className="px-3 py-1 rounded hover:bg-slate-100/5">Dashboard</Link>
              <Link href="/jobs" className="px-3 py-1 rounded hover:bg-slate-100/5">Jobs</Link>
              <Link href="/resources" className="px-3 py-1 rounded hover:bg-slate-100/5">Resources</Link>
              <Link href="/profile" className="px-3 py-1 rounded hover:bg-slate-100/5">Profile</Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              <span className="text-sm text-slate-400 hidden sm:inline">{session?.user?.email}</span>
              <button
                onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/" className="px-3 py-1 rounded bg-gray-800 text-white">Sign In</Link>
          )}
        </div>
      </div>
    </header>
  );
}

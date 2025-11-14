'use client'

import { useProtectedRoute } from '@/lib/useProtectedRoute';
import React from 'react';

export function ProtectedPageWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthed } = useProtectedRoute();

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;
  if (!isAuthed) return <div className="p-6 text-center">Please sign in to view this page.</div>;

  return <>{children}</>;
}

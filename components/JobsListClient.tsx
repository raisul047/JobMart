"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useProtectedRoute } from "@/lib/useProtectedRoute";

type Job = {
  _id: string;
  title: string;
  company: string;
  location: string;
  requiredSkills: string[];
  experienceLevel: string;
  type: string;
  description?: string;
};

const TYPES = ["Internship", "Full-time", "Part-time", "Freelance"];

export function JobsListClient() {
  const { isLoading, isAuthed } = useProtectedRoute();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [trackFilter, setTrackFilter] = useState<string | null>(null);
  const [skillFilter, setSkillFilter] = useState<string>("");
  const [debouncedSkill, setDebouncedSkill] = useState<string>("");
  const [locations, setLocations] = useState<string[]>([]);
  const [tracks, setTracks] = useState<string[]>([]);

  // helper to build query string
  function buildQuery(skillToUse?: string) {
    const params = new URLSearchParams();
    if (typeFilter) params.set("type", typeFilter);
    if (locationFilter) params.set("location", locationFilter);
    if (trackFilter) params.set("track", trackFilter);
    const skill = typeof skillToUse === 'string' ? skillToUse : skillFilter.trim();
    if (skill) params.set("skill", skill);
    return params.toString();
  }

  async function fetchJobs(skillParam?: string) {
    setLoading(true);
    setError(null);
    try {
      const q = buildQuery(skillParam);
      const url = `/api/jobs${q ? `?${q}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to load jobs");
      setJobs(json.data || []);
      // update URL without reload
      const newUrl = `${window.location.pathname}${q ? `?${q}` : ""}`;
      window.history.replaceState({}, "", newUrl);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initialise filters from current URL
    try {
      const params = new URLSearchParams(window.location.search);
      const t = params.get("type");
      const l = params.get("location");
      const tr = params.get("track");
      const s = params.get("skill");
      if (t) setTypeFilter(t);
      if (l) setLocationFilter(l);
      if (tr) setTrackFilter(tr);
      if (s) setSkillFilter(s);
    } catch (e) {
      // ignore on server
    }
    // populate dropdown options (locations and tracks) from full list
    (async function populateOptions(){
      try{
        const r = await fetch('/api/jobs');
        if (!r.ok) return;
        const j = await r.json();
        const all = j.data || [];
        const locs = Array.from(new Set(all.map((x:any)=>x.location).filter(Boolean)));
        const trks = Array.from(new Set(all.map((x:any)=>x.track).filter(Boolean)));
        setLocations(locs);
        setTracks(trks);
      }catch(e){/**/}
    })();

    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // refetch when filters change
  useEffect(() => {
    // don't run immediately on mount since first effect will call fetch
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, locationFilter, trackFilter]);

  // Debounce skill input: update debouncedSkill after 500ms of inactivity
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSkill(skillFilter.trim());
    }, 500);
    return () => clearTimeout(id);
  }, [skillFilter]);

  // fetch when debounced skill changes
  useEffect(() => {
    fetchJobs(debouncedSkill);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSkill]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {isLoading && <div className="text-center">Loading...</div>}
      {!isAuthed && !isLoading && <div className="text-center">Please sign in to view jobs.</div>}
      {isAuthed && !isLoading && (
        <>
      <h1 className="text-2xl font-semibold mb-4">Jobs & Opportunities</h1>
      <div className="mb-4 flex gap-2 items-center flex-wrap">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter((prev) => (prev === t ? null : t))}
            className={`px-3 py-1 rounded border ${typeFilter === t ? 'bg-sky-500 text-white border-sky-500' : 'bg-transparent text-slate-200 border-white/10'}`}
          >
            {t}
          </button>
        ))}

        <button
          onClick={() => setLocationFilter((prev) => (prev === 'Remote' ? null : 'Remote'))}
          className={`px-3 py-1 rounded border ${locationFilter === 'Remote' ? 'bg-sky-500 text-white border-sky-500' : 'bg-transparent text-slate-200 border-white/10'}`}
        >
          Remote
        </button>

        <button
          onClick={() => { setTypeFilter(null); setLocationFilter(null); setSkillFilter(''); fetchJobs(); }}
          className="px-3 py-1 rounded bg-gray-700 text-white"
        >
          Clear
        </button>
      </div>

      <div className="mb-4 flex gap-2 items-center">
        <select value={locationFilter ?? ''} onChange={(e)=> setLocationFilter(e.target.value || null)} className="rounded px-3 py-2 bg-slate-900 text-white">
          <option value="">All locations</option>
          {locations.map((l)=> (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        <select value={trackFilter ?? ''} onChange={(e)=> setTrackFilter(e.target.value || null)} className="rounded px-3 py-2 bg-slate-900 text-white">
          <option value="">All tracks</option>
          {tracks.map((t)=> (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <input
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          placeholder="Filter by skill (debounced)"
          className="rounded px-3 py-2 bg-slate-900 text-white flex-1"
        />

        <button
          onClick={() => { setSkillFilter(''); setDebouncedSkill(''); fetchJobs(''); }}
          className="px-3 py-2 rounded bg-sky-500 text-white"
        >
          Clear Skill
        </button>
      </div>

      {loading && <p className="text-sm text-slate-400">Loading...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="space-y-3">
        {jobs.length === 0 && !loading && <p className="text-sm text-slate-400">No jobs found.</p>}

        {jobs.map((job) => (
          <article key={job._id} className="rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">{job.title}</h2>
                <p className="text-sm text-slate-500">{job.company} · {job.location}</p>
              </div>
              <div className="text-sm text-slate-500">{job.type}</div>
            </div>
            <p className="mt-2 text-sm text-slate-600">{job.description}</p>
            <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
              {job.requiredSkills?.map((s) => (
                <span key={s} className="px-2 py-1 bg-slate-100 rounded text-slate-700">{s}</span>
              ))}
            </div>
            <div className="mt-3">
              <Link href={`/jobs/${job._id}`} className="text-sky-500 text-sm">View details →</Link>
            </div>
          </article>
        ))}
      </div>
        </>
      )}
    </div>
  );
}

export default JobsListClient;

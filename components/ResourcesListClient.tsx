"use client"

import React, { useEffect, useState } from "react";
import { useProtectedRoute } from "@/lib/useProtectedRoute";

type Resource = {
  _id: string;
  title: string;
  platform: string;
  url: string;
  relatedSkills: string[];
  cost: string;
  description?: string;
  postedAt?: string;
};

const PLATFORMS = ["YouTube", "Coursera", "Udemy", "Frontend Masters", "Others"];
const COSTS = ["Free", "Paid"];

export function ResourcesListClient() {
  const { isLoading, isAuthed } = useProtectedRoute();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [platformFilter, setPlatformFilter] = useState<string | null>(null);
  const [costFilter, setCostFilter] = useState<string | null>(null);
  const [skillFilter, setSkillFilter] = useState<string>("");
  const [debouncedSkill, setDebouncedSkill] = useState("");

  const [platforms, setPlatforms] = useState<string[]>(PLATFORMS);

  function buildQuery(skillOverride?: string) {
    const params = new URLSearchParams();
    if (platformFilter) params.set("platform", platformFilter);
    if (costFilter) params.set("cost", costFilter);
    const skill = typeof skillOverride === "string" ? skillOverride : skillFilter.trim();
    if (skill) params.set("skill", skill);
    return params.toString();
  }

  async function fetchResources(skillParam?: string) {
    setLoading(true);
    setError(null);
    try {
      const q = buildQuery(skillParam);
      const url = `/api/resources${q ? `?${q}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to load resources");
      let data = json.data || [];
      // client-side cost filter (API doesn't filter cost currently)
      if (costFilter) data = data.filter((r: Resource) => r.cost === costFilter);
      setResources(data);
      // update URL
      const newUrl = `${window.location.pathname}${q ? `?${q}` : ""}`;
      window.history.replaceState({}, "", newUrl);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // init filters from URL
    try {
      const params = new URLSearchParams(window.location.search);
      const p = params.get("platform");
      const s = params.get("skill");
      if (p) setPlatformFilter(p);
      if (s) setSkillFilter(s);
    } catch (e) {}

    // populate available platforms from API
    (async function populate(){
      try{
        const r = await fetch('/api/resources');
        if (!r.ok) return;
        const j = await r.json();
        const all = j.data || [];
        const pl = Array.from(new Set(all.map((x:any)=>x.platform).filter(Boolean)));
        if (pl.length) setPlatforms(pl);
      }catch(e){/* ignore */}
    })();

    fetchResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchResources(debouncedSkill);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platformFilter, costFilter, debouncedSkill]);

  // debounce skill input
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSkill(skillFilter.trim()), 500);
    return () => clearTimeout(id);
  }, [skillFilter]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {isLoading && <div className="text-center">Loading...</div>}
      {!isAuthed && !isLoading && <div className="text-center">Please sign in to view resources.</div>}
      {isAuthed && !isLoading && (
        <>
      <h1 className="text-2xl font-semibold mb-4">Learning Resources</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => setPlatformFilter((prev) => (prev === p ? null : p))}
            className={`px-3 py-1 rounded border ${platformFilter === p ? 'bg-sky-500 text-white border-sky-500' : 'bg-transparent text-slate-200 border-white/10'}`}
          >
            {p}
          </button>
        ))}

        {COSTS.map((c) => (
          <button
            key={c}
            onClick={() => setCostFilter((prev) => (prev === c ? null : c))}
            className={`px-3 py-1 rounded border ${costFilter === c ? 'bg-sky-500 text-white border-sky-500' : 'bg-transparent text-slate-200 border-white/10'}`}
          >
            {c}
          </button>
        ))}

        <button onClick={() => { setPlatformFilter(null); setCostFilter(null); setSkillFilter(''); setDebouncedSkill(''); fetchResources(''); }} className="px-3 py-1 rounded bg-gray-700 text-white">Clear</button>
      </div>

      <div className="mb-4 flex gap-2">
        <input value={skillFilter} onChange={(e)=>setSkillFilter(e.target.value)} placeholder="Search by skill (debounced)" className="rounded px-3 py-2 bg-slate-900 text-white w-full" />
      </div>

      {loading && <p className="text-sm text-slate-400">Loading...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="space-y-3">
        {resources.length === 0 && !loading && <p className="text-sm text-slate-400">No resources found.</p>}
        {resources.map((r) => (
          <article key={r._id} className="rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">{r.title}</h2>
                <p className="text-sm text-slate-500">{r.platform} · {r.cost}</p>
              </div>
              <div className="text-sm text-slate-500">{r.postedAt ? new Date(r.postedAt).toLocaleDateString() : ''}</div>
            </div>
            <p className="mt-2 text-sm text-slate-600">{r.description}</p>
            <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
              {r.relatedSkills?.map((s)=> (
                <span key={s} className="px-2 py-1 bg-slate-100 rounded text-slate-700">{s}</span>
              ))}
            </div>
            <div className="mt-3">
              <a href={r.url} target="_blank" rel="noreferrer" className="text-sky-500 text-sm">Open resource →</a>
            </div>
          </article>
        ))}
      </div>
        </>
      )}
    </div>
  );
}

export default ResourcesListClient;

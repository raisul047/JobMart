import React from 'react';
import { getJobs } from '@/lib/jobs';
import { getResources } from '@/lib/resources';
import UserProfileCard from '@/components/UserProfileCard';
import { ProtectedPageWrapper } from '@/components/ProtectedPageWrapper';

// Scoring that considers skills, desired roles, and desired locations
function scoreJobForUser(user: any, job: any) {
  const userSkills = (user?.skills || []).map((s: string) => s.toLowerCase());
  const skillSet = new Set(userSkills);
  const jobSkills = (job?.requiredSkills || []).map((s: string) => s.toLowerCase());

  // skill score: 1 point per matching skill
  const skillScore = jobSkills.reduce((acc: number, cur: string) => acc + (skillSet.has(cur) ? 1 : 0), 0);

  // role score: check if any desired role appears in title/company/track
  const desiredRoles = (user?.desiredJobRoles || []).map((r: string) => r.toLowerCase());
  const searchable = `${job?.title || ''} ${job?.company || ''} ${job?.track || ''}`.toLowerCase();
  const roleMatch = desiredRoles.length && desiredRoles.some((r: string) => searchable.includes(r)) ? 1 : 0;

  // location score: exact match between job.location and any desired location
  const desiredLocations = (user?.desiredLocations || []).map((l: string) => l.toLowerCase());
  const jobLoc = (job?.location || '').toLowerCase();
  const locationMatch = desiredLocations.length && desiredLocations.includes(jobLoc) ? 1 : 0;

  // weights: give more importance to role matches, then location, then skills
  const score = skillScore + roleMatch * 2 + locationMatch * 1.5;
  return score;
}

// Scoring for resources: prefer resources that match skills and optionally mention desired roles
function scoreResourceForUser(user: any, resource: any) {
  const userSkills = (user?.skills || []).map((s: string) => s.toLowerCase());
  const skillSet = new Set(userSkills);
  const resSkills = (resource?.relatedSkills || []).map((s: string) => s.toLowerCase());

  // skill score: 1 point per matching related skill
  const skillScore = resSkills.reduce((acc: number, cur: string) => acc + (skillSet.has(cur) ? 1 : 0), 0);

  // role hint: if resource title/description contains desired role keywords
  const desiredRoles = (user?.desiredJobRoles || []).map((r: string) => r.toLowerCase());
  const searchable = `${resource?.title || ''} ${resource?.description || ''}`.toLowerCase();
  const roleMatch = desiredRoles.length && desiredRoles.some((r: string) => searchable.includes(r)) ? 1 : 0;

  return skillScore + roleMatch * 1.5;
}

export default async function DashboardPage() {
  // fetch a bunch of jobs & resources and score them locally for recommendations
  const [allJobs, allResources] = await Promise.all([getJobs(), getResources()]);

  // Try to fetch the user profile from the internal API (server-side)
  let user: any = null;
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/user`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      user = json.data;
    }
  } catch (err) {
    // ignore and fallback to demo user if needed
  }

  // Fallback to a simple demo user if no real user is available (server-side)
  if (!user) {
    user = {
      name: 'Aisha Rahman',
      email: 'aisha@example.com',
      skills: ['React', 'TypeScript', 'Node.js', 'HTML', 'CSS'],
      id: 'demo-user-1',
    };
  }

  const scoredJobs = (allJobs || [])
    .map((j: any) => ({ score: scoreJobForUser(user || {}, j), job: j }))
    .sort((a: any, b: any) => b.score - a.score || new Date(b.job.postedAt).getTime() - new Date(a.job.postedAt).getTime())
    .slice(0, 6);

  const scoredResources = (allResources || [])
    .map((r: any) => ({ score: scoreResourceForUser(user || {}, r), resource: r }))
    .sort((a: any, b: any) => b.score - a.score || new Date(b.resource.postedAt).getTime() - new Date(a.resource.postedAt).getTime())
    .slice(0, 6);

  return (
    <ProtectedPageWrapper>
      <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <UserProfileCard />
        </div>

        <div className="md:col-span-2 space-y-6">
          <section aria-labelledby="rec-jobs">
            <h2 id="rec-jobs" className="text-lg font-semibold">Recommended jobs</h2>
            <div className="mt-3 space-y-3">
              {scoredJobs.length === 0 && <div className="text-sm text-slate-400">No recommendations yet.</div>}
              {scoredJobs.map((s: any) => (
                <article key={s.job._id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{s.job.title}</div>
                      <div className="text-sm text-slate-400">{s.job.company} · {s.job.location}</div>
                    </div>
                    <div className="text-xs text-slate-500">Score: {s.score}</div>
                  </div>
                  <div className="mt-2 text-sm text-slate-600">{s.job.description?.slice(0, 160)}{s.job.description && s.job.description.length > 160 ? '…' : ''}</div>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="rec-resources">
            <h2 id="rec-resources" className="text-lg font-semibold">Recommended resources</h2>
            <div className="mt-3 space-y-3">
              {scoredResources.length === 0 && <div className="text-sm text-slate-400">No resources found.</div>}
              {scoredResources.map((s: any) => (
                <article key={s.resource._id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{s.resource.title}</div>
                      <div className="text-sm text-slate-400">{s.resource.platform} · {s.resource.cost}</div>
                    </div>
                    <div className="text-xs text-slate-500">Score: {s.score}</div>
                  </div>
                  <div className="mt-2 text-sm text-slate-600">{s.resource.description?.slice(0, 160)}{s.resource.description && s.resource.description.length > 160 ? '…' : ''}</div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
    </ProtectedPageWrapper>
  );
}

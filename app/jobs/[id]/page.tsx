import { getJobById } from '@/lib/jobs';
import Link from 'next/link';

export default async function JobDetails({ params }: { params: { id: string } }) {
  const job = await getJobById(params.id);
  if (!job) return <div className="p-8">Job not found.</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/jobs" className="text-slate-500 text-sm">← Back to jobs</Link>
      <h1 className="text-2xl font-semibold mt-3">{job.title}</h1>
      <p className="text-sm text-slate-500">{job.company} · {job.location} · {job.type}</p>
      <div className="mt-4 text-sm text-slate-700">{job.description}</div>

      <div className="mt-6">
        <h3 className="text-sm font-medium">Required skills</h3>
        <div className="mt-2 flex gap-2 flex-wrap">
          {job.requiredSkills?.map((s: string) => (
            <span key={s} className="px-2 py-1 bg-slate-100 rounded text-slate-700 text-xs">{s}</span>
          ))}
        </div>
      </div>

      <div className="mt-6 text-xs text-slate-500">Experience level: {job.experienceLevel}</div>
    </div>
  );
}

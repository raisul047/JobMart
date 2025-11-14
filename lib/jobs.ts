import { connect, mongoose } from './dbServer';
import { ObjectId } from 'mongodb';

const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  track: String,
  requiredSkills: [String],
  experienceLevel: String,
  type: String,
  description: String,
  postedAt: Date,
});

let JobModel: mongoose.Model<any>;
try {
  JobModel = mongoose.models?.Job || mongoose.model('Job', JobSchema);
} catch (e) {
  JobModel = mongoose.model('Job', JobSchema);
}

export async function getJobs(filters = {}) {
  await connect();
  // allow simple filters: type, location, experienceLevel, skill
  const query: any = {};
  if ((filters as any).type) query.type = (filters as any).type;
  if ((filters as any).location) query.location = (filters as any).location;
  if ((filters as any).track) query.track = (filters as any).track;
  if ((filters as any).experienceLevel) query.experienceLevel = (filters as any).experienceLevel;
  if ((filters as any).skill) query.requiredSkills = { $in: [(filters as any).skill] };

  const docs = await JobModel.find(query).sort({ postedAt: -1 }).lean();
  return docs;
}

export async function getJobById(id: string) {
  await connect();
  if (!id) return null;
  try {
    const doc = await JobModel.findById(id).lean();
    return doc;
  } catch (e) {
    return null;
  }
}

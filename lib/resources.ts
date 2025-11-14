import { connect, mongoose } from './dbServer';

const ResourceSchema = new mongoose.Schema({
  title: String,
  platform: String,
  url: String,
  relatedSkills: [String],
  cost: String,
  description: String,
  postedAt: Date,
});

let ResourceModel: mongoose.Model<any>;
try {
  ResourceModel = mongoose.models?.Resource || mongoose.model('Resource', ResourceSchema);
} catch (e) {
  ResourceModel = mongoose.model('Resource', ResourceSchema);
}

export async function getResources(filters = {}) {
  await connect();
  const query: any = {};
  if ((filters as any).platform) query.platform = (filters as any).platform;
  if ((filters as any).skill) query.relatedSkills = { $in: [(filters as any).skill] };

  const docs = await ResourceModel.find(query).sort({ postedAt: -1 }).lean();
  return docs;
}

export async function getResourceById(id: string) {
  await connect();
  if (!id) return null;
  try {
    const doc = await ResourceModel.findById(id).lean();
    return doc;
  } catch (e) {
    return null;
  }
}

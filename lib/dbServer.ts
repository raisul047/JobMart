import mongoose from 'mongoose';

type Cached = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

declare global {
  // eslint-disable-next-line no-var
  var __mongoose_cache: Cached | undefined;
}

const MONGODB_URI = (process.env.MONGODB_URI || '').toString();

function validateMongoUri(uri: string) {
  if (!uri) {
    throw new Error(
      'MONGODB_URI is not set. Create a `.env.local` with a valid MongoDB connection string (mongodb://... or mongodb+srv://...).'
    );
  }

  const lower = uri.toLowerCase();
  if (!lower.startsWith('mongodb://') && !lower.startsWith('mongodb+srv://')) {
    throw new Error(
      'Invalid MONGODB_URI scheme. Connection string must start with "mongodb://" or "mongodb+srv://".'
    );
  }
}

const cached: Cached = global.__mongoose_cache || { conn: null, promise: null };

if (!global.__mongoose_cache) global.__mongoose_cache = cached;

export async function connect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    // trim whitespace and validate early to give clearer errors instead of letting mongoose throw generic parse errors
    const uri = MONGODB_URI.trim();
    validateMongoUri(uri);

    try {
      cached.promise = mongoose.connect(uri, { dbName: 'jobmart' }).then((m) => m);
    } catch (err) {
      // rethrow with clearer message (preserve original)
      throw new Error(`Failed to connect to MongoDB: ${String(err)}`);
    }
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export async function disconnect() {
  if (!cached.conn) return;
  await mongoose.disconnect();
  cached.conn = null;
  cached.promise = null;
}

export { mongoose };

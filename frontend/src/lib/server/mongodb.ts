import { MongoClient, type Db } from "mongodb";

const globalForMongo = globalThis as typeof globalThis & {
  __aromaMongoClientPromise?: Promise<MongoClient>;
};

function getMongoConfig() {
  const uri = process.env.MONGODB_URL;
  const databaseName = process.env.DATABASE_NAME;

  if (!uri || !databaseName) {
    throw new Error("MONGODB_URL and DATABASE_NAME are required for database requests");
  }

  return { uri, databaseName };
}

async function getMongoClient() {
  const { uri } = getMongoConfig();

  if (!globalForMongo.__aromaMongoClientPromise) {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10_000,
    });
    globalForMongo.__aromaMongoClientPromise = client.connect();
  }

  return globalForMongo.__aromaMongoClientPromise;
}

/** Returns the configured MongoDB database without opening a connection at build time. */
export async function getMongoDatabase(): Promise<Db> {
  const [{ databaseName }, client] = await Promise.all([Promise.resolve(getMongoConfig()), getMongoClient()]);
  return client.db(databaseName);
}

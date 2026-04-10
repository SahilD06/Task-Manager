import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!uri) {
  console.warn('MongoDB Connection Failed: Please define the MONGODB_URI environment variable');
} else {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export async function getDb() {
  if (!clientPromise) {
    throw new Error('MongoDB connection skipped: MONGODB_URI is not defined in .env.local');
  }
  const connectedClient = await clientPromise;
  
  // Connect to the 'Assignment' database specifically
  return connectedClient.db('Assignment');
}

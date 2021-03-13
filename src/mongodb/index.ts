import { Collection, Db, MongoClient, ObjectId } from 'mongodb';

let client: MongoClient;

export const connect = async (): Promise<void> => {
	client = await MongoClient.connect(process.env.MONGO_URL as string, {
		poolSize: 5,
		useUnifiedTopology: true,
		loggerLevel: process.env.NODE_ENV === 'production' ? '' : 'debug',
	});
	console.log(`- mongodb connected...`);
};

export const disconnect = async () => client.close();

export const getClient = (): MongoClient => client;

export const getDb = (dbName: string): Db => {
	return client.db(dbName);
};

export const getCollection = (collectionName: string, dbName: string): Collection => {
	const db = getDb(dbName);
	return db.collection(collectionName);
};

export const getObjectIdFromDate = (date: Date): ObjectId => {
	const timestamp = date.getTime() / 1000;
	return ObjectId.createFromTime(timestamp);
};

export const getDateFromObjectId = (objectId: ObjectId): Date => {
	return objectId.getTimestamp();
};

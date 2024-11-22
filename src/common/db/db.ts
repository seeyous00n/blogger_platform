import { MongoClient } from 'mongodb';
import { SETTINGS } from '../settings';
import mongoose from 'mongoose';

const mongoURI = SETTINGS.MONGO_URI;
export const client = new MongoClient(mongoURI);

const mongoURIMongoose = SETTINGS.MONGO_URI + `/${SETTINGS.DB_NAME}`;

export const runDB = async () => {
  try {
    await client.connect();
    await client.db(SETTINGS.DB_NAME).command({ ping: 1 });
    console.log('Connected successfully to server..');

    await mongoose.connect(mongoURIMongoose);
    console.log('Mongoose connected successfully to server..');
  } catch (error) {
    console.error('console.error', error);
    await client.close();

    await mongoose.disconnect();
  }
};
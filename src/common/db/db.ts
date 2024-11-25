import { MongoClient } from 'mongodb';
import { SETTINGS } from '../settings';
import mongoose from 'mongoose';

const mongoURI = SETTINGS.MONGO_URI;
export const client = new MongoClient(mongoURI);

const mongoURIMongoose = SETTINGS.MONGO_URI + `/${SETTINGS.DB_NAME}`;

export const runDB = async () => {
  try {
    await mongoose.connect(mongoURIMongoose);
    console.log('Connected successfully to server..');
  } catch (error) {
    console.error('console.error', error);
    await mongoose.disconnect();
  }
};
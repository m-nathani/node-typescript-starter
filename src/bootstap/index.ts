import * as dotenv from 'dotenv';
import { databaseConnection } from './database-connection';
import { Connection } from 'typeorm';
let database: Connection;

export const bootstrap = async (): Promise<Boolean> => {
  try {
    // Load environment variables from .env file, where API keys and passwords are configured
    dotenv.config({ path: '.env' });
    // create connection with database
    database = await databaseConnection();
  } catch (err) {
    console.log('bootstrap error', err);
  }
  return true;
};

export const Database: Connection = database;
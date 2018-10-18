import * as ConnectionStringParser from 'pg-connection-string';
import { createConnection, Connection } from 'typeorm';
import { config } from '../config';

export const databaseConnection = (): Promise<Connection> => {
  // Get DB connection options from env variable
  const connectionOptions = ConnectionStringParser.parse(config.databaseUrl);
  return createConnection({
    type: process.env.DB_DIALECT as any,
    host: connectionOptions.host,
    port: connectionOptions.port,
    username: connectionOptions.user,
    password: connectionOptions.password,
    database: connectionOptions.database,
    synchronize: process.env.DB_FORCE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    entities: [
      'src/entity/**/*'
    ]
  });
};

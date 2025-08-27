import { DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB_NAME,
  entities: [path.resolve(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [path.resolve(__dirname, 'migrations/*.{ts,js}')],
});

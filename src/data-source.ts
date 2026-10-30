import { config } from 'dotenv';
import { DataSource } from 'typeorm';

// NODE_ENV=test reads .env.test (the watchlist_test database), otherwise .env
config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

// This is an ES module, so use import.meta instead of __filename/__dirname
const ext = import.meta.filename.endsWith('.ts') ? 'ts' : 'js';
const dir = import.meta.dirname;

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [`${dir}/**/*.entity.${ext}`],
  migrations: [`${dir}/migrations/*.${ext}`],
});

import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const password = process.env.DB_PASSWORD;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sortedBeans_local',
  password: '',
  port: 5432,
});

export default pool;

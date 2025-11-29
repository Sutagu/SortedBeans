import { Pool } from 'pg';
import * as dotenv from 'dotenv';

const envDirectory = '../';

dotenv.config({
  path: envDirectory + '.env',
});

const portStr = process.env.DB_PORT;
let portNumber;
if (portStr) portNumber = parseInt(portStr, 10);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: portNumber,
});

export default pool;

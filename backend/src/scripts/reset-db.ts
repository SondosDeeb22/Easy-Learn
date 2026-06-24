import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'pg';

// Manually parse .env file to configure DB Client
const envPath = path.join(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const parts = trimmed.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let value = parts.slice(1).join('=').trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  }
}

// -------------------------------------------------------

async function resetDb() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'database123',
    database: process.env.DB_DATABASE || 'easylearn',
  });

  try {
    await client.connect();
    console.log('Connected to database. Dropping and recreating public schema...');

    await client.query('DROP SCHEMA public CASCADE;');
    await client.query('CREATE SCHEMA public;');

    // Grant privileges
    const dbUser = process.env.DB_USERNAME || 'postgres';
    await client.query(`GRANT ALL ON SCHEMA public TO "${dbUser}";`);
    await client.query('GRANT ALL ON SCHEMA public TO public;');

    console.log('Database schema reset successfully.');
  } catch (error) {
    console.error('Failed to reset database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

resetDb();

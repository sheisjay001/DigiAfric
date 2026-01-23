import mysql from 'mysql2/promise';

type Pool = mysql.Pool;

let pool: Pool | null = null;

function getConfig() {
  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { minVersion: 'TLSv1.2' }
  };
}

export function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool(getConfig());
  }
  return pool;
}

export async function ensureUsersTable() {
  const p = getPool();
  await p.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}

export async function ensureSessionsTable() {
  const p = getPool();
  await p.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP NOT NULL,
      INDEX(user_id)
    )
  `);
}

export async function ensurePasswordResetsTable() {
  const p = getPool();
  await p.query(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      code VARCHAR(12) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP NOT NULL,
      used TINYINT(1) DEFAULT 0,
      INDEX(user_id),
      INDEX(code)
    )
  `);
}

export async function ensureProfilesTable() {
  const p = getPool();
  await p.query(`
    CREATE TABLE IF NOT EXISTS profiles (
      user_id VARCHAR(36) PRIMARY KEY,
      avatar_url VARCHAR(1024),
      bio TEXT,
      timezone VARCHAR(64),
      location VARCHAR(255),
      preferred_roles TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}

export async function ensureProgressTable() {
  const p = getPool();
  await p.query(`
    CREATE TABLE IF NOT EXISTS user_progress (
      user_id VARCHAR(36) NOT NULL,
      track_id VARCHAR(64) NOT NULL,
      task_id VARCHAR(64) NOT NULL,
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, track_id, task_id),
      INDEX(user_id)
    )
  `);
}

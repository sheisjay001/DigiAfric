import { getPool } from './db';

export async function ensureAuditTable() {
  const p = getPool();
  await p.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      action VARCHAR(64) NOT NULL,
      details TEXT,
      ip_address VARCHAR(45),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX(user_id),
      INDEX(action)
    )
  `);
}

export async function logAudit(userId: string, action: string, details: any, ip: string = '') {
  try {
    const p = getPool();
    await ensureAuditTable();
    await p.query(
      'INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
      [userId, action, JSON.stringify(details), ip]
    );
  } catch (e) {
    console.error('Audit log failed:', e);
  }
}

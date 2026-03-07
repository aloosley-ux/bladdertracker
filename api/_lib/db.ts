import { sql } from '@vercel/postgres';

export { sql };

export async function migrate(): Promise<string[]> {
  const log: string[] = [];

  await sql`
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('parent', 'caregiver', 'schoolAdmin')),
      avatar VARCHAR(512),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  log.push('accounts table ready');

  await sql`
    CREATE TABLE IF NOT EXISTS children (
      id TEXT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      date_of_birth VARCHAR(20) DEFAULT '',
      avatar VARCHAR(512),
      created_by TEXT REFERENCES accounts(id),
      last_updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  log.push('children table ready');

  await sql`
    CREATE TABLE IF NOT EXISTS child_access (
      id TEXT PRIMARY KEY,
      child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
      user_id TEXT REFERENCES accounts(id) ON DELETE CASCADE,
      access_type VARCHAR(20) NOT NULL CHECK (access_type IN ('parent', 'caregiver')),
      UNIQUE(child_id, user_id)
    )
  `;
  log.push('child_access table ready');

  await sql`
    CREATE TABLE IF NOT EXISTS drink_entries (
      id TEXT PRIMARY KEY,
      child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
      date VARCHAR(20) NOT NULL,
      time VARCHAR(10) NOT NULL,
      type VARCHAR(20) NOT NULL,
      amount_ml INTEGER NOT NULL,
      notes TEXT DEFAULT '',
      created_by TEXT REFERENCES accounts(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  log.push('drink_entries table ready');

  await sql`
    CREATE TABLE IF NOT EXISTS urine_entries (
      id TEXT PRIMARY KEY,
      child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
      date VARCHAR(20) NOT NULL,
      time VARCHAR(10) NOT NULL,
      wet BOOLEAN DEFAULT FALSE,
      pass BOOLEAN DEFAULT FALSE,
      notes TEXT DEFAULT '',
      created_by TEXT REFERENCES accounts(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  log.push('urine_entries table ready');

  await sql`
    CREATE TABLE IF NOT EXISTS bowel_entries (
      id TEXT PRIMARY KEY,
      child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
      date VARCHAR(20) NOT NULL,
      time VARCHAR(10) NOT NULL,
      location VARCHAR(20) NOT NULL,
      amount VARCHAR(5) NOT NULL,
      bristol_type SMALLINT NOT NULL,
      laxatives_given BOOLEAN DEFAULT FALSE,
      notes TEXT DEFAULT '',
      image_url VARCHAR(512),
      created_by TEXT REFERENCES accounts(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  log.push('bowel_entries table ready');

  await sql`
    CREATE TABLE IF NOT EXISTS invites (
      id TEXT PRIMARY KEY,
      child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
      child_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
      invited_by TEXT REFERENCES accounts(id),
      token VARCHAR(64) UNIQUE NOT NULL,
      link TEXT NOT NULL,
      accepted_by TEXT REFERENCES accounts(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  log.push('invites table ready');

  await sql`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES accounts(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  log.push('notifications table ready');

  await sql`
    CREATE TABLE IF NOT EXISTS audit_events (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES accounts(id) ON DELETE CASCADE,
      action VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      detail TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  log.push('audit_events table ready');

  return log;
}

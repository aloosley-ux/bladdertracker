import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

export const sql = neon(connectionString!, { fullResults: true });

export async function getAccessibleChildIds(userId: string): Promise<string[]> {
  const result = await sql`
    SELECT DISTINCT c.id FROM children c
    LEFT JOIN child_access ca ON ca.child_id = c.id
    WHERE c.created_by = ${userId} OR ca.user_id = ${userId}
  `;
  return result.rows.map((r) => r.id);
}

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
      volume_ml INTEGER,
      urgency SMALLINT CHECK (urgency IS NULL OR (urgency >= 1 AND urgency <= 5)),
      leakage_amount VARCHAR(10) CHECK (leakage_amount IS NULL OR leakage_amount IN ('none', 'small', 'medium', 'large')),
      notes TEXT DEFAULT '',
      created_by TEXT REFERENCES accounts(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  log.push('urine_entries table ready');

  // Add new columns to existing urine_entries tables (safe if already present)
  await sql`ALTER TABLE urine_entries ADD COLUMN IF NOT EXISTS volume_ml INTEGER`;
  await sql`ALTER TABLE urine_entries ADD COLUMN IF NOT EXISTS urgency SMALLINT CHECK (urgency IS NULL OR (urgency >= 1 AND urgency <= 5))`;
  await sql`ALTER TABLE urine_entries ADD COLUMN IF NOT EXISTS leakage_amount VARCHAR(10) CHECK (leakage_amount IS NULL OR leakage_amount IN ('none', 'small', 'medium', 'large'))`;
  log.push('urine_entries columns up to date');

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

  await sql`
    CREATE TABLE IF NOT EXISTS sleep_entries (
      id TEXT PRIMARY KEY,
      child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
      date VARCHAR(20) NOT NULL,
      time VARCHAR(10) NOT NULL,
      event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('onset', 'wake', 'nap_start', 'nap_end')),
      duration_minutes INTEGER,
      quality SMALLINT CHECK (quality IS NULL OR (quality >= 1 AND quality <= 5)),
      nighttime_event BOOLEAN DEFAULT FALSE,
      notes TEXT DEFAULT '',
      created_by TEXT REFERENCES accounts(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  log.push('sleep_entries table ready');

  await sql`
    CREATE TABLE IF NOT EXISTS toilet_attempt_entries (
      id TEXT PRIMARY KEY,
      child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
      date VARCHAR(20) NOT NULL,
      time VARCHAR(10) NOT NULL,
      outcome VARCHAR(20) NOT NULL CHECK (outcome IN ('success', 'failure', 'no_event')),
      supervised BOOLEAN DEFAULT FALSE,
      prompted BOOLEAN DEFAULT FALSE,
      duration_minutes INTEGER,
      notes TEXT DEFAULT '',
      created_by TEXT REFERENCES accounts(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  log.push('toilet_attempt_entries table ready');

  await sql`
    CREATE TABLE IF NOT EXISTS food_entries (
      id TEXT PRIMARY KEY,
      child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
      date VARCHAR(20) NOT NULL,
      time VARCHAR(10) NOT NULL,
      meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
      description TEXT NOT NULL DEFAULT '',
      portions NUMERIC(5,2),
      notes TEXT DEFAULT '',
      created_by TEXT REFERENCES accounts(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  log.push('food_entries table ready');

  // Mood entries
  await sql`
    CREATE TABLE IF NOT EXISTS mood_entries (
      id TEXT PRIMARY KEY,
      child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
      date VARCHAR(20) NOT NULL,
      time VARCHAR(10) NOT NULL,
      level SMALLINT NOT NULL CHECK (level >= 1 AND level <= 5),
      triggers TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      created_by TEXT REFERENCES accounts(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  log.push('mood_entries table ready');

  // Sensory entries
  await sql`
    CREATE TABLE IF NOT EXISTS sensory_entries (
      id TEXT PRIMARY KEY,
      child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
      date VARCHAR(20) NOT NULL,
      time VARCHAR(10) NOT NULL,
      sensory_type VARCHAR(50) NOT NULL,
      response VARCHAR(20) NOT NULL CHECK (response IN ('seeking', 'avoiding', 'neutral')),
      intensity SMALLINT NOT NULL CHECK (intensity >= 1 AND intensity <= 5),
      notes TEXT DEFAULT '',
      created_by TEXT REFERENCES accounts(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  log.push('sensory_entries table ready');

  // Medication entries
  await sql`
    CREATE TABLE IF NOT EXISTS medication_entries (
      id TEXT PRIMARY KEY,
      child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
      date VARCHAR(20) NOT NULL,
      time VARCHAR(10) NOT NULL,
      name VARCHAR(255) NOT NULL,
      dosage VARCHAR(100) DEFAULT '',
      administered BOOLEAN DEFAULT TRUE,
      notes TEXT DEFAULT '',
      created_by TEXT REFERENCES accounts(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  log.push('medication_entries table ready');

  // Therapy entries
  await sql`
    CREATE TABLE IF NOT EXISTS therapy_entries (
      id TEXT PRIMARY KEY,
      child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
      date VARCHAR(20) NOT NULL,
      time VARCHAR(10) NOT NULL,
      therapy_type VARCHAR(30) NOT NULL CHECK (therapy_type IN ('speech', 'occupational', 'physical', 'behavioral', 'other')),
      provider VARCHAR(255) DEFAULT '',
      duration_minutes INTEGER NOT NULL,
      goals TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      created_by TEXT REFERENCES accounts(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  log.push('therapy_entries table ready');

  // Routine entries
  await sql`
    CREATE TABLE IF NOT EXISTS routine_entries (
      id TEXT PRIMARY KEY,
      child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
      date VARCHAR(20) NOT NULL,
      time VARCHAR(10) NOT NULL,
      routine_name VARCHAR(255) NOT NULL,
      completed BOOLEAN DEFAULT TRUE,
      duration_minutes INTEGER,
      notes TEXT DEFAULT '',
      created_by TEXT REFERENCES accounts(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  log.push('routine_entries table ready');

  // Milestones
  await sql`
    CREATE TABLE IF NOT EXISTS milestones (
      id TEXT PRIMARY KEY,
      child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      description TEXT DEFAULT '',
      category VARCHAR(30) NOT NULL CHECK (category IN ('speech', 'motor', 'social', 'cognitive', 'self_care', 'routine', 'sensory', 'other')),
      status VARCHAR(20) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'achieved')),
      date_achieved VARCHAR(20),
      notes TEXT DEFAULT '',
      created_by TEXT REFERENCES accounts(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  log.push('milestones table ready');

  // Enabled modules per child
  await sql`
    CREATE TABLE IF NOT EXISTS enabled_modules (
      id TEXT PRIMARY KEY,
      child_id TEXT REFERENCES children(id) ON DELETE CASCADE,
      module_id VARCHAR(50) NOT NULL,
      UNIQUE(child_id, module_id)
    )
  `;
  log.push('enabled_modules table ready');

  // Update accounts role constraint to include new roles
  await sql`ALTER TABLE accounts DROP CONSTRAINT IF EXISTS accounts_role_check`;
  await sql`ALTER TABLE accounts ADD CONSTRAINT accounts_role_check CHECK (role IN ('admin', 'parent', 'caregiver', 'schoolAdmin', 'therapist', 'specialist'))`;
  log.push('accounts role constraint updated');

  return log;
}

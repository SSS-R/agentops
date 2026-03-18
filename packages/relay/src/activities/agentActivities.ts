/**
 * Temporal Activities: Agent Management
 */

import Database from 'better-sqlite3';

// Initialize database connection
const db = new Database('./relay.db');

/**
 * Mark an agent as offline in the database
 */
export async function markAgentOffline(agentId: string): Promise<void> {
  const stmt = db.prepare(`
    UPDATE agents 
    SET status = 'offline'
    WHERE id = ?
  `);

  const result = stmt.run(agentId);

  if (result.changes === 0) {
    throw new Error(`Agent ${agentId} not found`);
  }

  console.log(`Agent ${agentId} marked offline (no heartbeat within 90s)`);
}

/**
 * Register agent in the database
 */
export async function registerAgent(
  agentId: string,
  name: string,
  capabilities: string[]
): Promise<void> {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO agents (id, name, capabilities, status, last_heartbeat)
    VALUES (?, ?, ?, 'online', CURRENT_TIMESTAMP)
  `);

  stmt.run(agentId, name, JSON.stringify(capabilities));

  console.log(`Agent ${agentId} (${name}) registered with capabilities:`, capabilities);
}

/**
 * Update agent heartbeat timestamp
 */
export async function updateHeartbeat(agentId: string): Promise<void> {
  const stmt = db.prepare(`
    UPDATE agents 
    SET last_heartbeat = CURRENT_TIMESTAMP, status = 'online'
    WHERE id = ?
  `);

  const result = stmt.run(agentId);

  if (result.changes === 0) {
    throw new Error(`Agent ${agentId} not found`);
  }
}

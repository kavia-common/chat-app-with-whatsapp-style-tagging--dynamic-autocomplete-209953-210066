'use strict';

const { Pool } = require('pg');
const config = require('../config');

/**
 * Creates a PostgreSQL connection pool using environment variables.
 * Uses either a single connection string (POSTGRES_URL) or discrete params.
 */
function createPool() {
  if (config.db.connectionString) {
    return new Pool({
      connectionString: config.db.connectionString,
      ssl: config.db.ssl,
      max: 10,
    });
  }
  return new Pool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    ssl: config.db.ssl,
    max: 10,
  });
}

const pool = createPool();

pool.on('error', (err) => {
  // Log unexpected errors so the process doesn't crash silently.
  console.error('Unexpected PostgreSQL client error', err);
});

/**
 * Lightweight query wrapper.
 * @param {string} text SQL text
 * @param {Array<any>} params Parameters
 * @returns {Promise<import('pg').QueryResult>}
 */
async function query(text, params = []) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    return res;
  } finally {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      // Minimal query log for development observability
      // console.log('executed query', { text, duration, rows: res?.rowCount });
    }
  }
}

module.exports = { pool, query };

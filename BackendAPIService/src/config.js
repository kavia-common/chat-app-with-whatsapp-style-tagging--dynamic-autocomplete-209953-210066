'use strict';

/**
 * Centralized configuration loader for the Backend API Service.
 * Reads environment variables with sensible defaults for local development.
 * Do not hardcode secrets; ensure .env provides required values in deployment.
 */
require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || '0.0.0.0',
  port: parseInt(process.env.PORT || '3001', 10),
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  // Database configuration – expects variables provided by the orchestrator.
  db: {
    connectionString: process.env.POSTGRES_URL || '',
    host: process.env.POSTGRES_HOST || '',
    port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : undefined,
    user: process.env.POSTGRES_USER || '',
    password: process.env.POSTGRES_PASSWORD || '',
    database: process.env.POSTGRES_DB || '',
    ssl: /^(true|1)$/i.test(process.env.POSTGRES_SSL || 'false') ? { rejectUnauthorized: false } : undefined,
  },
};

module.exports = config;

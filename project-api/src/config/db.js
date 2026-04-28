const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Set default schema
pool.on('connect', (client) => {
  const schema = process.env.DB_SCHEMA || 'public';
  client.query(`SET search_path TO ${schema}`);
});

module.exports = pool;

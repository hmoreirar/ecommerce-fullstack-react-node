const { Pool } = require('pg');
require('dotenv').config();

// En produccion (Render, Neon, Railway, etc.) se usa DATABASE_URL con SSL.
// En desarrollo local se usan las variables DB_USER, DB_HOST, etc.
function buildConfig() {
  if (process.env.DATABASE_URL) {
    const isLocal = /@localhost|@127\.0\.0\.1/.test(process.env.DATABASE_URL);

    return {
      connectionString: process.env.DATABASE_URL,
      ssl: isLocal ? undefined : { rejectUnauthorized: false },
    };
  }

  return {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  };
}

const pool = new Pool(buildConfig());

module.exports = pool;

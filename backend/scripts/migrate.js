// Aplica migrations.sql (idempotente) y, opcionalmente, seed.sql.
// Uso:
//   npm run migrate        -> solo esquema
//   npm run seed           -> esquema + datos de demostracion
const fs = require('fs');
const path = require('path');
const pool = require('../db');

async function runFile(file) {
  const sql = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  await pool.query(sql);
  console.log(`Aplicado: ${file}`);
}

async function main() {
  try {
    await runFile('migrations.sql');

    if (process.argv.includes('--seed')) {
      await runFile('seed.sql');
    }

    console.log('Migraciones completadas');
  } catch (err) {
    console.error('Error al aplicar migraciones:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();

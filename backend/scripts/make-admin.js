// Otorga rol admin a un usuario existente.
// Uso: npm run make-admin -- usuario@ejemplo.com
const pool = require('../db');

async function main() {
  const email = (process.argv[2] || '').trim().toLowerCase();

  if (!email) {
    console.error('Uso: npm run make-admin -- usuario@ejemplo.com');
    process.exitCode = 1;
    return;
  }

  try {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE email = $2 RETURNING id, email, role',
      ['admin', email]
    );

    if (result.rows.length === 0) {
      console.error(`Usuario no encontrado: ${email}. Registralo primero desde la aplicacion.`);
      process.exitCode = 1;
      return;
    }

    console.log(`Rol admin otorgado a ${result.rows[0].email} (id ${result.rows[0].id})`);
  } catch (err) {
    console.error('Error al actualizar el rol:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();

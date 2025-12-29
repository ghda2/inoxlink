const { Pool } = require('pg');
require('dotenv').config();

async function listSchemas() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const client = await pool.connect();
    console.log('Conectado.');
    
    const res = await client.query('SELECT schema_name FROM information_schema.schemata;');
    console.log('Schemas encontrados:', res.rows.map(r => r.schema_name));
    
    client.release();
  } catch (err) {
    console.error('Erro:', err.message);
  } finally {
    await pool.end();
  }
}

listSchemas();
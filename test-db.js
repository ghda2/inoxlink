const { Pool } = require('pg');
require('dotenv').config();

async function testConnection() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const client = await pool.connect();
    console.log('Conectado ao banco de dados Neon com sucesso!');

    // Query simples para testar
    const res = await client.query('SELECT 1 as test');
    console.log('Query de teste executada:', res.rows[0]);

    client.release();
  } catch (err) {
    console.error('Erro ao conectar ao banco:', err.message);
  } finally {
    await pool.end();
  }
}

testConnection();
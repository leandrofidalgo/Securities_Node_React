const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));

// Criação da conexão com o banco de dados PostgreSQL
const pool = new Pool({
  user: 'leandrofidalgo',
  host: 'postgres',
  database: 'mydatabase',
  password: 'leo1234',
  port: 5432,
});

// Função para consultar a tabela de securities
async function getSecurities() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT id, symbol, security_name, sector, country, trend FROM securities;');
    return result.rows;
  } finally {
    client.release();
  }
}

// Função para consultar os detalhes de um security específico
async function getSecurityDetail(securityId) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT s.id, s.symbol, s.security_name, s.sector, s.country, s.trend, 
             ts.date, ts.close_price, ts.volume
      FROM securities s
      LEFT JOIN time_series ts ON s.id = ts.security_id
      WHERE s.id = $1;
    `, [securityId]);

    return result.rows;
  } finally {
    client.release();
  }
}

// Rota para obter todos os securities
app.get('/securities', async (req, res) => {
  try {
    const rows = await getSecurities();
    const securities = rows.map(row => ({
      id: row.id,
      symbol: row.symbol,
      securityName: row.security_name,
      sector: row.sector,
      country: row.country,
      trend: row.trend,
    }));
    res.json(securities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para obter os detalhes de um security específico
app.get('/securities/:securityId', async (req, res) => {
  const securityId = parseInt(req.params.securityId, 10);
  try {
    const rows = await getSecurityDetail(securityId);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Security not found' });
    }

    const security = {
      id: rows[0].id,
      symbol: rows[0].symbol,
      securityName: rows[0].security_name,
      sector: rows[0].sector,
      country: rows[0].country,
      trend: rows[0].trend,
      prices: rows.filter(row => row.date).map(row => ({
        date: row.date,
        close_price: row.close_price,
        volume: row.volume,
      })),
    };

    res.json(security);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inicializa o servidor na porta 5000
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
import express, { Request, Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';

// Criação do servidor Express
const app = express();

// Habilitar CORS
app.use(cors({ origin: 'http://localhost:3000' }));

// Tipo para os dados de segurança
interface Security {
  id: number;
  symbol: string;
  securityName: string;
  sector: string;
  country: string;
  trend: string;
}

// Tipo para o detalhe de preços de segurança
interface SecurityPrice {
  date: string;
  close_price: number;
  volume: number;
}

// Tipo para o detalhe completo de um security
interface SecurityDetail extends Security {
  prices: SecurityPrice[];
}

// Conexão com o banco de dados PostgreSQL
const pool = new Pool({
  user: 'leandrofidalgo',
  host: 'postgres',
  database: 'mydatabase',
  password: 'leo1234',
  port: 5432,
});

// Função para consultar todos os securities
async function getSecurities(): Promise<Security[]> {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT id, symbol, security_name, sector, country, trend FROM securities;');
    return result.rows.map(row => ({
      id: row.id,
      symbol: row.symbol,
      securityName: row.security_name,
      sector: row.sector,
      country: row.country,
      trend: row.trend,
    }));
  } finally {
    client.release();
  }
}

// Função para consultar detalhes de um security específico
async function getSecurityDetail(securityId: number): Promise<SecurityDetail[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT s.id, s.symbol, s.security_name, s.sector, s.country, s.trend, 
             ts.date, ts.close_price, ts.volume
      FROM securities s
      LEFT JOIN time_series ts ON s.id = ts.security_id
      WHERE s.id = $1;
    `, [securityId]);

    return result.rows.map(row => ({
      id: row.id,
      symbol: row.symbol,
      securityName: row.security_name,
      sector: row.sector,
      country: row.country,
      trend: row.trend,
      prices: result.rows.filter((r: any) => r.date).map((r: any) => ({
        date: r.date,
        close_price: r.close_price,
        volume: r.volume,
      })),
    }));
  } finally {
    client.release();
  }
}

// Rota para obter todos os securities
app.get('/securities', async (req: Request, res: Response): Promise<void> => {
  try {
    const securities = await getSecurities();
    res.json(securities);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para obter os detalhes de um security específico
app.get('/securities/:securityId', async (req: Request, res: Response): Promise<void> => {
  const securityId = parseInt(req.params.securityId, 10);
  try {
    const rows = await getSecurityDetail(securityId);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Security not found' });
    }

    const security = rows[0];
    res.json(security);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Inicializa o servidor na porta 5000
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

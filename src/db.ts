import mysql, { Pool } from 'mysql2/promise';

let pool: Pool | null = null;
let isConnected = false;

export function getDbConfig() {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'puskesmas_pondokbenda',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 3000,
  };
}

export async function initDbConnection() {
  const config = getDbConfig();
  try {
    pool = mysql.createPool(config);
    // Test connection
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    isConnected = true;
    console.log(`[Database] Terhubung ke MySQL Database (${config.host}:${config.port}/${config.database})`);
    return true;
  } catch (err: any) {
    isConnected = false;
    pool = null;
    console.log(`[Database] Mode In-Memory aktif. (MySQL tidak terhubung: ${err.message || 'Koneksi gagal'}). Aplikasi tetap berjalan normal.`);
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected && pool !== null;
}

export function getDbPool(): Pool | null {
  return pool;
}

export async function queryDb<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (!pool || !isConnected) {
    throw new Error('Database not connected');
  }
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}

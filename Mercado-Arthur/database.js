// database.js
import { Client } from 'pg';
import 'dotenv/config';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

export const loginUser = async (username, password) => {
  try {
    await client.connect();
    const res = await client.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );
    await client.end();
    return res.rows.length > 0;
  } catch (error) {
    console.error('Erro ao conectar no banco de dados', error);
    return false;
  }
};

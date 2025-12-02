import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// CONEXIÓN A POSTGRESQL (sin SSL)
const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: false  // 👈 CORREGIDO (no usar SSL porque tu server no lo soporta)
});

// ENDPOINT
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tienda.productos");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error consulta:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Backend running on port ${port}`);
});
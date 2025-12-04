import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

/* -------------------------------
    POOL 1 → BASE DE DATOS PRODUCTS
--------------------------------*/
const productsPool = new Pool({
  host: process.env.PGHOST_PRODUCTS,
  port: process.env.PGPORT_PRODUCTS,
  user: process.env.PGUSER_PRODUCTS,
  password: process.env.PGPASSWORD_PRODUCTS,
  database: process.env.PGDATABASE_PRODUCTS,
  ssl: false,
});

/* -------------------------------
    POOL 2 → BASE DE DATOS USERS
--------------------------------*/
const usersPool = new Pool({
  host: process.env.PGHOST_USERS,
  port: process.env.PGPORT_USERS,
  user: process.env.PGUSER_USERS,
  password: process.env.PGPASSWORD_USERS,
  database: process.env.PGDATABASE_USERS,
  ssl: false,
});

/* ==========================
   GET PRODUCTS
==========================*/
app.get("/api/products", async (req, res) => {
  try {
    const result = await productsPool.query("SELECT * FROM tienda.productos");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error consulta productos:", err);
    res.status(500).json({ error: "Database error" });
  }
});

/* ==========================
   SIGNUP USER
==========================*/
app.post("/api/auth/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const checkUser = await usersPool.query(
      "SELECT * FROM tienda.users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({
        error: "Email or username already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await usersPool.query(
      `INSERT INTO tienda.users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, username, email`,
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error signup:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ==========================
   LOGIN USER
==========================*/
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await usersPool.query(
      "SELECT * FROM tienda.users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const user = userResult.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Error login:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Backend running on port ${port}`);
});
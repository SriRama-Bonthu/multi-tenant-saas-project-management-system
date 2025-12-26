require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
const pool = require('./db');

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({
      status: 'ok',
      database: 'connected'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected'
    });
  }
});
module.exports = app;

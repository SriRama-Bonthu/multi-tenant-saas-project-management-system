require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://multi-tenant-saas-project-management.vercel.app',
    'https://multi-tenant-saas-project-management-system-apgmi5wa9.vercel.app'
  ],
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

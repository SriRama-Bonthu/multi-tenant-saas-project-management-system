require('dotenv').config();

const app = require('./app');
const pool = require('./db');
const runMigrations = require('./utils/runMigrations');
const runSeeds = require('./utils/runSeeds');

const authRoutes = require('./routes/auth.routes');
const tenantUserRoutes = require('./routes/tenantUser.routes');
const userRoutes = require('./routes/user.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');


/* ---------- HEALTH CHECK ---------- */
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

/* ---------- ROUTES ---------- */
app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantUserRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', taskRoutes);
app.get('/', (req, res) => {
  res.send('Multi-tenant SaaS Backend is running 🚀');
});

/* ---------- START SERVER ---------- */
async function startServer() {
  try {
    await pool.query('SELECT 1');
    console.log('Database reachable');

    await runMigrations();
    await runSeeds();

    const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

  } catch (error) {
    console.error('Startup failed:', error);
    process.exit(1);
  }
}

startServer();

import { useEffect, useState } from 'react';
import api from '../api/api';
import Layout from '../components/Layout';
import '../styles/dashboard.css'

function Dashboard() {
  const [user, setUser] = useState(null);
  const [projectsCount, setProjectsCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get logged-in user
    api.get('/auth/me')
      .then(res => {
        setUser(res.data.data);
      })
      .catch(() => {
        localStorage.removeItem('token');
        window.location.href = '/';
      });

    // Get projects and task stats
    api.get('/projects')
      .then(async res => {
        const projects = res.data.data.projects || res.data.data;
        setProjectsCount(projects.length);

        let totalTasks = 0;
        let completed = 0;

        const taskRequests = projects.map(project =>
          api.get(`/projects/${project.id}/tasks`)
        );

        const results = await Promise.all(taskRequests);

        results.forEach(r => {
          const tasks = r.data.data;
          totalTasks += tasks.length;
          completed += tasks.filter(t => t.status === 'completed').length;
        });

        setTasksCount(totalTasks);
        setCompletedTasks(completed);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <p>Loading dashboard...</p>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <h2 style={{ marginBottom: 16 }}>Dashboard</h2>

      {/* USER INFO */}
      <div style={{ marginBottom: 24 }}>
        <p><b>Name:</b> {user.fullName}</p>
        <p><b>Role:</b> {user.role}</p>
        <p><b>Tenant:</b> {user.tenant.name}</p>
      </div>

      {/* STATS */}
      <div className="dashboard-stats">
  <div className="stat-card blue">
    <p className="stat-label">Total Projects</p>
    <h3 className="stat-value">{projectsCount}</h3>
  </div>

  <div className="stat-card purple">
    <p className="stat-label">Total Tasks</p>
    <h3 className="stat-value">{tasksCount}</h3>
  </div>

  <div className="stat-card green">
    <p className="stat-label">Completed Tasks</p>
    <h3 className="stat-value">{completedTasks}</h3>
  </div>
</div>

    </Layout>
  );
}

export default Dashboard;

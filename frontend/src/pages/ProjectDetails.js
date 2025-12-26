import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api.js';
import '../styles/projectDetails.css';
import Layout from '../components/Layout.js';

function ProjectDetails() {
  const { projectId } = useParams();
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
  setLoading(true);
  setError('');

  api.get(`/projects/${projectId}/tasks`)
    .then(res => {
      setTasks(res.data.data);
      setLoading(false);
    })
    .catch(() => {
      setError('Failed to load tasks');
      setLoading(false);
    });
}, [projectId]);


  const createTask = async () => {
    if (!title) return;

    const res = await api.post(`/projects/${projectId}/tasks`, { title });
    setTasks([res.data.data, ...tasks]);
    setTitle('');
  };

  const updateStatus = async (taskId, status) => {
    const res = await api.patch(`/tasks/${taskId}/status`, { status });

    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: res.data.data.status } : task
    ));
  };

  if (loading) {
  return (
    <Layout>
      <p>Loading tasks...</p>
    </Layout>
  );
}

if (error) {
  return (
    <Layout>
      <p style={{ color: 'red' }}>{error}</p>
    </Layout>
  );
}


  return (
    <div className="project-page">
      <div className="project-container">

        <h1 className="project-title">Project Tasks</h1>
        <p className="project-subtitle">
          Manage tasks and track progress
        </p>

        {/* ADD TASK */}
        <div className="add-task">
          <input
            placeholder="New task title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <button onClick={createTask}>Add</button>
        </div>

        {tasks.length === 0 && (
          <p className="empty">No tasks found</p>
        )}

        {/* TASK LIST */}
        <div className="tasks-grid">
  {tasks.map(task => (
    <div key={task.id} className="task-card">

      <div className="task-header">
        <h3>{task.title}</h3>
        <span className={`status ${task.status}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>

      <div className="task-actions">
        <button
          onClick={() => updateStatus(task.id, 'todo')}
          disabled={task.status === 'todo'}
        >
          Todo
        </button>

        <button
          onClick={() => updateStatus(task.id, 'in_progress')}
          disabled={task.status === 'in_progress'}
        >
          In Progress
        </button>

        <button
          onClick={() => updateStatus(task.id, 'completed')}
          disabled={task.status === 'completed'}
        >
          Completed
        </button>
      </div>

    </div>
  ))}
</div>


      </div>
    </div>
  );
}

export default ProjectDetails;

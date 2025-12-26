import { useEffect, useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import '../styles/projects.css';
import Layout from '../components/Layout';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
  setLoading(true);
  setError('');

  api.get('/projects')
    .then(res => {
      setProjects(res.data.data.projects || res.data.data);
      setLoading(false);
    })
    .catch(() => {
      setError('Failed to load projects');
      setLoading(false);
    });
}, []);


  if (loading) {
  return (
    <Layout>
      <p>Loading projects...</p>
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
    <Layout>
    <div className="projects-page">
      <div className="projects-container">

        <h1>My Projects</h1>
        <p className="projects-subtitle">
          Manage and track your organization projects
        </p>

        {projects.length === 0 && (
          <div className="projects-empty">No projects found</div>
        )}

        <div className="projects-grid">
  {projects.map(project => (
    <Link
      to={`/projects/${project.id}`}
      key={project.id}
      className="project-card"
    >
      <h3 className="project-name">{project.name}</h3>

      <p className={`project-status ${project.status}`}>
        {project.status}
      </p>
    </Link>
  ))}
</div>


      </div>
    </div>
    </Layout>
  );
}

export default Projects;

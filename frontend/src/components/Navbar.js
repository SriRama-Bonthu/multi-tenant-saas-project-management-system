import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!token) return null;

  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className="logo">SaaS<span>Flow</span></span>

        <Link to="/dashboard">Dashboard</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/users">Users</Link>
      </div>

      <div className="nav-right">
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;

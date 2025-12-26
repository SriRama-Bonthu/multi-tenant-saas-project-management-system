import { useEffect, useState } from 'react';
import api from '../api/api';
import '../styles/users.css';
import Layout from '../components/Layout';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
const [error, setError] = useState('');


 useEffect(() => {
  setLoading(true);
  setError('');

  api.get('/auth/me')
    .then(res => {
      const tenantId = res.data.data.tenant.id;

      return api.get(`/tenants/${tenantId}/users`);
    })
    .then(res => {
      setUsers(res.data.data.users || res.data.data);
      setLoading(false);
    })
    .catch(() => {
      setError('Failed to load users');
      setLoading(false);
    });
}, []);

if (loading) {
  return (
    <Layout>
      <p>Loading users...</p>
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
    <div className="users-page">
  <h2 className="page-title">Users</h2>

  <div className="users-table">
    <div className="users-header">
      <span>Name</span>
      <span>Email</span>
      <span>Role</span>
      <span>Status</span>
    </div>

    {users.map(user => (
      <div className="users-row" key={user.id}>
        <span>{user.fullName}</span>
        <span>{user.email}</span>
        <span className={`role ${user.role}`}>{user.role}</span>
        <span className={user.isActive ? 'active' : 'inactive'}>
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    ))}
  </div>
</div>
    </Layout>
  );
}

export default Users;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './UsersPage.css';

function UsersPage({ token }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, [token]);

  return (
    <div className="users-page">
      <h1>All Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`/chat/${user.username}`}>{user.username}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersPage;

import React from 'react';

const getEmailFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.email || '';
  } catch {
    return '';
  }
};

const Profile = () => {
  const token = localStorage.getItem('token');
  const email = token ? getEmailFromToken(token) : '';

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <h2>Profile</h2>
      <p><strong>Email:</strong> {email}</p>
      <h3>Change Password</h3>
      <form>
        <input type="password" placeholder="New Password" style={{ width: '100%', marginBottom: 12, padding: 8 }} disabled />
        <button type="submit" style={{ width: '100%', padding: 10, background: '#ccc', color: '#fff', border: 'none', borderRadius: 4 }} disabled>Change Password</button>
      </form>
    </div>
  );
};

export default Profile;

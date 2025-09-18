import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => (
  <nav style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#d7263d' }}>PassionArt</div>
    <div>
      <NavLink to="/" style={{ margin: '0 1rem' }}>Home</NavLink>
      <NavLink to="/exhibitions" style={{ margin: '0 1rem' }}>Exhibitions</NavLink>
      <NavLink to="/events" style={{ margin: '0 1rem' }}>Events</NavLink>
      <NavLink to="/learn" style={{ margin: '0 1rem' }}>Learn</NavLink>
      <NavLink to="/store" style={{ margin: '0 1rem' }}>Store</NavLink>
    </div>
  </nav>
);

export default Navbar;


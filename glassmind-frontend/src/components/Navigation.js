import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav style={{ padding: "1rem", backgroundColor: "#eee" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>Dashboard</Link>
      <Link to="/profiles" style={{ marginRight: "1rem" }}>Profiles</Link>
      <Link to="/hud" style={{ marginRight: "1rem" }}>HUD Overlay</Link>
      <Link to="/ws">WebSocket Demo</Link>
    </nav>
  );
};

export default Navigation;
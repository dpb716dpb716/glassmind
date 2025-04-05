import React from 'react';
import { Link } from 'react-router-dom';
import Profiles from '../components/Profiles';
import WebSocketDemo from '../components/WebSocketDemo';

// Header component for the title
const Header = ({ title }) => (
  <header className="dashboard-header">
    <h1>{title}</h1>
  </header>
);

// Navigation bar component for primary links
const Navbar = () => (
  <nav className="navbar">
    <ul className="navbar-menu">
      <li className="navbar-item"><Link to="/">Dashboard</Link></li>
      <li className="navbar-item"><Link to="/people">People</Link></li>
      <li className="navbar-item"><Link to="#">Analytics</Link></li>
      <li className="navbar-item"><Link to="#">Settings</Link></li>
      <li className="navbar-item"><Link to="#">Profile</Link></li>
      <li className="navbar-item"><Link to="#">Logout</Link></li>
    </ul>
  </nav>
);

// Sidebar component for filtering and module selection
const Sidebar = ({ children }) => (
  <aside className="dashboard-sidebar">
    <div className="sidebar-content">
      {children}
      {/* Additional filter widgets can go here */}
    </div>
  </aside>
);

// Filter panel with sample controls (dropdowns, checkboxes, etc.)
const FilterPanel = () => (
  <div className="filter-panel">
    <h2>Filters</h2>
    <div>
      <label>Time Range:</label>
      <select>
        <option>Last 15 minutes</option>
        <option>Last 30 minutes</option>
        <option>Last Hour</option>
      </select>
    </div>
    <div>
      <label>Data Type:</label>
      <select>
        <option>All</option>
        <option>Social Signals</option>
        <option>Intoxication</option>
        <option>Openness</option>
      </select>
    </div>
  </div>
);

// GraphDisplay component for various charts and data feeds
const GraphDisplay = ({ title }) => (
  <section className="graph-display">
    <h2>{title}</h2>
    <div className="chart-placeholder">
      <p>Chart goes here</p>
    </div>
  </section>
);

// InteractiveMap component for spatial data visualization
const InteractiveMap = ({ title }) => (
  <section className="interactive-map">
    <h2>{title}</h2>
    <div className="map-placeholder">
      <p>Interactive map goes here</p>
    </div>
  </section>
);

// LegacyDashboard component that displays your current code for testing
const LegacyDashboard = () => (
  <section className="legacy-dashboard">
    <h2>Legacy Dashboard (For Testing)</h2>
    <div className="legacy-content">
      <h1>GlassMindz Dashboard</h1>
      <p>Welcome to the dashboard! Live updates will appear below:</p>
      <WebSocketDemo />
      <Profiles />
    </div>
  </section>
);

// Main Dashboard component that ties everything together
const Dashboard = () => (
  <div className="dashboard">
    <Header title="GlassMindz War Room Dashboard" />
    <Navbar />
    <div className="dashboard-body">
      <Sidebar>
        <FilterPanel />
      </Sidebar>
      <main className="dashboard-main">
        <div className="data-visualizations">
          <GraphDisplay title="Live Data Feed" />
          <GraphDisplay title="Analytics Overview" />
        </div>
        <InteractiveMap title="Venue Heatmap" />
        {/* Reserved area for testing your current (legacy) code */}
        <LegacyDashboard />
      </main>
    </div>
  </div>
);

export default Dashboard;
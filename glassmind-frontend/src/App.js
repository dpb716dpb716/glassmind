import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PeoplePage from './pages/PeoplePage';

const App = () => (
  <Router>
    <div className="app-container">
      {/* You can also include a global navigation here if desired */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/people" element={<PeoplePage />} />
      </Routes>
    </div>
  </Router>
);

export default App;
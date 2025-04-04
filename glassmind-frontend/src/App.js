import React from "react";
import Profiles from "./components/Profiles";
import WebSocketDemo from './components/WebSocketDemo';

const App = () => {
  return (
    <div className="App">
      <h1>GlassMindz Dashboard</h1>
        <p>Welcome to the dashboard! Live updates will appear below:</p>
      <WebSocketDemo />
      <Profiles />
    </div>
  );
};
export default App;
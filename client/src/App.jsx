import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import VideoRecorder from "./pages/VideoRecorder";
import VideoPlayer from "./pages/VideoPlayer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/record" element={<VideoRecorder />} />
        <Route path="/player/:id" element={<VideoPlayer />} />
      </Routes>
    </Router>
  );
}

export default App;

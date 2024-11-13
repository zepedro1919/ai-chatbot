import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import MainExperience from './components/MainExperience';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/experience" element={<MainExperience />} />
      </Routes>
    </Router>
  );
}

export default App;
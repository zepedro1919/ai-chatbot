import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import MainExperience from './components/MainExperience';
import RenderPage from './components/renderPage';
import ContactSales from './components/contactSales';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/experience" element={<MainExperience />} />
        <Route path="/generate-render" element={<RenderPage />} />
        <Route path="/contact-sales" element={<ContactSales />} />
      </Routes>
    </Router>
  );
}

export default App;
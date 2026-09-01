import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Home from './pages/Home.jsx';
import Builder from './pages/Builder.jsx';
import Templates from './pages/Templates.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsOfService from './pages/TermsOfService.jsx';

function NotFound() {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center',
      }}
    >
      <div>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>
          Sorry, the page you are looking for does not exist.
        </p>
        <a href="/resume-builder/">
          Back to Resume Builder
        </a>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename="/resume-builder">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="builder" element={<Builder />} />
          <Route path="templates" element={<Templates />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-of-service" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer component.
 */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-text">
          © {new Date().getFullYear()} ResumeBuilder. All rights reserved.
        </p>

        <div className="footer-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </footer>
  );
}
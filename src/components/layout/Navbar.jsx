import React from 'react';
import { Link, NavLink } from 'react-router-dom';

/**
 * Top navigation bar.
 */
export default function Navbar() {
  const navLinkClass = ({ isActive }) =>
    `nav-link ${isActive ? 'nav-link-active' : ''}`;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <img
            src="/resumebuilder-logo.png"
            alt="ResumeBuilder"
            className="navbar-logo"
          />
        </Link>

        <div className="navbar-links">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/builder" className={navLinkClass}>
            Builder
          </NavLink>
          <NavLink to="/templates" className={navLinkClass}>
            Templates
          </NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
        </div>

        <div className="navbar-actions">
          <Link to="/builder" className="btn btn-primary btn-sm">
            Build Resume
          </Link>
        </div>
      </div>
    </nav>
  );
}

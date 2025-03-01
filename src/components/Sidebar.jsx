import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Home from '../img/Home.png';
import courses from '../img/courses.png';
import User from '../img/User.png';
import pie from '../img/pie-chart 1.png';
import Calendar from '../img/Calendar.png';
import plus from '../img/plus 1.png';
import Help from '../img/Help-circle.png';
import settings from '../img/Settings.png';
import profile from '../img/Profil.png';

const Sidebar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const [user, setUser] = useState(null);
  const [selected, setSelected] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  // Navigation items
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', key: 'dashboard' },
    { path: '/courses', icon: courses, label: 'Courses', key: 'courses' },
    { path: '/attendances', icon: User, label: 'Attendances', key: 'attendances' },
    { path: '/report', icon: pie, label: 'Report', key: 'report' },
    { path: '/calendar', icon: Calendar, label: 'Calendar', key: 'calendar' },
    { path: '/add-admission', icon: plus, label: 'Add Admission', key: 'add-admission' },
    { path: '/settings', icon: settings, label: 'Settings', key: 'settings' },
    { path: '/help', icon: Help, label: 'Help', key: 'help' },
  ];

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(handleLogout, 5 * 60 * 1000);
  }, []);

  const handleActivity = useCallback(() => resetTimeout(), [resetTimeout]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsAuthenticated(false);
      navigate('/login');
    } else {
      setIsAuthenticated(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo) {
        setUser(userInfo);
      } else {
        navigate('/login');
        setUser({ name: 'Guest', email: 'guest@example.com' });
      }
    }

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    resetTimeout();

    return () => {
      clearTimeout(timeoutRef.current);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [setIsAuthenticated, navigate, handleActivity, resetTimeout]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const toggleSidebar = () => setIsOpen(prev => !prev);

  return (
    <div className="d-flex">
      <div
        className={`d-flex flex-column justify-content-center align-items-center gap-5 p-3 sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        style={{
          width: isOpen ? '250px' : '100px',
          height: '100vh',
          transition: 'width 0.3s ease'
        }}
      >
        {/* Profile Image */}
        {isOpen && user && (
        <img
          src={profile}
          alt="Profile"
          style={{
            width: isOpen ? 'auto' : '30px',
            opacity: isOpen ? 1 : 0.6,
            transition: 'all 0.3s ease',
            marginBottom: '20px'
          }}
        />
      )}

        {/* Navigation Links */}
        <ul className="nav nav-pills flex-column mb-auto">
          {navItems.map((item) => (
            <li className="nav-item" key={item.key}>
              <Link
                to={item.path}
                className={`nav-link ${selected === item.key ? 'selected-component' : ''}`}
                onClick={() => setSelected(item.key)}
              >
                <img src={item.icon} alt={item.label} style={{ width: '25px', marginRight: isOpen ? '12px' : '0' }} />
                {isOpen && item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="btn button-color m-3 w-100"
          aria-label={isOpen ? 'Close Sidebar' : 'Open Sidebar'}
        >
          {isOpen ? '<' : '>'}
        </button>

        {/* Conditional User Info & Logout */}
        {isOpen && user && (
          <div className="text-center mt-auto" style={{ borderTop: '1px solid #ccc' }}>
            <div className="user-info">
              <p className="mb-1"><strong>{user.name}</strong></p>
              <p className="mb-1">{user.email}</p>
            </div>
            <button onClick={handleLogout} className="btn bg-danger w-100 mt-3 text-white">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const [user, setUser] = useState(null);
  const [selected, setSelected] = useState(''); // State to track the selected item

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
        console.log('User info retrieved:', userInfo); // Debugging
      } else {
        console.error('User info not found in localStorage');
        // Option 1: Redirect to login
        navigate('/login');
        // Option 2: Set default user info
        setUser({ name: 'Guest', email: 'guest@example.com' });
      }
    }

    const resetTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(handleLogout, 5 * 60 * 1000); // 5 minutes
    };

    const handleActivity = () => {
      resetTimeout();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    resetTimeout();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [setIsAuthenticated, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove the token from localStorage
    localStorage.removeItem('userInfo'); // Remove user info from localStorage
    setIsAuthenticated(false); // Update authentication state
    navigate('/login'); // Redirect to login page after logout
  };

  const handleSelect = (item) => {
    setSelected(item);
  };

  return (
    <div className="d-flex flex-column p-3 sidebar" style={{ width: '250px', height: '100vh' }}>
      <h3 className="sidebar-title">PresentSir</h3>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link 
            to="/dashboard" 
            className={`nav-link ${selected === 'dashboard' ? 'selected-component' : ''}`} 
            onClick={() => handleSelect('dashboard')}
          >
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/courses" 
            className={`nav-link ${selected === 'courses' ? 'selected-component' : ''}`} 
            onClick={() => handleSelect('courses')}
          >
            Courses
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/attendances" 
            className={`nav-link ${selected === 'attendances' ? 'selected-component' : ''}`} 
            onClick={() => handleSelect('attendances')}
          >
            Attendances
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/report" 
            className={`nav-link ${selected === 'report' ? 'selected-component' : ''}`} 
            onClick={() => handleSelect('report')}
          >
            Report
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/calendar" 
            className={`nav-link ${selected === 'calendar' ? 'selected-component' : ''}`} 
            onClick={() => handleSelect('calendar')}
          >
            Calendar
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/add-admission" 
            className={`nav-link ${selected === 'add-admission' ? 'selected-component' : ''}`} 
            onClick={() => handleSelect('add-admission')}
          >
            Add Admission
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/settings" 
            className={`nav-link ${selected === 'settings' ? 'selected-component' : ''}`} 
            onClick={() => handleSelect('settings')}
          >
            Settings
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/help" 
            className={`nav-link ${selected === 'help' ? 'selected-component' : ''}`} 
            onClick={() => handleSelect('help')}
          >
            Help
          </Link>
        </li>
      </ul>
      {user && (
        <div className="text-center mt-3" style={{ borderTop: '1px solid #ccc' }}>
          <div className="user-info">
            <p className="mb-1"><strong>{user.name}</strong></p>
            <p className="mb-1">{user.email}</p>
          </div>
        </div>
      )}
      <button onClick={handleLogout} className="btn bg-danger w-100 mt-auto text-white">Logout</button>
    </div>
  );
};

export default Sidebar;
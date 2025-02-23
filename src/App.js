import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Settings from './components/Settings';
import Courses from './components/Courses';
import Attendances from './components/Attendances';
import Report from './components/Report';
import Calendar from './components/Calendar';
import AddAdmission from './components/AddAdmission';
import Login from './components/Login';
import Register from './components/Register';
import Startingpage from './components/Startingpage';
import Dashboard from './components/Dashboard';
import Help from './components/Help';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <ThemeProvider>
      <Router basename={process.env.PUBLIC_URL}>
        <div className="app">
          {isAuthenticated && <Sidebar setIsAuthenticated={setIsAuthenticated} />}
          <div className={`main-content ${isAuthenticated ? 'with-sidebar' : ''}`}>
            <Routes>
              <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Startingpage />} />
              <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
              <Route path="/courses" element={isAuthenticated ? <Courses /> : <Navigate to="/login" />} />
              <Route path="/attendances" element={isAuthenticated ? <Attendances /> : <Navigate to="/login" />} />
              <Route path="/report/:studentId?" element={isAuthenticated ? <Report /> : <Navigate to="/login" />} />
              <Route path="/calendar" element={isAuthenticated ? <Calendar /> : <Navigate to="/login" />} />
              <Route path="/add-admission" element={isAuthenticated ? <AddAdmission /> : <Navigate to="/login" />} />
              <Route path="/help" element={<Help />} />
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
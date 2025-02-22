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
import './App.css';
import Dashboard from './components/Dashboard';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Sidebar setIsAuthenticated={setIsAuthenticated} />}
        <div className="main-content">
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Startingpage />} />
            <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
            <Route path="/courses" element={isAuthenticated ? <Courses /> : <Navigate to="/login" />} />
            <Route path="/attendances" element={isAuthenticated ? <Attendances /> : <Navigate to="/login" />} />
            <Route path="/report" element={isAuthenticated ? <Report /> : <Navigate to="/login" />} />
            <Route path="/calendar" element={isAuthenticated ? <Calendar /> : <Navigate to="/login" />} />
            <Route path="/add-admission" element={isAuthenticated ? <AddAdmission /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard></Dashboard>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
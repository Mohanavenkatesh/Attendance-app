import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = ({ setIsAuthenticated }) => {
    const navigate = useNavigate(); // useNavigate hook to programmatically navigate

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Remove the token from localStorage
        setIsAuthenticated(false); // Update authentication state
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <div className="d-flex flex-column p-3 bg-light" style={{ width: '250px', height: '100vh' }}>
            <h3 className="sidebar-title">PresentSire</h3>
            <ul className="nav nav-pills flex-column mb-auto">

            <li className="nav-item">
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                </li>

                <li className="nav-item">
                    <Link to="/courses" className="nav-link">Courses</Link>
                </li>
                <li className="nav-item">
                    <Link to="/attendances" className="nav-link">Attendances</Link>
                </li>
                <li className="nav-item">
                    <Link to="/report" className="nav-link">Report</Link>
                </li>
                <li className="nav-item">
                    <Link to="/calendar" className="nav-link">Calendar</Link>
                </li>
                <li className="nav-item">
                    <Link to="/add-admission" className="nav-link">Add Admission</Link>
                </li>

                <li className="nav-item">
                    <Link to="/settings" className="nav-link">Settings</Link>
                </li>
                <li className="nav-item">
                    <Link to="/settings" className="nav-link">Help</Link>
                </li>
                <li className="nav-item">
                    <button onClick={handleLogout} className="btn btn-link nav-link">Logout</button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
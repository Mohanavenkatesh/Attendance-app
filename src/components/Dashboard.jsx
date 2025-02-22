import React from 'react';
import Sidebar from './Sidebar';  // Import Sidebar component

const Dashboard = () => {
    return (
        <div className="dashboard">
            <div className="dashboard-container d-flex">

                
                <div className="main-content flex-grow-1 p-4">
                    <h1>Welcome to the Dashboard</h1>
                    {/* Your other components/content go here */}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

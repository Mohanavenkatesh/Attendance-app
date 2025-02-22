import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

export const Startingpage = () => {
  return (
    <div className="container-fluid bg-light vh-100 d-flex flex-column">
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white px-4 shadow-sm">
        <a className="navbar-brand fw-bold" href="#">PRESENTSIR</a>
        <div>
          <Link to='/Login'><button className="btn btn-outline-dark me-2">Login</button></Link>
          <Link to='/Register'><button className="btn btn-primary">Register</button></Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container d-flex flex-grow-1 align-items-center justify-content-center">
        <div className="row w-100">
          {/* Left Section */}
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <h1 className="fw-bold">
              <span className="text-primary">Presentsir:</span> Smart Attendance for Hassle-Free Mentoring.
            </h1>
            <Link to='/Register'><button className="btn btn-primary mt-3 w-50">Register Now</button></Link>
          </div>

          {/* Right Section */}
          <div className="col-md-6 text-center">
            <img
              src="https://via.placeholder.com/400"
              alt="Illustration"
              className="img-fluid"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Startingpage;
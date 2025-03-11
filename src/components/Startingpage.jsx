import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import  amico  from '../img/amico.png';

export const Startingpage = () => {
  return (
    <div className="container-fluid  vh-100 d-flex flex-column">
      {/* Navbar */}
      <nav className="navbar  px-4">
       <p>PresentSir</p>
        <div>
          <Link to='/Login'><button className="btn btn-light border  me-2">Login</button></Link>
          <Link to='/Register'><button className="btn button-color">Register</button></Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container d-flex flex-grow-1 align-items-center justify-content-center">
        <div className="row w-100">
          {/* Left Section */}
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <h1 className="fw-bold">
              <span className="text-color pb-3">Presentsir:</span> <br /> Smart Attendance for Hassle-Free Mentoring.
            </h1>
            <Link to='/Register'><button className="btn button-color mt-3 w-50">Register Now</button></Link>
          </div>

          {/* Right Section */}
          <div className="col-md-6 text-center">
            <img
              src={amico}
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
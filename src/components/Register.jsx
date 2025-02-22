// Register.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from './Model'; // Import Modal component

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    instituteName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [modal, setModal] = useState({ show: false, message: '' }); // Modal state

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, instituteName, email, mobileNumber, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setModal({ show: true, message: "Passwords don't match!" });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
        name,
        instituteName,
        email,
        mobileNumber,
        password,
      });

      // Clear the form fields upon successful registration
      setFormData({
        name: '',
        instituteName: '',
        email: '',
        mobileNumber: '',
        password: '',
        confirmPassword: '',
      });

      setModal({ show: true, message: response.data.msg });

    } catch (error) {
      console.error(error);
      
      if (error.response && error.response.status === 400) {
        setModal({ show: true, message: 'Email or Mobile Number already registered!' });
      } else {
        setModal({ show: true, message: 'An error occurred while registering.' });
      }
    }
  };

  const closeModal = () => {
    setModal({ show: false, message: '' });
  };

  return (
    <div className="register-container d-flex flex-column align-items-center justify-content-center vh-100 position-relative">
      {/* Navbar */}
      <nav className="navbar navbar-light w-100 px-4 position-absolute top-0 start-0 d-flex justify-content-between">
        <a className="navbar-brand fw-bold" href="#">PRESENTSIR</a>
        <div>
          <Link to='/Login'><button className="btn btn-outline-dark me-2">Login</button></Link>
          <Link to='/Register'><button className="btn btn-primary">Register</button></Link>
        </div>
      </nav>

      <div className="register-card position-relative d-flex align-items-center justify-content-center" style={{ width: '90%', maxWidth: '600px' }}>
        <div className="hands-left position-absolute"></div>
        <div className="hands-right position-absolute"></div>
        <div className="card p-4 shadow bg-white text-center w-100">
          <h2 className="mb-3">Sign up to your account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Enter institute name"
                name="instituteName"
                value={formData.instituteName}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your mobile number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Confirm password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Register</button>
          </form>
        </div>
      </div>

      {/* Modal component */}
      <Modal show={modal.show} message={modal.message} onClose={closeModal} />
    </div>
  );
};

export default Register;

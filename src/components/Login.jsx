import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is installed

const Login = ({ setIsAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem('email');
        const savedPassword = localStorage.getItem('password');
        if (savedEmail && savedPassword) {
            setFormData({
                email: savedEmail,
                password: savedPassword,
                rememberMe: true
            });
        }

        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
            navigate('/dashboard'); // Redirect to dashboard if already authenticated
        }
    }, [setIsAuthenticated, navigate]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password, rememberMe } = formData;

        try {
            const response = await axios.post('http://localhost:5000/api/users/login', {
                email,
                password
            });

            // Assuming backend sends a token on successful login
            localStorage.setItem('authToken', response.data.token);  // Store auth token
            setIsAuthenticated(true); // Update authentication state

            if (rememberMe) {
                localStorage.setItem('email', email);
                localStorage.setItem('password', password);
            } else {
                localStorage.removeItem('email');
                localStorage.removeItem('password');
            }

            navigate('/dashboard');  // Redirect to the dashboard immediately
        } catch (err) {
            console.error(err);
            setError('Invalid email or password');
        }
    };

    return (
        <div className="login-container d-flex flex-column align-items-center vh-100">
            {/* Navbar */}
            <nav className="navbar navbar-light w-100 px-4">
                <a className=" fw-bold" href="#">PRESENTSIR</a>
                <div>
                    <Link to='/Login'><button className="btn btn-light me-2">Login</button></Link>
                    <Link to='/Register'><button className="btn btn-primary">Register</button></Link>
                </div>
            </nav>

            {/* Main Content */}
            <div className='d-flex align-items-center justify-content-center flex-grow-1'>
                <div className="login-card position-relative">
                    <div className="hands-left"></div>
                    <div className="hands-right"></div>
                    <div>
                        <div className="card p-4 shadow  text-center" style={{ width: '100%', maxWidth: '500px' }}>
                            <h2 className="mb-3">Sign in to your account</h2>

                            {/* Error Message */}
                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        name="email" 
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email address" 
                                        required 
                                        autoComplete="username"
                                    />
                                </div>
                                <div className="mb-3">
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter password" 
                                        required 
                                        autoComplete="current-password"
                                    />
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <input 
                                            type="checkbox" 
                                            id="remember-me" 
                                            name="rememberMe"
                                            checked={formData.rememberMe}
                                            onChange={handleChange}
                                        /> 
                                        <label htmlFor="remember-me">Remember me</label>
                                    </div>
                                    <a href="#" className="text-primary">Forgot password?</a>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Sign In</button>
                            </form>

                            <hr />
                            <button className="btn btn-light w-100 border mt-2">
                                <img src="google-logo.png" alt="Google" className="me-2" style={{ width: '20px' }} />
                                Sign in with Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
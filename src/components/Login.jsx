
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from './Model'; // Import the Modal component
import Logo from '../img/logo.png'; // ILogo
import person1 from '../img/character-1.png'; // Person 1
import person2 from '../img/character-2.png'; // Person 2
import '../css/Login.css'; // Import the Login.css file
import Vector from '../img/Vector.png';


const Login = ({ setIsAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [error, setError] = useState('');
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const [modal, setModal] = useState({ show: false, message: '' });
    const [loading, setLoading] = useState(false); // Loading state

    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem('email');
        const savedPassword = localStorage.getItem('password');
        if (savedEmail && savedPassword) {
            setFormData({
                email: savedEmail,
                password: savedPassword,
                rememberMe: true,
            });
        }

        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
            navigate('/dashboard');
        }
    }, [setIsAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });

        setErrors({
            ...errors,
            [name]: '',
        });
    };

    const validateForm = () => {
        const { email, password } = formData;
        const newErrors = {};

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            newErrors.email = 'Please enter a valid email address!';
        }

        if (!password.trim()) {
            newErrors.password = 'Please enter a password!';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const { email, password, rememberMe } = formData;

        setLoading(true); // Start loading

        try {
            const response = await axios.post('http://localhost:5000/api/users/login', {
                email,
                password,
            });

            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('userInfo', JSON.stringify(response.data.user));
            setIsAuthenticated(true);

            if (rememberMe) {
                localStorage.setItem('email', email);
                localStorage.setItem('password', password);
            } else {
                localStorage.removeItem('email');
                localStorage.removeItem('password');
            }

            setModal({ show: true, message: 'Login successful!' });
            setTimeout(() => {
                setModal({ show: false, message: '' });
                navigate('/dashboard');
            }, 0.1000);
        } catch (err) {
            console.error(err);
            setError('Invalid email or password');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (

       

        <div className="login-container d-flex flex-column  vh-100">
            <nav className="navbar navbar-light w-100 px-4">
               <img src={Logo} alt="" />
                <div>
                    <Link to='/Login'><button className="btn btn-light  me-3"style={{
                        padding: '10px 34px 14px 34px'
                    }}>Login</button></Link>
                    <Link to='/Register'><button className="btn button-color" style={{
                        padding: '10px 34px 14px 34px'
                    }}>Register</button></Link>
                </div>
            </nav>
           

            <div className='d-flex align-items-center justify-content-center flex-grow-1 '>
                <div className='vector1'>
                <img src={Vector} alt="Vector" className="Vector" style={{ width: '80px', height: '60px' }} />
                </div>
                <div className='vector2'>
                <img src={Vector} alt="Vector" className="Vector" style={{ width: '80px', height: '60px' }} />
                </div>
                            <img src={person1} className='person1' alt="" />
                         
                <div className="login-card position-relative">
                    <div className="hands-left"></div>
                    <div className="hands-right"></div>
                    <div>
                        <div className="maincard shadow text-center" >
                            <h2 className="sign mb-5">Sign in to your account</h2>

                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="name mb-3">
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}p-3`}
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email address"
                                        required
                                        autoComplete="username"
                                    />
                                    {errors.email && (
                                        <div className="text-danger text-start mt-1" style={{ fontSize: '0.875rem' }}>
                                            {errors.email}
                                        </div>
                                    )}
                                </div>

                                <div className=" name mb-3">
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}p-3`}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter password"
                                        required
                                        autoComplete="current-password"
                                    />
                                    {errors.password && (
                                        <div className="text-danger text-start mt-1" style={{ fontSize: '0.875rem' }}>
                                            {errors.password}
                                        </div>
                                    )}
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-3 ">
                                    <div className='remember mt-4 d-flex gap-1' style={{}}>
                                        <input
                                            type="checkbox"
                                            id="remember-me"
                                            name="rememberMe"
                                            checked={formData.rememberMe}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="remember-me">Remember me</label>
                                    </div>
                                    <a href="#" className="forget text-primary mt-4">Forgot password?</a>
                                </div>

                                <button type="submit" className="sign-in btn button-color w-50 p-3 mt-4" disabled={loading}>
                                    {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Sign In'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <img src={person2} className='person2' alt="" />
            </div>


       
            <Modal show={modal.show} message={modal.message} />
        </div>

       
    );
};

export default Login;






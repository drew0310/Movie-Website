import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = new URLSearchParams();
    payload.append('grant_type', 'password');
    payload.append('username', formData.email);
    payload.append('password', formData.password);
    payload.append('scope', '');
    payload.append('client_id', 'string');
    payload.append('client_secret', 'string');

    try {
      const response = await axios.post(
        'https://cineflix-production.up.railway.app/logins/token',
        payload,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const { access_token } = response.data;

      // Save token to session cookie
      sessionStorage.setItem('cineflix_token', access_token);
      sessionStorage.setItem('cineflix_user_email', formData.email);

      setSuccessMessage('Login successful!');
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="login">
      <div className="login__overlay">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login__form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="login__input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="login__input"
          />
          {error && <p className="login__error">{error}</p>}
          {successMessage && <p className="login__success">{successMessage}</p>}
          <button type="submit" className="home__auth-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

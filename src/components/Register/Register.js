import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Username is required.';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = 'A valid email is required.';
    if (
      !password ||
      password.length < 8 ||
      !/\d/.test(password) ||
      !/[!@#$%^&*]/.test(password)
    ) {
      newErrors.password =
        'Password must be at least 8 characters long, include at least 1 digit, and 1 special character.';
    }
    if (password !== confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match.';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post(
          'https://cineflix-production.up.railway.app/users/createuser',
          formData
        );
        if (response.status === 201) {
          setSuccessMessage('Registration successful! Redirecting to home page...');
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (error) {
        if (error.response?.status === 422) {
          setErrors({
            general: 'Oops! An unexpected error occurred. Please try again later.',
          });
        }
      }
    }
  };

  return (
    <div className="register">
      <div className="register__overlay">
        <h2>Register New User</h2>
        <form onSubmit={handleSubmit} className="register__form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            className="register__input"
          />
          {errors.name && <p className="register__error">{errors.name}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="register__input"
          />
          {errors.email && <p className="register__error">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="register__input"
          />
          {errors.password && (
            <p className="register__error">{errors.password}</p>
          )}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="register__input"
          />
          {errors.confirmPassword && (
            <p className="register__error">{errors.confirmPassword}</p>
          )}

          {errors.general && (
            <p className="register__error">{errors.general}</p>
          )}
          {successMessage && (
            <p className="register__success">{successMessage}</p>
          )}

          <button type="submit" className="home__auth-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './RegistrationForm.css';
import Header from './Header';
import Footer from './Footer';
import PasswordChecklist from "react-password-checklist"; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import bgImage from './assets/2.png';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    section: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // clear error on change
  };

  const validate = () => {
    const newErrors = {};
    const rollNoPattern = /^[A-Za-z0-9]+$/;
    if (!rollNoPattern.test(formData.rollNo)) {
      newErrors.rollNo = 'Roll number must be a mixture of letters and numbers.';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.section.trim()) newErrors.section = 'Section is required.';
    if (!formData.address.trim()) newErrors.address = 'Address is required.';
    if (!formData.password) newErrors.password = 'Password is required.';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password.';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        navigate('/login'); 
      } else {
        alert('Registration failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting form.');
    }
  };

  return (
    <div
      className="form-container"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Header />
      <form onSubmit={handleSubmit} noValidate>
        <h2>Registration Form</h2>

        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          aria-describedby="name-error"
          required
        />
        {errors.name && <div id="name-error" className="error-message">{errors.name}</div>}

        <label htmlFor="email">Email Address:</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          aria-describedby="email-error"
          required
        />
        {errors.email && <div id="email-error" className="error-message">{errors.email}</div>}

        <label htmlFor="rollNo">Roll No:</label>
        <input
          id="rollNo"
          type="text"
          name="rollNo"
          value={formData.rollNo}
          onChange={handleChange}
          aria-describedby="rollNo-error"
          required
        />
        {errors.rollNo && <div id="rollNo-error" className="error-message">{errors.rollNo}</div>}

        <label htmlFor="section">Section:</label>
        <input
          id="section"
          type="text"
          name="section"
          value={formData.section}
          onChange={handleChange}
          aria-describedby="section-error"
          required
        />
        {errors.section && <div id="section-error" className="error-message">{errors.section}</div>}

        <label htmlFor="address">Address:</label>
        <input
          id="address"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          aria-describedby="address-error"
          required
        />
        {errors.address && <div id="address-error" className="error-message">{errors.address}</div>}

        <label htmlFor="password">Password:</label>
        <div className="password-wrapper">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => setShowChecklist(true)}
            onBlur={() => setShowChecklist(false)}
            aria-describedby="password-error"
            required
          />
          <span
            className="password-toggle"
            role="button"
            tabIndex={0}
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword(!showPassword)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setShowPassword(!showPassword);
            }}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        {errors.password && <div id="password-error" className="error-message">{errors.password}</div>}

        {showChecklist && (
          <PasswordChecklist
            rules={["minLength", "specialChar", "number", "capital"]}
            minLength={5}
            value={formData.password}
            className="password-checklist"
          />
        )}

        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          aria-describedby="confirmPassword-error"
          required
        />
        {errors.confirmPassword && <div id="confirmPassword-error" className="error-message">{errors.confirmPassword}</div>}

        <button type="submit">Submit</button>
        <button type="button" className="secondary-btn" onClick={() => navigate('/login')}>Back</button>
      </form>
      <Footer />
      {submitted && <div className="success-message">Thank you for registering!</div>}
    </div>
  );
}

export default RegistrationForm;

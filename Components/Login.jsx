import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './Login.css';
import bgImage from './assets/login.avif';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Login successful!');

        // Store user info
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userName', data.name || '');

        if (data.isAdmin) {
          localStorage.setItem('isAdmin', 'true');
          navigate('/admin');
        } else {
          localStorage.removeItem('isAdmin');
          navigate('/dashboard');
        }
      } else {
        const err = await response.text();
        alert(`Login failed: ${err}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error logging in.');
    }
  };

  return (
    <>
      <Header />
      <div 
        className="login-form-container"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <h2>Login Form</h2>

            <label>Email Address:</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />

            <label>Password:</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />

            <button type="submit">Login</button>
            <h4>
              Not registered? <a href="/register">Create a new account</a>
            </h4>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;

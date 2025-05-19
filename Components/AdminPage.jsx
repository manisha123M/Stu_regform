import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import bgImage from './assets/nitk.jpeg';

function AdminPage() {
  const navigate = useNavigate();

  const [video, setVideo] = useState({
    url: '',
    description: '',
    language: '',
    category: '',
  });

  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVideo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/admin/add-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(video),
      });

      if (res.ok) {
        alert('Video added successfully');
        setVideo({ url: '', description: '', language: '', category: '' });
      } else {
        alert('Failed to add video');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  return isAdmin ? (
    <div
      style={{
        minHeight: '100vh',
        padding: '2rem',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <Header />
      <br /><br /><br />
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', width: '100%' }}>
        <input name="url" placeholder="Video URL" value={video.url} onChange={handleChange} required style={inputStyle} />
        <input name="description" placeholder="Description" value={video.description} onChange={handleChange} required style={inputStyle} />
        <select name="language" value={video.language} onChange={handleChange} required style={inputStyle}>
          <option value="">Select Language</option>
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Kannada">Kannada</option>
        </select>
        <select name="category" value={video.category} onChange={handleChange} required style={inputStyle}>
          <option value="">Select Category</option>
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="seniors">Senior</option>
        </select>
        <button type="submit" style={buttonStyle}>Add Video</button><br /><br />
        <a href="/dashboard" style={{ ...buttonStyle, textDecoration: 'none', textAlign: 'center' }}>Back</a>
        <Footer />
      </form>
    </div>
  ) : null;
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '15px',
  fontSize: '16px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  boxSizing: 'border-box',
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#7a5af8',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  fontSize: '16px',
  cursor: 'pointer',
};

export default AdminPage;

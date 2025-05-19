import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Header from './Header';
import Footer from './Footer';
import AnimatedBackground from './AnimatedBackground';
import bgImage from './assets/book.avif'

function Dashboard() {
  const navigate = useNavigate();
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const handleClassButtonClick = (route) => {
    setSelectedRoute(route);
    setShowLanguageOptions(true);
    setShowPopup(false);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setShowPopup(true);

    setTimeout(() => {
      navigate(`${selectedRoute}?lang=${language}`);
    }, 2000);
  };

  return (
    <div className="dashboard"
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
      <AnimatedBackground />

      <Header />

      <main className="dashboard-main">
        <section className="choices-panel">
          <h2>Choose Your Class</h2>

          <div className="button-container">
            {['/primary', '/secondary', '/seniors'].map((route, idx) => (
              <button
                key={route}
                className="class-btn"
                onClick={() => handleClassButtonClick(route)}
              >
                {idx === 0 && '1 - 6 Standard'}
                {idx === 1 && '7 - 8 Standard'}
                {idx === 2 && '10 - 12 Standard'}
              </button>
            ))}
          </div>

          {showLanguageOptions && (
  <div className="language-section fade-in"> 
    <h3>Select a Language:</h3>
    <button className="lang-btn" onClick={() => handleLanguageSelect('english')}>English</button>
    <button className="lang-btn" onClick={() => handleLanguageSelect('hindi')}>Hindi</button>
    <button className="lang-btn" onClick={() => handleLanguageSelect('kannada')}>Kannada</button>
  </div>
)}

{selectedLanguage && (
            <div className="selected-language">
              <p>Selected Language: {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}</p>
            </div>
          )}<br/>

 <a href="/login" style={{ ...buttonStyle, textDecoration: 'none', textAlign: 'center' }}>Logout</a>

{showPopup && (
  <div className="popup-message popup-fade">
    <p>Language selection successful!</p>
  </div>
)}

        </section>
      </main>

      <Footer />
    </div>
  );
}
const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  textAlign: 'center',
  cursor: 'pointer',
  minWidth: '100px',
};

export default Dashboard;

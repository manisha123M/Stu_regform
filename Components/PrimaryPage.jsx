import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './PrimaryPage.css';
import './Sidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';

function PrimaryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const langParam = queryParams.get('lang') || 'english';
  const formattedLanguage = langParam.charAt(0).toUpperCase() + langParam.slice(1).toLowerCase();

  const [language] = useState(formattedLanguage);
  const [adminVideos, setAdminVideos] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (!userEmail) {
      alert('Please login to access this page.');
      navigate('/login');
    }
  }, [userEmail, navigate]);

  useEffect(() => {
    setShowPopup(true);
    const timer = setTimeout(() => setShowPopup(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
  const fetchAdminVideos = async () => {
    try {
      const res = await fetch(`http://localhost:5000/videos?category=primary&language=${language}`);
      const data = await res.json();
      setAdminVideos(data);
    } catch (err) {
      console.error('Error fetching admin videos:', err);
    }
  };

  fetchAdminVideos();
}, [language]);


  const videoUrls = {
    English: [
      { url: 'https://www.youtube.com/embed/lNhCiXoR-5k', description: 'Stay safe online by never sharing personal details, using strong passwords, avoiding unknown links, and updating your devices.' },
      { url: 'https://www.youtube.com/embed/D_cvJPPAlck', description: 'Description of Lesson 2 in English' },
      { url: 'https://www.youtube.com/embed/7zKuRqVTL6o', description: 'Description of Lesson 3 in English' },
    ],
    Hindi: [
      { url: 'https://www.youtube.com/embed/loS0hmZNwJM', description: 'Description of Lesson 1 in Hindi' },
      { url: 'https://www.youtube.com/embed/rIz22iWwpW4', description: 'Description of Lesson 2 in Hindi' },
      { url: 'https://www.youtube.com/embed/V0x29wZ-Ap8', description: 'Description of Lesson 3 in Hindi' },
    ],
    Kannada: [
      { url: 'https://www.youtube.com/embed/wFwCDVz1BpU', description: 'Description of Lesson 1 in Kannada' },
      { url: 'https://www.youtube.com/embed/Snhz_d1Ws3Q', description: 'Description of Lesson 2 in Kannada' },
      { url: 'https://www.youtube.com/embed/5rXWFaZQX_Q', description: 'Description of Lesson 3 in Kannada' },
    ],
  };

 const selectedVideos = [...(videoUrls[language] || []), ...adminVideos];
  const videoSrc = selectedVideos.length > 0 ? selectedVideos[currentVideoIndex].url : '';
  const videoDescription = selectedVideos.length > 0 ? selectedVideos[currentVideoIndex].description : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/primary-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          lessonNumber: currentVideoIndex + 1,
          rating,
          feedback,
          language,
        }),
      });

      if (response.ok) {
        alert('Thank you for your feedback!');
        setRating(0);
        setFeedback('');
      } else {
        alert('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Feedback error:', error);
      alert('An error occurred. Try again later.');
    }
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % selectedVideos.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex - 1 + selectedVideos.length) % selectedVideos.length);
  };

  return (
    <div className="primary-page">
      <Header />

      <div className="main-layout">
        <Sidebar
          lessons={selectedVideos}
          onSelect={setCurrentVideoIndex}
          currentIndex={currentVideoIndex}
        />

        <main className="content">
          <div className="video-section"><br/><br/><br/>
            <h2>Lesson {currentVideoIndex + 1} ({language})</h2>
            <div className="video-nav-wrapper">
              <button className="nav-button" onClick={prevVideo}>Prev</button>

              {videoSrc ? (
                <iframe
                  width="560"
                  height="315"
                  src={videoSrc}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              ) : (
                <p>No videos available for the selected language.</p>
              )}
              <button className="nav-button" onClick={handleNextVideo}>Next</button>
            </div>
            <p>{videoDescription}</p>
          </div>

          <form onSubmit={handleSubmit} className="feedback-section">
            {/* Rating and Feedback form */}
            <label><b>Rating:</b></label>
            <div className="stars">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={(hover || rating) > index ? 'colored' : 'uncolored'}
                  onClick={() => setRating(index + 1)}
                  onMouseEnter={() => setHover(index + 1)}
                  onMouseLeave={() => setHover(0)}
                >
                  &#9733;
                </span>
              ))}
            </div><br />

            <label><b>Feedback:</b></label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="4"
              placeholder="What did you think about the lesson?"
            ></textarea>

            <button type="submit">Submit Feedback</button><br /><br />
          </form>
        </main>
      </div>

      <Footer />

      {showPopup && (
        <div style={popupStyle}>
          <div style={popupContentStyle}>
            <h3>Language: {language}</h3>
            <p>Now showing lessons in {language} for classes 1st-5th standard.</p>
            <button onClick={() => setShowPopup(false)} style={popupCloseStyle}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

const popupStyle = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const popupContentStyle = {
  background: '#fff',
  padding: '20px',
  borderRadius: '10px',
  textAlign: 'center',
};

const popupCloseStyle = {
  padding: '5px 10px',
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default PrimaryPage;

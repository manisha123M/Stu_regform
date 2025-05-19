import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import './SeniorPage.css';
import { useNavigate,useLocation } from 'react-router-dom';
import Sidebar from './Sidebar'; 
import './Sidebar.css';

function SeniorPage() {
  const location = useLocation();
  const navigate=useNavigate();
  // const [activeTab, setActiveTab] = useState("activity");

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
  // const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const userEmail = localStorage.getItem('userEmail');

  // const isAdmin = localStorage.getItem('isAdmin') === 'true';

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
      {url:'https://www.youtube.com/embed/MK3FVexzyqI', description: 'Email Encryption Basics',summary:'Email encryption protects sensitive information by making email content unreadable to anyone except the intended recipient. It uses encryption methods like S/MIME and PGP, which rely on public and private keys to secure messages. Encryption ensures confidentiality, prevents tampering, and verifies the senders identity, making email communication safer and more secure.'},
      {url:'https://www.youtube.com/embed/x3yhV9dw4pE',description: 'Description of Lesson 2'},
      {url:'https://www.youtube.com/embed/SeniorVideo3',description: 'Description of Lesson 3'},
    ],
    Hindi: [
      {url:'https://www.youtube.com/embed/GZfkFirrvis',description: 'Description of Lesson 1'},
      {url:'https://www.youtube.com/embed/HindiSenior2',description: 'Description of Lesson 2'},
      {url:'https://www.youtube.com/embed/HindiSenior3',description: 'Description of Lesson 3'},
    ],
    Kannada: [
      {url:'https://www.youtube.com/embed/_uIGAGrsE3k',description: 'Description of Lesson 1'},
      {url:'https://www.youtube.com/embed/KannadaSenior2',description: 'Description of Lesson 2'},
      {url:'https://www.youtube.com/embed/KannadaSenior3',description: 'Description of Lesson 3'},
    ],
  };

  const selectedVideos = [...(videoUrls[language] || []), ...adminVideos];
  const videoSrc = selectedVideos.length > 0 ? selectedVideos[currentVideoIndex].url : '';
  const videoDescription=selectedVideos.length >0 ?selectedVideos[currentVideoIndex].description:'';
  const videoSummary=selectedVideos.length >0 ?selectedVideos[currentVideoIndex].summary:'';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/seniors-feedback', {
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
        // setFeedbackSubmitted(true);
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
    // setFeedbackSubmitted(false);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex - 1 + selectedVideos.length) % selectedVideos.length);
    // setFeedbackSubmitted(false);
  };

  return (
    <div className="senior-page">
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
    <button className="nav-button" onClick={prevVideo}> Prev</button>

          {videoSrc ? (
            <iframe
              width="560"
              height="315"
              src={videoSrc}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture,web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          ) : (
            <p>No videos available for the selected language.</p>
          )}
           <button className="nav-button" onClick={handleNextVideo}>Next </button>
        </div>
        <div className="lesson-description">
    <h3>{videoDescription}</h3>
<p>{videoSummary}</p>

  </div>
        </div>
{/* 
<div className="video-tabs">
  <button
    className={activeTab === "activity" ? "tab-active" : ""}
    onClick={() => setActiveTab("activity")}
  >
    Activity
  </button>
  <button
    className={activeTab === "summary" ? "tab-active" : ""}
    onClick={() => setActiveTab("summary")}
  >
    Summary
  </button>
</div>
<div className="tab-content">
  {activeTab === "activity" ? (
    <div>
      <h4>Questions for Lesson {currentVideoIndex + 1}</h4>
      <p>Q1: What did you learn from this video?</p>
      <p>Q2: Can you apply this in real life?</p>
    </div>
  ) : (
    <div>
      <h4>Lesson Summary</h4>
      <p>{selectedVideos[currentVideoIndex].description}</p>
    </div>
  )}
</div> */}


        <form onSubmit={handleSubmit} className="feedback-section">
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
          </div><br/>

          <label><b>Feedback:</b></label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows="4"
            placeholder="Your thoughts on this lesson?"
          ></textarea>

          <button type="submit">Submit Feedback</button><br/><br/>
{/* 
          {feedbackSubmitted && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '12px' }}>
              <button type="button" onClick={prevVideo} style={buttonStyle}>Prev Video</button>
              <button type="button" onClick={handleNextVideo} style={buttonStyle}>Next Video</button>
              <a href="/dashboard" style={{ ...buttonStyle, textDecoration: 'none', textAlign: 'center' }}>Back</a>
            </div> */}
          {/* )} */}
        </form>
      </main></div>
      <Footer />

      {showPopup && (
        <div style={popupStyle}>
          <div style={popupContentStyle}>
            <h3>Language: {language}</h3>
            <p>Now showing lessons in {language} for classes 9th to 10th standard.</p>
            <button onClick={() => setShowPopup(false)} style={popupCloseStyle}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// const buttonStyle = {
//   padding: '10px 20px',
//   backgroundColor: '#28a745',
//   color: 'white',
//   border: 'none',
//   borderRadius: '5px',
//   textAlign: 'center',
//   cursor: 'pointer',
//   minWidth: '100px',
// };

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

export default SeniorPage;

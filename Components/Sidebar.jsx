import React from 'react';
import './Sidebar.css';

function Sidebar({ lessons, onSelect, currentIndex }) {
  return (
    <aside className="sidebar" aria-label="Lesson navigation sidebar">
      <div className="course-header"><br/>
        <h3>CyberSecurity Research Lab Lessons</h3>
      </div>

      <ul className="lesson-list" >
        {lessons.map((_, index) => (
          <li
            key={index}
            role="button"
            tabIndex={0}
            aria-current={index === currentIndex ? 'true' : 'false'}
            className={index === currentIndex ? 'active' : ''}
            onClick={() => onSelect(index)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelect(index);
            }}
          >
            Lesson {index + 1}
          </li>
        ))}

      <a href="/dashboard" className="back-button" aria-label="Back to dashboard">
        Back
      </a></ul>
    </aside>
  );
}

export default Sidebar;

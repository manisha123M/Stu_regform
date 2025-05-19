import React from 'react';

function Footer() {
  return (
    <footer style={styles.footer}>
      <p>&copy; 2025 All Rights Reserved </p>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    padding: '15px 20px',
    textAlign: 'center',
    width: '100%',
    minHeight: '50px',
    position: 'fixed',
    left: 0,
    bottom: 0,
    zIndex: 100,
  },
};

export default Footer;


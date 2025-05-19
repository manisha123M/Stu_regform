import React from 'react';
import logo from './CSRL_Logo_croped.png';
import bgImage from './assets/4.jpg';

function Header() {
    return (
        <header style={styles.header}>
            <div style={styles.headerContent}>
            <img src={logo} alt="Logo" style={styles.logo} />
                <h1>Cyber Security Research Laboratory</h1> 
            </div>
        </header>
    );
}

const styles = {
    header: {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        height: '55px',
        textAlign: 'center',
        padding: '15px 20px',
        minHeight: '70px',
        width: '100%',
        position: 'fixed',
        left:0,
        top:0,
        zIndex: 100,
         boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    },
    headerContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
    },
    logo: {
        height: '30px',
        backgroundColor: 'white',
        padding: '5px',
        borderRadius: '5px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
      }
      
      
};

export default Header;

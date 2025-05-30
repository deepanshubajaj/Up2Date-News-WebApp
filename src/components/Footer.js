import React from 'react';
import { FaFacebook, FaLinkedin, FaInstagram, FaTwitter, FaGithub, FaCopyright } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="social-icons">
        <a href={process.env.REACT_APP_FACEBOOK} target="_blank" rel="noopener noreferrer">
          <FaFacebook className="icon" />
        </a>
        <a href={process.env.REACT_APP_LINKEDIN} target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="icon" />
        </a>
        <a href={process.env.REACT_APP_INSTAGRAM} target="_blank" rel="noopener noreferrer">
          <FaInstagram className="icon" />
        </a>
        <a href={process.env.REACT_APP_TWITTER} target="_blank" rel="noopener noreferrer">
          <FaTwitter className="icon" />
        </a>
        <a href={process.env.REACT_APP_GITHUB} target="_blank" rel="noopener noreferrer">
          <FaGithub className="icon" />
        </a>
      </div>
      <div className="copyright">
        <FaCopyright className="copyright-icon" /> {process.env.REACT_APP_CREATOR_NAME} 2025
      </div>
    </footer>
  );
};

export default Footer; 
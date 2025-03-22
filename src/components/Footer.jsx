import React from 'react';


const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year

  return (
    <footer className="footer" style={{marginLeft:'30px' }}>
      <p>© {currentYear} MassTrip</p>
    </footer>
  );
};

export default Footer;

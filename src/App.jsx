import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Home from './components/Home';
import Itinerary_Creation_Page from './components/Itinerary_Creation_Page';
import Login from "./components/Login";
import SignUp from './components/Signup';
import Final_Itinerary from "./components/Final_Itinerary";
import Footer from "./components/Footer";
import './styles/custom.css'; 
import ContactUs from './components/Contact_Us_Page'
import FAQ from './components/FAQpage'
import AddLandmark from './components/AddLandmark';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from "../src/context/AuthContext";
import AuthForm from "./components/AuthForm";


function App() {
  // keep track of whether the nav menu is open or closed
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  // check if we're on a mobile screen (less than 992px wide)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  // refs to help us detect clicks outside the nav or toggle button
  const navRef = useRef(null);
  const toggleRef = useRef(null);

  const { isAuthenticated } = useAuth();

  console.log("isAuthenticated:", isAuthenticated);


  // close the menu when a link is clicked
  const handleLinkClick = () => {
    setIsNavExpanded(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    const handleClickOutside = (event) => {
      if (
        isNavExpanded &&
        navRef.current &&
        !navRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setIsNavExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNavExpanded]); 

  return (
    <Router>
      {/* the main navbar at the top */}
      <Navbar
        expand="lg"
        style={{
          height: '80px',
          backgroundColor: '#009766',
          position: 'relative',
          zIndex: 1000,
        }}
        variant="dark"
        expanded={isNavExpanded}
        ref={navRef} 
      >
        <Container fluid>
          {/* hamburger button for mobile */}
          <div
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1001,
            }}
            ref={toggleRef}
          >
            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
              }}
              onClick={() => setIsNavExpanded(!isNavExpanded)}
            >
              <span
                className="navbar-toggler-icon"
                style={{
                  filter: 'brightness(0) invert(1)', 
                  width: '24px',
                  height: '24px',
                  display: 'inline-block',
                }}
              ></span>
            </Navbar.Toggle>
          </div>

          {/* the masstrip logo in the center */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
            }}
          >
            <Navbar.Brand as={Link} to="/" style={{ color: 'white', fontWeight: 'bold' }}>
              MassTrip
            </Navbar.Brand>
          </div>

          {/* the menu links that collapse on mobile */}
          <Navbar.Collapse
            id="basic-navbar-nav"
            style={
              isMobile && isNavExpanded
                ? {
                    position: 'absolute',
                    top: '80px', 
                    left: 0,
                    width: '100%',
                    backgroundColor: '#009766',
                    zIndex: 999,
                    padding: '1rem',
                    height: 'calc(100vh - 80px)', 
                    overflowY: 'auto', 
                  }
                : {} 
            }
          >
            <Nav className="ms-auto">
              {/* nav links for each page */}
              <Nav.Link
                as={Link}
                to="/"
                style={{ color: 'white', fontSize: '1.1rem', padding: '0.75rem 1rem' }}
                onClick={handleLinkClick}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/itinerary_creation"
                style={{ color: 'white', fontSize: '1.1rem', padding: '0.75rem 1rem' }}
                onClick={handleLinkClick}
              >
                Create a Road Trip
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/addlandmark"
                style={{ color: 'white', fontSize: '1.1rem', padding: '0.75rem 1rem' }}
                onClick={handleLinkClick}
              >
                Add a Landmark
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/contactUs"
                style={{ color: 'white', fontSize: '1.1rem', padding: '0.75rem 1rem' }}
                onClick={handleLinkClick}
              >
                Contact and FAQ
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/signup"
                style={{ color: 'white', fontSize: '1.1rem', padding: '0.75rem 1rem' }}
                onClick={handleLinkClick}
              >
                {isAuthenticated ? "Log out" : "Login / Sign Up"}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* main content area */}
      <Container className="mt-5" style={{ minHeight: '100vh' }}>
        {/* define routes for each page */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/itinerary_creation" element={<Itinerary_Creation_Page />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/signup" element={<SignUp />} />
          {/* <Route path="/signup" element={<AuthForm />} /> */}

          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/addlandmark" element={<AddLandmark />} />
          <Route path="/final_itinerary" element={<Final_Itinerary />} />
          {/* <Route path="/auth" element={<AuthForm />} /> */}
          
        </Routes>
      </Container>

      {/* footer at the bottom */}
      <Footer />
    </Router>
  );
}

export default App;
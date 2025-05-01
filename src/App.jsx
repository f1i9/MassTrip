import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
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

function PageWrapper({ children }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (isHomePage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isHomePage]);

  return children;
}

function App() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const navRef = useRef(null);
  const toggleRef = useRef(null);

  const { isAuthenticated } = useAuth();

  console.log("isAuthenticated:", isAuthenticated);


  const handleLinkClick = () => {
    setIsNavExpanded(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth >= 992) {
        setIsNavExpanded(false);
      }
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

  const mobileNavStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '250px',
    height: '100vh',
    backgroundColor: '#009766',
    zIndex: 1001,
    padding: '1rem',
    paddingTop: '90px',
    transform: isNavExpanded ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.3s ease-in-out',
    overflow: 'auto',
    boxShadow: isNavExpanded ? '2px 0 10px rgba(0,0,0,0.2)' : 'none',
    display: 'flex',
    flexDirection: 'column',
    opacity: 1 
  };

  const loginButtonStyle = {
    backgroundColor: '#00704d', 
    color: 'white', 
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    fontWeight: 'bold',
    marginTop: '15px',
    width: '100%',
    transition: 'background-color 0.2s ease'
  };

  const menuFooterStyle = {
    color: 'white',
    fontSize: '0.85rem',
    textAlign: 'center',
    marginTop: 'auto', 
    paddingTop: '20px',
    paddingBottom: '15px',
    opacity: 0.9
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: isNavExpanded ? '250px' : 0, 
    width: isNavExpanded ? 'calc(100% - 250px)' : '100%',
    height: '100vh',
    backgroundColor: 'transparent', 
    zIndex: 999, 
    cursor: 'pointer' 
  };

  return (
    <Router>
      <PageWrapper>
        <Navbar
          expand="lg"
          style={{
            height: '80px',
            backgroundColor: '#009766',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
          }}
          variant="dark"
          expanded={isNavExpanded}
          ref={navRef}
        >
          <Container fluid>
            <div
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1002,
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

            {isMobile ? (
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1000,
                }}
              >
                <Navbar.Brand
                  as={Link}
                  to="/"
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                  }}
                  onClick={handleLinkClick}
                >
                  MassTrip
                </Navbar.Brand>
              </div>
            ) : (

            <div
              style={{
                marginLeft: 'auto',
                marginRight: '1rem',
              }}
            >
              <Navbar.Brand
                as={Link}
                to="/"
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  paddingLeft: '15px'
                }}
                onClick={handleLinkClick}
              >
                MassTrip
              </Navbar.Brand>
            </div>
            )}

            {!isMobile && (
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
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
            )}
          </Container>
        </Navbar>

        {isMobile && (
          <div style={mobileNavStyle}>
            <div>
              <Nav className="flex-column">
                <Nav.Link
                  as={Link}
                  to="/"
                  style={{ color: 'white', fontSize: '1.1rem', padding: '0.75rem 0' }}
                  onClick={handleLinkClick}
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/itinerary_creation"
                  style={{ color: 'white', fontSize: '1.1rem', padding: '0.75rem 0' }}
                  onClick={handleLinkClick}
                >
                  Create a Road Trip
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/addlandmark"
                  style={{ color: 'white', fontSize: '1.1rem', padding: '0.75rem 0' }}
                  onClick={handleLinkClick}
                >
                  Add a Landmark
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/contactUs"
                  style={{ color: 'white', fontSize: '1.1rem', padding: '0.75rem 0' }}
                  onClick={handleLinkClick}
                >
                  Contact Us
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/faq"
                  style={{ color: 'white', fontSize: '1.1rem', padding: '0.75rem 0' }}
                  onClick={handleLinkClick}
                >
                  FAQ
                </Nav.Link>
                
                <Button
                  as={Link}
                  to="/signup"
                  style={{
                    ...loginButtonStyle,
                    marginTop: '8px', 
                    marginBottom: '15px' 
                  }}
                  onClick={handleLinkClick}
                >
                  {isAuthenticated ? "Log out" : "Sign In / Sign Up"}
                </Button>
              </Nav>
            </div>
            
            <div style={menuFooterStyle}>
              <p>© {new Date().getFullYear()} MassTrip</p>
            </div>
          </div>
        )}

        {isNavExpanded && isMobile && (
          <div 
            style={overlayStyle}
            onClick={() => setIsNavExpanded(false)}
          />
        )}

        <Container className="mt-5" style={{
          minHeight: '84vh',
          paddingTop: '80px',
          marginBottom: '2rem'
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/itinerary_creation" element={<Itinerary_Creation_Page />} />
            <Route path="/signup" element={<SignUp />} />

            <Route path="/contactUs" element={<ContactUs />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/addlandmark" element={<AddLandmark />} />
            <Route path="/final_itinerary" element={<Final_Itinerary />} />
            
          </Routes>
        </Container>

        <Footer />
      </PageWrapper>
    </Router>
  );
}

export default App;
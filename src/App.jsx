/*
Author: Evan Kuczynski 3/18/25
this is the main component of the application for the pages
it can import other components and render them

*/


import './App.css';
import styles from './Styles/custom.css' // styles are being used ignore dum pre compiler

import FAQPage from './Components/FAQpage'
import ContactUsPage from './Components/ContactUsPage';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Home from "./Components/Home";
import Itinerary_Creation_Page from './Components/Itinerary_Creation_Page';
import Login from "./Components/Login";
import SignUp from './Components/SignUp';
import ContactUs from "./Components/ContactUsPage";

function App() {
    return (
        <Router>
            {/* Navigation Bar */}
            <Navbar>

                <Container>

                    {/* MassTrip */}
                    <Navbar.Brand as={Link} to="/" className="fw-bold text-white">
                        MassTrip
                    </Navbar.Brand>

                    {/* Navigation Bar Items */}
                    <Navbar id="basic-navbar-nav">
                        <Nav>
                            <Nav.Link as={Link} to="/" className="text-white">
                                Home
                            </Nav.Link>
                            <Nav.Link as={Link} to="/itinerary_creation" className="text-white">
                                Itinerary Creation
                            </Nav.Link>
                            <Nav.Link as={Link} to="/login" className="text-white">
                                Login
                            </Nav.Link>
                        </Nav>
                    </Navbar>

                </Container>
            </Navbar>

            {/* Navigation Bar Routes*/}
            <Container className="mt-5" style={{minHeight: '100vh'}}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/contact_us" element={<ContactUsPage />} />
                    <Route path="/itinerary_creation" element={<Itinerary_Creation_Page />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
            </Container>

        </Router>
    );
}

export default App;


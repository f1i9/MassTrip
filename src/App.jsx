import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Home from './components/Home';
import Itinerary_Creation_Page from './components/Itinerary_Creation_Page';
import Login from "./components/Login";
import SignUp from './components/Signup';
import Final_Itinerary from "./components/Final_Itinerary";
import Footer from "./components/Footer";
import './styles/custom.css'; 
import ContactUs from './components/ContactUsPage'
import FAQ from './components/FAQpage'

function App() {
  return (
    <Router>
      {/* Navigation Bar */}
      {/* <Navbar> */}
      <Navbar style={{ height: '80px' }}>

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
                Create a Road Trip
              </Nav.Link>
              <Nav.Link as={Link} to="/" className="text-white">
                Add a Landmark
              </Nav.Link>
              <Nav.Link as={Link} to="/contactUs" className="text-white">
                Contact and FAQ
              </Nav.Link>
              <Nav.Link as={Link} to="/login" className="text-white">
                Sign up/Login
              </Nav.Link>
            </Nav>
          </Navbar>

        </Container>
      </Navbar>

      {/* Navigation Bar Routes*/}
      <Container className="mt-5" style={{minHeight: '100vh'}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/itinerary_creation" element={<Itinerary_Creation_Page />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </Container>
{/* Footer will be displayed here */}
<Footer />
    </Router>
    
  );
}

export default App;

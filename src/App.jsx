import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Home from './components/Home';
import Itinerary_Creation_Page from './components/Itinerary_Creation_Page';
import './styles/custom.css'; 

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
            </Nav>
          </Navbar>

        </Container>
      </Navbar>

      {/* Navigation Bar Routes*/}
      <Container className="mt-5" style={{minHeight: '100vh'}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/itinerary_creation" element={<Itinerary_Creation_Page />} />
        </Routes>
      </Container>

    </Router>
  );
}

export default App;

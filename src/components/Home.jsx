import { useState } from 'react';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import '../styles/home.css';
import { useNavigate } from 'react-router-dom';


function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/itinerary_creation', { state: { searchQuery: query } });
  };

  return (
    <Container className="mt-5 home-background">
      <h3 className="text-center mb-2 text-white" style={{marginTop: '180px'}}>Plan your perfect road trip across Massachusetts!</h3>
      <h4 className="text-center mb-2 text-white">Explore landmarks, get routes, and discover new places to visit.</h4>

      {/* Search Box Section */}
      <div className="d-flex justify-content-center">
        <InputGroup style={{ maxWidth: '540px', width: '100%', marginTop: '50px' }}>
          <Form.Control
            type="text"
            placeholder="Where is your starting location?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }}}
            style={{ padding: '10px' }}
          />
          <Button variant="primary" onClick={handleSearch}>
            Go
          </Button>
        </InputGroup>
      </div>
      <div>
        <p className="justify-content-center text-center text-white" style={{ marginTop: '20px' }}>
          Photo by <a href="https://unsplash.com/@geraninmo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Geranimo</a> on <a href="https://unsplash.com/photos/aerial-shot-of-road-surrounded-by-green-trees-qzgN45hseN0?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash _</a>
        </p>
      </div>
    </Container>
  );
}

export default Home;

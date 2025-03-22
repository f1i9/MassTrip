import { useState } from 'react';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';

function Home() {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", query); // Add your search logic here
  };

  return (
    <Container className="mt-5">
      <h3 className="text-center mb-2">Plan your perfect road trip across Massachusetts!</h3>
      <h4 className="text-center mb-2">Explore landmarks, get routes, and discover new places to visit.</h4>

      {/* Search Box Section */}
      <div className="d-flex justify-content-center">
        <InputGroup style={{ maxWidth: '540px', width: '100%', marginTop: '20px' }}>
          <Form.Control
            type="text"
            placeholder="Where is your starting location?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ padding: '10px' }}
          />
          <Button variant="primary" onClick={handleSearch}>
            Go
          </Button>
        </InputGroup>
      </div>
    </Container>
  );
}

export default Home;

import { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
function Itinerary_Creation_Page() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleGenerate = (e) => {
  };

  const handleClear = () => {
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4 itinerary-title">Itinerary Creation</h1>
      <p>Itinerary Creation Page</p>
    </Container>

  );
}

export default Itinerary_Creation_Page;
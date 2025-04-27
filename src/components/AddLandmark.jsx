import { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Image, Alert } from 'react-bootstrap';

function AddLandmark() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    category: '',
    images: ['', '', '']
  });

  const [showMessage, setShowMessage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategorySelect = (category) => {
    setFormData({ ...formData, category });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting landmark:', formData);
    setShowMessage(true); 

    setFormData({
      name: '',
      address: '',
      description: '',
      category: '',
      images: ['', '', '']
    });

    setTimeout(() => {
      setShowMessage(false);
    }, 9000);
  };

  return (
    <Container fluid className="p-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="p-4 shadow">
            <Card.Body>
              <h3 className="mb-4 d-flex align-items-center">
                <span className="me-2">⭐</span> Add A Landmark
              </h3>

              {showMessage && (
                <Alert variant="success" onClose={() => setShowMessage(false)} dismissible>
                  Thank you, your landmark has been submitted!
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Landmark Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Col md={6}>
                    <Image
                      src="https://images.unsplash.com/photo-1590431257394-c7d56b5b6a6c"
                      fluid
                      rounded
                    />
                  </Col>

                  <Col md={6}>
                    {['First Image', 'Second Image', 'Third Image'].map((label, index) => (
                      <Form.Group key={index} className="mb-2">
                        <Form.Label>{label}</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Image URL"
                          value={formData.images[index]}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                        />
                      </Form.Group>
                    ))}

                    <div className="mt-3">
                      <h6>Category</h6>
                      {['Museum', 'School', 'Mountain', 'River', 'Skyscraper', 'Bridge'].map((cat) => (
                        <Button
                          key={cat}
                          variant={formData.category === cat ? 'dark' : 'outline-dark'}
                          size="sm"
                          className="me-2 mb-2"
                          onClick={() => handleCategorySelect(cat)}
                        >
                          {cat}
                        </Button>
                      ))}
                    </div>
                  </Col>
                </Row>

                <Button type="submit" variant="success" className="w-100">
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AddLandmark;

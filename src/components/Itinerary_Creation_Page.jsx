import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, InputGroup } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

function Itinerary_Creation_Page() {
  const [destination, setDestination] = useState('');
  const [radius, setRadius] = useState('20000'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [attractionItems, setAttractionItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNearbyAttractions = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a type of attraction to search for');
      return;
    }
  
    setLoading(true);
    setError(null);
    console.log('Fetching nearby attractions for type:', searchQuery);
  
    try {
      const locationResponse = await axios.get('http://localhost:3001/api/location');
      const { latitude, longitude } = locationResponse.data;
  
      const nearbyResponse = await axios.get('http://localhost:3001/api/nearby', {
        params: {
          lat: latitude,
          lng: longitude,
          radius: parseInt(radius) || 20000,
          type: searchQuery.toLowerCase().trim(),
        },
      });
  
      console.log('Nearby attractions:', nearbyResponse.data);
  
      const attractions = nearbyResponse.data.map((place, index) => ({
        id: `item-${index}`,
        name: place.name,
        vicinity: place.vicinity,
        location: place.location,
      }));
  
      console.log('Mapped attractions:', attractions);
      setAttractionItems(attractions);
    } catch (err) {
      console.error('Error fetching location or attractions:', err);
      setError('Failed to fetch attractions. Please try again or check the attraction type.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    console.log('Regenerate button clicked');
    fetchNearbyAttractions();
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(attractionItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setAttractionItems(items);
  };
  
  const addToItinerary = (item) => {
    setSelectedItems([...selectedItems, item]);
  };
  
  const removeAttraction = (id) => {
    setAttractionItems(attractionItems.filter(item => item.id !== id));
  };
  
  const removeFromItinerary = (id) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  return (
    <Container fluid className="mt-5">
      <Row>
        {/* Column 1 (Left) - Input Fields */}
        <Col md={3} className="mt-5 pt-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Control 
                type="text" 
                placeholder="Specific destination" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="bg-light border-0 py-4"
                style={{ borderRadius: '14px' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control 
                type="number"
                placeholder="Search radius (meters)"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="bg-light border-0 py-4"
                style={{ borderRadius: '14px' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control 
                type="text"
                placeholder="Number of stops"
                className="bg-light border-0 py-4"
                style={{ borderRadius: '14px' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control 
                type="text"
                placeholder="Available time"
                className="bg-light border-0 py-4"
                style={{ borderRadius: '14px' }}
              />
            </Form.Group>
          </Form>
        </Col>
        
        {/* Column 2 (Center) - Search and Drag-Drop Items */}
        <Col md={6}>
          <Form.Group className="mb-3">
            <InputGroup style={{ display: 'block', width: '100%' }}>
              <Form.Control
                type="text"
                placeholder="Search attractions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-success border-0 rounded-pill search-input fs-9 py-3 text-white"
                style={{ width: '100%', maxWidth: '95%', fontWeight: 'bold' }}
              />
            </InputGroup>
          </Form.Group>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="attractions">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="attractions-container"
                >
                  {loading ? (
                    <p>Loading nearby attractions...</p>
                  ) : error ? (
                    <p className="text-danger">{error}</p>
                  ) : attractionItems.length === 0 ? (
                    <p>No attractions found. Click "Regenerate" to search.</p>
                  ) : (
                    attractionItems.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <Card 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2 border-0 my-3"
                            onClick={() => addToItinerary(item)}
                          >
                            <Card.Body className="d-flex justify-content-between align-items-center bg-light py-3" style={{ borderRadius: '14px', minHeight: '73px' }}>
                              <div className="d-flex align-items-center">
                                <span>{item.name} ({item.vicinity})</span>
                              </div>
                              <div>
                                <Button 
                                  variant="gray" 
                                  size="sm" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeAttraction(item.id);
                                  }}
                                  className="border-0 rounded-pill fs-5 text-secondary"
                                >
                                  ×
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="fixed-info-container">
            <Card className="border-0 bg-light rounded-4 mt-3">
              <Card.Body>
                <h6>Estimated Time of Arrival</h6>
                <p className="text-muted">Description</p>
              </Card.Body>
            </Card>
          </div>

          <div className="mt-3 d-flex gap-2">
            <Button variant="primary" className="flex-grow-1">Clear</Button>
            <Button 
              id="regenerate-btn" 
              variant="primary" 
              className="flex-grow-1" 
              onClick={handleRegenerate}
            >
              Regenerate
            </Button>
          </div>
        </Col>
        
        {/* Column 3 (Right) - Selected Items */}
        <Col md={3}>
          <div className="selected-items-container p-3 border rounded bg-light border-0 rounded-4">
            <h6 className="text-center">Current Itinerary</h6>
            {selectedItems.length === 0 ? (
              <p className="text-muted text-center">Add attractions to your itinerary</p>
            ) : (
              <ul className="list-group">
                {selectedItems.map((item, index) => (
                  <li 
                    key={`selected-${item.id}-${index}`} 
                    className="list-group-item d-flex justify-content-between align-items-center border-0 mb-2"
                    style={{ borderRadius: '14px' }}
                  >
                    <div className="d-flex align-items-center">
                      <span>{item.name}</span>
                    </div>
                    <Button 
                      variant="gray" 
                      size="sm" 
                      onClick={() => removeFromItinerary(item.id)}
                    >
                      ×
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3 d-grid">
              <Button id="roadtrip-btn" variant="primary">Take a road trip!</Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Itinerary_Creation_Page;
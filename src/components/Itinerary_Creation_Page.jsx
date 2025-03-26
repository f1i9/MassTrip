import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, InputGroup } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function Itinerary_Creation_Page() {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [attractionItems, setAttractionItems] = useState([
    { id: 'item-1', name: 'Destination 1', image: '../public/vite.svg' },
    { id: 'item-2', name: 'Destination 2', image: '../public/vite.svg' },
    { id: 'item-3', name: 'Destination 3', image: '../public/vite.svg' },
    { id: 'item-4', name: 'Destination 4', image: '../public/vite.svg' },
  ]);
  
  const [selectedItems, setSelectedItems] = useState([]);
  
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
      {/* <h1 className="text-center mb-4 itinerary-title">Create Your Itinerary</h1> */}
      
      <Row>
        {/* Column 1 (Left) - Input Fields */}
        <Col md={3} className="mt-5 pt-4">
          {/* <h4>Trip Details</h4> */}
          <Form className=''>
            <Form.Group className="mb-3">
              {/* <Form.Label>Radius</Form.Label> */}
              <Form.Control 
                type="text" 
                placeholder="Specific destination" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className='bg-light border-0 py-4'
                style={{ borderRadius: '14px' }}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              {/* <Form.Label>Start Date</Form.Label> */}
              <Form.Control 
                type="text"
                placeholder="Searh radius" 
                className='bg-light border-0 py-4'
                style={{ borderRadius: '14px' }}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              {/* <Form.Label>End Date</Form.Label> */}
              <Form.Control 
                type="text"
                placeholder="Numeber of stops"
                className='bg-light border-0 py-4'
                style={{ borderRadius: '14px' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              {/* <Form.Label>End Date</Form.Label> */}
              <Form.Control 
                type="text"
                placeholder="Available time"
                className='bg-light border-0 py-4'
                style={{ borderRadius: '14px' }}
              />
            </Form.Group>
          </Form>
        </Col>
        
        {/* Column 2 (Center) - Search and Drag-Drop Items */}
        <Col md={6}>
          {/* <h4>Attractions</h4> */}
          <Form.Group className="mb-3">
            <InputGroup style={{ display: 'block', width: '100%' }}>
              <Form.Control
                type="text"
                placeholder="Search attractions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='bg-success border-0 rounded-pill search-input fs-9 py-3 text-white'
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
                  {attractionItems.map((item, index) => (
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
                              <img src={item.image} alt={item.name} style={{ marginRight: '10px' }} />
                              <span>{item.name}</span>
                            </div>
                            <div>
                              <Button 
                                variant="gray" 
                                size="sm" 
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeAttraction(item.id)
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
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* Fixed Information Container */}
          <div className="fixed-info-container">
            <Card className="border-0 bg-light rounded-4 mt-3">
              <Card.Body>
                <h6 className="">Estimated Time of Arrival</h6>
                <p className="text-muted">Description</p>
              </Card.Body>
            </Card>
          </div>


          <div className="mt-3 d-flex gap-2">
            <Button variant="primary" className="flex-grow-1">Clear</Button>
            <Button id="regenerate-btn" variant="primary" className="flex-grow-1">Regenerate</Button>

          </div>

        </Col>
        
        {/* Column 3 (Right) - Selected Items */}
        <Col md={3}>
          {/* <h4>Your Itinerary</h4> */}
          {/* <div className="selected-items-container p-3 border rounded bg-light border-0"> */}
          <div className="selected-items-container p-3 border rounded bg-light border-0 rounded-4">
            {/* <h5 className=''>Current Itinerary</h5> */}
            <h6 className='text-center'>Current Itinerary</h6>

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
                      <img src={item.image} alt={item.name} style={{ width: '40px', marginRight: '10px'}} />
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
            {/* <Button variant="primary">Take a road trip!</Button> */}
            <Button id="roadtrip-btn" variant="primary">Take a road trip!</Button>
          </div>
          </div>
          

        </Col>
      </Row>
    </Container>
  );
}

export default Itinerary_Creation_Page;
import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, InputGroup } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



function Itinerary_Creation_Page() {


  // state variables for all our form inputs and data
  const [destination, setDestination] = useState('');
  const [radius, setRadius] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [attractionItems, setAttractionItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  // don't want to overwhelm the user with too many options
  const itemsPerPage = 10;
  const maxItems = 100;


  const navigate = useNavigate();


  // checking if we're on mobile so we can adjust the layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };


    // check right away when the component loads
    handleResize();


    // set up an event listener for window resizing
    window.addEventListener('resize', handleResize);
    
    // clean up after ourselves like good developers do
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // this sends the user to the final page with their selected attractions
  const handleRoadTripClick = () => {
    navigate('/final_itinerary', {
      state: { selectedItems }  // passing the goodies to the next page
    });
  };



  // function that gets all our attractions from the api
  const fetchNearbyAttractions = async () => {
    // make sure the user typed something first
    if (!searchQuery.trim()) {
      setError('Please enter a type of attraction to search for');
      return;
    }



    // show loading spinner so the user knows something is happening
    setLoading(true);
    setError(null);


    // helper function to actually do the api call with coordinates
    const useNearbySearch = async (latitude, longitude) => {
      try {
        // hit our backend api that talks to google maps
        const nearbyResponse = await axios.get('http://localhost:3001/api/nearby', {
          params: {
            lat: latitude,
            lng: longitude,
            radius: parseInt(radius), // default to 20km if not set
            type: searchQuery.toLowerCase().trim(),
          },
        });

        // format the data nicely for our UI
        const attractions = nearbyResponse.data.slice(0, maxItems).map((place, index) => ({
          id: `item-${index}`,
          name: place.name,
          vicinity: place.vicinity,
          location: place.location,
        }));

        // update our state with all the cool places we found
        setAttractionItems(attractions);
        setCurrentPage(1); // back to page 1 with new results
      } catch (err) {
        // oops something went wrong with the api
        console.error('Error fetching nearby attractions:', err);
        setError('Failed to fetch attractions. Please try again or check the attraction type.');
      } finally {
        // always hide the loading spinner when done
        setLoading(false);
      }
    };

    // backup plan if geolocation doesn't work
    const fallbackToIP = async () => {
      try {
        // try to get location from IP address instead
        const locationResponse = await axios.get('http://localhost:3001/api/location');
        const { latitude, longitude } = locationResponse.data;
        await useNearbySearch(latitude, longitude);
      } catch (err) {
        // even our backup plan failed! :(
        console.error('Fallback IP location failed:', err);
        setError('Failed to get location. Please allow GPS or try again later.');
        setLoading(false);
      }
    };

    // first try to get user's location through browser geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // yay, we got permission to use their location!
          const { latitude, longitude } = position.coords;
          await useNearbySearch(latitude, longitude);
        },
        async (error) => {
          // bummer, they denied location access
          console.warn('Geolocation failed:', error.message);
          await fallbackToIP();
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      // older browser that doesn't support geolocation
      await fallbackToIP();
    }
  };

  // when user hits the generate button
  const handleRegenerate = () => {
    fetchNearbyAttractions();
  };

  // this handles the drag and drop reordering of attractions
  const handleDragEnd = (result) => {
    // dropped outside the list? just ignore it
    if (!result.destination) return;
    
    // reorder the list based on where they dropped the item
    const items = Array.from(attractionItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setAttractionItems(items);
  };

  // when user clicks on an attraction to add it to their itinerary
  const addToItinerary = (item) => {
    setSelectedItems([...selectedItems, item]);
  };

  // removing an attraction from the search results
  const removeAttraction = (id) => {
    setAttractionItems(attractionItems.filter(item => item.id !== id));
  };

  // removing an attraction from the selected itinerary
  const removeFromItinerary = (id) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  // pagination logic for when we have tons of results
  const totalPages = Math.min(10, Math.ceil(attractionItems.length / itemsPerPage));
  const paginatedItems = attractionItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // reset all the search fields and results
  const handleClear = () => {
    // wiping the slate clean!
    setAttractionItems([]);
    setSearchQuery('');
    setRadius('');
    setCurrentPage(1);
    setError(null);
  };

  return (
    <Container fluid className="mt-5">
      {isMobile ? (
        // mobile layout - everything stacked for small screens
        <Row>
          {/* search bar at the top cuz that's what the user needs first */}
          <Col xs={12} className="mb-4">
            <Form.Group className="mb-3">
              <InputGroup style={{ display: 'block', width: '100%' }}>
                <Form.Control
                  type="text"
                  placeholder="Search attractions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter'){
                      e.preventDefault();
                      handleRegenerate();
                    }
                  }}
                  className="bg-success border-0 rounded-pill search-input fs-9 py-3 text-white"
                  style={{ width: '100%', fontWeight: 'bold' }}
                />
              </InputGroup>
            </Form.Group>
          </Col>
          
          {/* four fields arranged in a  2x2 grid  */}
          <Col xs={6} className="mb-3">
            <Form.Group>
              <Form.Control 
                type="text" 
                placeholder="Specific destination" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="bg-light border-0 py-3"
                style={{ borderRadius: '14px' }}
              />
            </Form.Group>
          </Col>
          
          <Col xs={6} className="mb-3">
            <Form.Group>
              <Form.Control 
                type="number"
                placeholder="Search radius (meters)"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="bg-light border-0 py-3"
                style={{ borderRadius: '14px' }}
              />
            </Form.Group>
          </Col>
          
          <Col xs={6} className="mb-3">
            <Form.Group>
              <Form.Control 
                type="text"
                placeholder="Number of stops"
                className="bg-light border-0 py-3"
                style={{ borderRadius: '14px' }}
              />
            </Form.Group>
          </Col>
          
          <Col xs={6} className="mb-3">
            <Form.Group>
              <Form.Control 
                type="text"
                placeholder="Available time"
                className="bg-light border-0 py-3"
                style={{ borderRadius: '14px' }}
              />
            </Form.Group>
          </Col>
          
          {/* action buttons to search or start fresh */}
          <Col xs={12} className="mb-4">
            <div className="d-flex gap-2">
              <Button variant="primary" className="flex-grow-1" onClick={handleClear}>Clear</Button>
              <Button 
                id="regenerate-btn" 
                variant="primary" 
                className="flex-grow-1" 
                onClick={handleRegenerate}
              >
                Generate
              </Button>
            </div>
          </Col>
          
          {/* the draggable list of attractions */}
          <Col xs={12} className="mb-4">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="attractions">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="attractions-container"
                    style={{
                      maxHeight: '250px', // shorter for mobile so it doesn't take up the whole screen
                      overflow: 'auto',
                      paddingRight: '5px'
                    }}
                  >
                    {loading ? (
                      <p>Loading nearby attractions...</p>
                    ) : error ? (
                      <p className="text-danger">{error}</p>
                    ) : paginatedItems.length === 0 ? (
                      <p>No attractions found. Click "Generate" to search.</p>
                    ) : (
                      paginatedItems.map((item, index) => (
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
            
            {/* little page numbers for navigating through results */}
            <div className="d-flex justify-content-center mt-3">
              {[...Array(totalPages)].map((_, idx) => (
                <Button 
                  key={idx} 
                  variant={currentPage === idx + 1 ? 'primary' : 'outline-primary'} 
                  size="sm"
                  className="mx-1 rounded-circle"
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </Button>
              ))}
            </div>
          </Col>
          
          {/* where the user sees what they've picked */}
          <Col xs={12} className="mb-4">
            <div className="selected-items-container p-3 border rounded bg-light border-0 rounded-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
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
            </div>
            
            {/* these buttons are now outside the container */}
            <div className="mt-3 d-grid gap-2">
              <Button id="roadtrip-btn" variant="primary" onClick={handleRoadTripClick}>Take a road trip!</Button>
              <Button variant="primary" onClick={() => setSelectedItems([])}>
                Clear Itinerary
              </Button>
            </div>
          </Col>
          
          {/* just a simple card showing estimated travel time */}
          <Col xs={12}>
            <Card className="border-0 bg-light rounded-4 mt-3">
              <Card.Body>
                <h6>Estimated Time of Arrival</h6>
                <p className="text-muted">Description</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        // desktop layout - can use a more spacious 3-column design
        <Row>
          {/* left column for all our form inputs - users fill these in first */}
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

          {/* middle column has the search and results - the main action happens here */}
          <Col md={6}>
            <Form.Group className="mb-3">
              <InputGroup style={{ display: 'block', width: '100%' }}>
                <Form.Control
                  type="text"
                  placeholder="Search attractions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter'){
                      e.preventDefault();
                      handleRegenerate();
                    }
                  }}
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
                    style={{
                      maxHeight: '400px', // more space on desktop for results
                      overflow: 'auto',
                      paddingRight: '5px'
                    }}
                  >
                    {loading ? (
                      <p>Loading nearby attractions...</p>
                    ) : error ? (
                      <p className="text-danger">{error}</p>
                    ) : paginatedItems.length === 0 ? (
                      <p>No attractions found. Click "Generate" to search.</p>
                    ) : (
                      paginatedItems.map((item, index) => (
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

            <div className="d-flex justify-content-center mt-3">
              {[...Array(totalPages)].map((_, idx) => (
                <Button 
                  key={idx} 
                  variant={currentPage === idx + 1 ? 'primary' : 'outline-primary'} 
                  size="sm"
                  className="mx-1 rounded-circle"
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </Button>
              ))}
            </div>

            <div className="fixed-info-container">
              <Card className="border-0 bg-light rounded-4 mt-3">
                <Card.Body>
                  <h6>Estimated Time of Arrival</h6>
                  <p className="text-muted">Description</p>
                </Card.Body>
              </Card>
            </div>

            <div className="mt-3 d-flex gap-2">
              <Button variant="primary" className="flex-grow-1" onClick={handleClear}>Clear</Button>
              <Button 
                id="regenerate-btn" 
                variant="primary" 
                className="flex-grow-1" 
                onClick={handleRegenerate}
              >
                Generate
              </Button>
            </div>
          </Col>

          {/* right column shows what they've picked so far */}
          <Col md={3}>
            <div className="selected-items-container p-3 border rounded bg-light border-0 rounded-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
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
            </div>
            
            {/* buttons moved outside container here too for consistency */}
            <div className="mt-3 d-grid gap-2">
              <Button id="roadtrip-btn" variant="primary" onClick={handleRoadTripClick}>Take a road trip!</Button>
              <Button variant="primary" onClick={() => setSelectedItems([])}>
                Clear Itinerary
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Itinerary_Creation_Page;
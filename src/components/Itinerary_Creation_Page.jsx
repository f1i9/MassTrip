import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, InputGroup } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';

function Itinerary_Creation_Page() {
  const [destination, setDestination] = useState('');
  const [radius, setRadius] = useState('20000'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [attractionItems, setAttractionItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const itemsPerPage = 10;
  const maxItems = 100;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.searchQuery) {
      const query = location.state.searchQuery.trim();
      setSearchQuery(query); 
      if (query) {
        fetchNearbyAttractions(query);
      }
    }
  }, [location.state]);

  const handleRegenerate = () => {
    fetchNearbyAttractions();
  };

  const handleRoadTripClick = () => {
    navigate('/final_itinerary', {
      state: { selectedItems }  
    });
  };

  const fetchNearbyAttractions = async (overrideQuery) => {
    const queryToUse = overrideQuery || searchQuery;
    if (!queryToUse.trim()) {
      setError('Please enter a type of attraction to search for');
      return;
    }

    setLoading(true);
    setError(null);

    const useNearbySearch = async (latitude, longitude) => {
      try {
        const nearbyResponse = await axios.get('http://localhost:3001/api/nearby', {
          params: {
            lat: latitude,
            lng: longitude,
            radius: parseInt(radius) || 20000,
            type: searchQuery.toLowerCase().trim(),
          },
        });

        const attractions = nearbyResponse.data.slice(0, maxItems).map((place, index) => ({
          id: `item-${index}`,
          name: place.name,
          vicinity: place.vicinity,
          location: place.location,
        }));

        setAttractionItems(attractions);
        setCurrentPage(1);
      } catch (err) {
        console.error('Error fetching nearby attractions:', err);
        setError('Failed to fetch attractions. Please try again or check the attraction type.');
      } finally {
        setLoading(false);
      }
    };

    const fallbackToIP = async () => {
      try {
        const locationResponse = await axios.get('http://localhost:3001/api/location');
        const { latitude, longitude } = locationResponse.data;
        await useNearbySearch(latitude, longitude);
      } catch (err) {
        console.error('Fallback IP location failed:', err);
        setError('Failed to get location. Please allow GPS or try again later.');
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await useNearbySearch(latitude, longitude);
        },
        async (error) => {
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
      await fallbackToIP();
    }
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

  const totalPages = Math.min(10, Math.ceil(attractionItems.length / itemsPerPage));
  const paginatedItems = attractionItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleClear = () => {
    setAttractionItems([]);
    setSearchQuery('');
    setRadius('');
    setCurrentPage(1);
    setError(null);
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      console.log('Swiped left'); 
      setIsSidebarOpen(false);
    },
    onSwipedRight: () => {
      console.log('Swiped right');
      setIsSidebarOpen(true);
    },
    delta: 10, 
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false,
});

  return (
    <Container fluid className="mt-5">
      <Row>
        <Col md={3} className="mt-5 pt-4" />

        {/* Middle column - attraction list and controls */}
        <Col md={6}>
          <Form.Group className="mb-3">
            <InputGroup style={{ display: 'block', width: '100%' }}>
              <Form.Control
                type="text"
                placeholder="Search attractions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                // Evan Kuczynski
                // if enter button is pressed it has the same results of the generate button
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
                    maxHeight: '400px', // set the height of google api results
                    overflow: 'auto',
                    paddingRight: '5px' // avoiding scrollbar overlap
                  }}
                >
                  {loading ? (
                    <p>Loading nearby attractions...</p>
                  ) : error ? (
                    <p className="text-danger">{error}</p>
                  ) : paginatedItems.length === 0 ? (
                    <p>No attractions found. Click "Regenerate" to search.</p>
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
          {/* updated the button to clear search results EK 4/16 */}
          <Button variant="primary" className="flex-grow-1" onClick={handleClear}>Clear</Button> 
            <Button 
              id="regenerate-btn" 
              variant="primary" 
              className="flex-grow-1" 
              onClick={handleRegenerate}
            >
              {/* changed name of button from regenerate to generate */}
              Generate 
            </Button>
          </div>
        </Col>

   {/* Right column - current itinerary (desktop) */}
   <Col md={3} className="d-none d-md-block">
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
                  on-powered-by-xaiClick={() => removeFromItinerary(item.id)}
                >
                  ×
                </Button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 d-grid">
          <Button id="roadtrip-btn" variant="primary" onClick={handleRoadTripClick}>Take a road trip!</Button>
          <div className="mt-2 d-grid">
            <Button variant="outline-secondary" onClick={() => setSelectedItems([])}>
              Clear Itinerary
            </Button>
          </div>
        </div>
      </div>
    </Col>

  {/* Mobile sidebar toggle button */}
  <div
  className="d-md-none position-fixed top-0 end-0 mt-3 me-3 rounded-circle text-white border-0 text-center"
  style={{ zIndex: 1100, width: '40px', height: '40px', lineHeight: '40px', padding: 0, backgroundColor: 'transparent !important', cursor: 'pointer' }}
  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
>
▶
</div>

{/* Mobile sidebar */}
<div
  className={`d-md-none position-fixed top-0 end-0 h-100 p-3 ${isSidebarOpen ? '' : 'translate-x-full'}`}
  style={{ backgroundColor: "#009766", width: '80%', maxWidth: '300px', zIndex: 1000, transition: 'transform 0.3s ease-in-out', transform: isSidebarOpen ? 'translateX(0)' : 'translateX(100%)' }}
>
  <div className="selected-items-container" style={{paddingTop: '20px'}}>
    <h6 className="text-center text-white">Current Itinerary</h6>
    {selectedItems.length === 0 ? (
      <p className="text-white text-center">Add attractions to your itinerary</p>
    ) : (
      <ul className="list-group">
        {selectedItems.map((item, index) => (
          <li 
            key={`selected-${item.id}-${index}`} 
            className="list-group-item d-flex justify-content-between align-items-center border-0 mb-2 bg-white"
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
          <Button id="roadtrip-btn" variant="primary" onClick={handleRoadTripClick}>Take a road trip!</Button>
          <div className="mt-2 d-grid">
            <Button variant="outline-light" onClick={() => setSelectedItems([])}>
              Clear Itinerary
            </Button>
          </div>
        </div>
      </div>
    </div>

    {/* Overlay for mobile when sidebar is open */}
    <div
      className={`d-md-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 ${isSidebarOpen ? 'd-block' : 'd-none'}`}
      style={{ zIndex: 999 }}
      onClick={() => setIsSidebarOpen(false)}
    ></div>
      </Row>
    </Container>
  );
}

export default Itinerary_Creation_Page;

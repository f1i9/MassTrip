import { useState, useRef, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Image, Modal } from 'react-bootstrap';

function AddLandmark() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    category: '',
    images: [null, null, null]
  });
  
  const [previews, setPreviews] = useState([null, null, null]);
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addressInputRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

        if (!key) {
          throw new Error('Google Maps API key not found');
        }
    
        const existingScript = document.getElementById('google-maps-script');
        if (!existingScript) {
          const script = document.createElement('script');
          script.id = 'google-maps-script';
          script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
          script.async = true;
          script.defer = true;
          document.body.appendChild(script);
    
          script.onload = () => {
            setGoogleMapsLoaded(true);
          };
        } else {
          setGoogleMapsLoaded(true);
        }
      } catch (error) {
        console.error('Failed to load Google Maps:', error);
      }
    };
  
    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (googleMapsLoaded) {
      initAutocomplete();
    }
  }, [googleMapsLoaded]);

  useEffect(() => {
    if (googleMapsLoaded && coordinates.lat !== 0 && coordinates.lng !== 0) {
      if (!map) {
        initializeMap();
      } else {
        updateMarkerPosition();
      }
    }
  }, [coordinates, googleMapsLoaded]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const mapOptions = {
      center: { lat: coordinates.lat, lng: coordinates.lng },
      zoom: 15,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true
    };

    const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);

    const marker = new window.google.maps.Marker({
      position: { lat: coordinates.lat, lng: coordinates.lng },
      map: newMap,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
      title: 'Landmark Location'
    });
    markerRef.current = marker;

    marker.addListener('dragend', () => {
      const position = marker.getPosition();
      setCoordinates({
        lat: position.lat(),
        lng: position.lng()
      });
      
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: position }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setFormData(prev => ({
            ...prev,
            address: results[0].formatted_address
          }));
        }
      });
    });
  };

  const updateMarkerPosition = () => {
    if (markerRef.current && map) {
      markerRef.current.setPosition({ lat: coordinates.lat, lng: coordinates.lng });
      map.setCenter({ lat: coordinates.lat, lng: coordinates.lng });
    }
  };

  const initAutocomplete = () => {
    if (addressInputRef.current && window.google?.maps?.places) {
      const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['geocode']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place?.formatted_address) {
          setFormData(prev => ({
            ...prev,
            address: place.formatted_address,
          }));
          
          if (place.geometry && place.geometry.location) {
            setCoordinates({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            });
          }
        }
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategorySelect = (category) => {
    setFormData({ ...formData, category });
  };

  const handleImageChange = (index, file) => {
    try {
      const newImages = [...formData.images];
      newImages[index] = file;
      setFormData({ ...formData, images: newImages });
      
      if (file) {
        const newPreviews = [...previews];
        newPreviews[index] = URL.createObjectURL(file);
        setPreviews(newPreviews);
      }
    } catch (error) {
      console.error('Error handling image change:', error);
    }
  };

  const handleRemoveImage = (index) => {
    try {
      const newImages = [...formData.images];
      newImages[index] = null;
      setFormData({ ...formData, images: newImages });
      
      const newPreviews = [...previews];
      if (newPreviews[index]) {
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews[index] = null;
        setPreviews(newPreviews);
      }
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  const handleClickMap = (event) => {
    if (map && event.latLng) {
      const newPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      
      setCoordinates(newPosition);
      
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: newPosition }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setFormData(prev => ({
            ...prev,
            address: results[0].formatted_address
          }));
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('Submitting landmark:', { ...formData, coordinates });
      
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('address', formData.address);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('lat', coordinates.lat);
      submitData.append('lng', coordinates.lng);
      
      formData.images.forEach((image, index) => {
        if (image) {
          submitData.append(`image${index + 1}`, image);
        }
      });
      
      // Here you would send the data to your backend
      // const response = await fetch('/api/landmarks', {
      //   method: 'POST',
      //   body: submitData
      // });
      
      // if (response.ok) {
      //   // Handle success
      //   alert('Landmark added successfully!');
      //   handleReset();
      // }
      
      // Simulate API call for now
      setTimeout(() => {
        setShowModal(true);
        handleReset();
        setIsSubmitting(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting landmark:', error);
      alert('Failed to add landmark. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    try {
      setFormData({
        name: '',
        address: '',
        description: '',
        category: '',
        images: [null, null, null]
      });
      setPreviews([null, null, null]);
      setCoordinates({ lat: 0, lng: 0 });
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error resetting form:', error);
    }
  };

  useEffect(() => {
    return () => {
      previews.forEach(preview => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, [previews]);
  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = 'hidden';
    };
  }, []);

  const categoryIcons = {
    'Museum': '🏛️',
    'School': '🏫',
    'Mountain': '🏔️',
    'River': '🌊',
    'Skyscraper': '🏙️',
    'Bridge': '🌉',
    'Park': '🌳',
    'Temple': '🛕',
    'Castle': '🏰',
    'Lake': '💦'
  };
  
  const isFormValid = () => {
    return formData.name && 
           formData.address && 
           formData.category && 
           formData.images.some(img => img !== null);
  };

  const getFormProgress = () => {
    let progress = 0;
    if (formData.name) progress += 20;
    if (formData.address) progress += 20;
    if (formData.description) progress += 20;
    if (formData.category) progress += 20;
    if (formData.images.some(img => img !== null)) progress += 20;
    return progress;
  };

  const [showModal, setShowModal] = useState(false);

  return (
    <Container className="p-4 bg-light">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
            <Card.Header className="bg-success text-white p-3">
              <h3 className="m-0 d-flex align-items-center">
                <span className="me-2">⭐</span> Add A New Landmark
              </h3>
            </Card.Header>
            
            <Card.Body className="p-4">
              {/* Progress bar */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-muted small">Completion Progress</span>
                  <span className="badge bg-primary">{getFormProgress()}%</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-primary" 
                    role="progressbar" 
                    style={{ width: `${getFormProgress()}%` }}
                    aria-valuenow={getFormProgress()} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-primary d-flex align-items-center">
                    <span className="me-2">📝</span> Landmark Name
                  </Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter landmark name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="py-2"
                    />
                  </div>
                  <div className="form-text">Give your landmark a descriptive, memorable name</div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-primary d-flex align-items-center">
                    <span className="me-2">📍</span> Location
                  </Form.Label>
                  <div className="input-group">
                    <Form.Control
                      ref={addressInputRef}
                      type="text"
                      name="address"
                      placeholder="Start typing address..."
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="py-2"
                    />
                    {formData.address && (
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => {
                          setFormData({...formData, address: ''});
                          setCoordinates({ lat: 0, lng: 0 });
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="form-text">Type an address to auto-complete or use the map to pin the location</div>
                </Form.Group>

                {/* Map Component */}
                {coordinates.lat !== 0 && coordinates.lng !== 0 && (
                  <div className="mb-4">
                    <div className="card border">
                      <div className="card-header bg-light d-flex justify-content-between align-items-center py-2">
                        <h6 className="mb-0 d-flex align-items-center">
                          <span className="me-2">🗺️</span> Location Map
                        </h6>
                        <div className="text-muted small">Drag marker to adjust location</div>
                      </div>
                      <div 
                        ref={mapRef} 
                        style={{ height: '300px', width: '100%'}}
                        className="position-relative"
                      ></div>

                      <div className="card-footer bg-light py-2">
                        <div className="d-flex align-items-center justify-content-between">
                          <small className="text-muted">
                            Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                          </small>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => {
                              if (map) {
                                map.setCenter({ lat: coordinates.lat, lng: coordinates.lng });
                                map.setZoom(15);
                              }
                            }}
                          >
                            Center Map
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="form-text mt-2">
                      <span className="text-primary fw-bold">Tip:</span> Click on the map or drag the marker to adjust the exact location
                    </div>
                  </div>
                )}

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-primary d-flex align-items-center">
                    <span className="me-2">📄</span> Description
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    placeholder="Share what makes this landmark special..."
                    value={formData.description}
                    onChange={handleChange}
                    className="py-2"
                  />
                  <div className="form-text">Provide details about history, features, or reasons to visit</div>
                </Form.Group>

                <Row className="mb-4">
                  <Col md={12} lg={6} className="mb-4 mb-lg-0">
                    <h5 className="fw-bold text-primary d-flex align-items-center mb-3">
                      <span className="me-2">🏷️</span> Category
                    </h5>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {Object.keys(categoryIcons).map((cat) => (
                        <Button
                          key={cat}
                          variant={formData.category === cat ? 'primary' : 'outline-primary'}
                          size="sm"
                          onClick={() => handleCategorySelect(cat)}
                          className="d-flex align-items-center py-2 px-3"
                        >
                          <span className="me-2">{categoryIcons[cat]}</span> {cat}
                        </Button>
                      ))}
                    </div>
                    <div className="form-text">Select the category that best fits your landmark</div>
                  </Col>

                  <Col md={12} lg={6}>
                    <h5 className="fw-bold text-primary d-flex align-items-center mb-3">
                      <span className="me-2">📸</span> Images
                    </h5>
                    <div className="mb-3">
                      {['Primary Image', 'Secondary Image', 'Additional Image'].map((label, index) => (
                        <div key={index} className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <Form.Label className="mb-0 small fw-bold">{label}</Form.Label>
                            {previews[index] && (
                              <Button 
                                variant="link" 
                                className="p-0 text-danger" 
                                size="sm"
                                onClick={() => handleRemoveImage(index)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(index, e.target.files[0])}
                            className="form-control-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>

                {/* Image Previews in a row */}
                <div className="mb-4">
                  <Row className="g-3">
                    {previews.map((preview, index) => (
                      <Col xs={12} md={4} key={index}>
                        {preview ? (
                          <div className="position-relative">
                            <Image
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              fluid
                              rounded
                              className="shadow-sm border"
                              style={{ 
                                objectFit: 'cover', 
                                height: '180px', 
                                width: '100%'
                              }}
                            />
                            <div className="position-absolute top-0 end-0 m-2">
                              <Button 
                                variant="light" 
                                size="sm" 
                                className="rounded-circle p-1"
                                onClick={() => handleRemoveImage(index)}
                              >
                                ✕
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="bg-light rounded d-flex align-items-center justify-content-center border" 
                            style={{ 
                              height: '180px',
                              backgroundColor: '#f8f9fa'
                            }}
                          >
                            <div className="text-center text-muted">
                              <div style={{ fontSize: '2rem', opacity: 0.5 }}>📤</div>
                              <div className="small">Image {index + 1}</div>
                            </div>
                          </div>
                        )}
                      </Col>
                    ))}
                  </Row>
                </div>

                <hr className="my-4" />

                <div className="d-flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline-secondary" 
                    className="px-4 py-2"
                    onClick={handleReset}
                    disabled={isSubmitting}
                  >
                    Reset Form
                  </Button>
                  <Button 
                    type="submit" 
                    variant="success" 
                    className="px-4 py-2 flex-grow-1"
                    disabled={!isFormValid() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      <>Submit Landmark</>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal 
  show={showModal} 
  onHide={() => setShowModal(false)}
  centered
>
  <Modal.Header closeButton className="bg-success text-white">
    <Modal.Title>Success!</Modal.Title>
  </Modal.Header>
  <Modal.Body className="text-center p-4">
    <div className="mb-3" style={{ fontSize: '3rem' }}>✅</div>
    <h4>Thank you. Your landmark has been submitted and awaiting review.</h4>
    <p className="text-muted mt-3">We'll notify you once it's approved.</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="success" onClick={() => setShowModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>
    </Container>
  );
}

export default AddLandmark;

import { useState, useEffect, useRef } from 'react';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import '../styles/home.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [query, setQuery] = useState("");
  const [inputError, setInputError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [shouldFetchSuggestions, setShouldFetchSuggestions] = useState(true);
  const [locationChosen, setLocationChosen] = useState(false);
  
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Allows only letters, numbers, spaces, commas, periods, dashes
  const allowedRegex = /^[a-zA-Z0-9\s,.-]*$/;

  // Validate input on every change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!allowedRegex.test(value)) {
      setInputError("Valid location required");
      setSuggestions([]);
      setShouldFetchSuggestions(false);
    } else {
      setInputError("");
      setShouldFetchSuggestions(true);
      // Reset this flag if user makes changes after selecting suggestion
      setLocationChosen(false);
    }
    // Clear the location selection error if user continues typing
    setLocationError("");
  };

  // Fetch autocomplete suggestions from the backend when input is valid
  useEffect(() => {
    if (query.length > 2 && shouldFetchSuggestions) {
      const fetchSuggestions = async () => {
        try {
          const response = await axios.get('/api/autocomplete', {
            params: { input: query }
          });
          // Filter suggestions to ensure they relate to Massachusetts
          const filteredSuggestions = response.data.filter((suggestion) =>
            suggestion.description.includes('MA') || suggestion.description.includes('Massachusetts')
          );
          setSuggestions(filteredSuggestions);
        } catch (error) {
          console.error('Error fetching autocomplete data:', error);
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [query, shouldFetchSuggestions]);

  // Check for valid selection before proceeding
  const handleSearch = () => {
    if (inputError) return;
    if (!locationChosen) {
      setLocationError("Choose a location");
      return;
    }
    console.log("Searching for:", query);
    navigate('/itinerary_creation', { state: { searchQuery: query } });
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      if (activeIndex < suggestions.length - 1) {
        setActiveIndex(activeIndex + 1);
      }
    } else if (e.key === 'ArrowUp') {
      if (activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
    } else if (e.key === 'Enter') {
      // If location has already been chosen, pressing Enter executes 'Go' action
      if (locationChosen) {
        handleSearch();
      } else if (activeIndex >= 0) {
        setQuery(suggestions[activeIndex].description);
        setSuggestions([]);
        setShouldFetchSuggestions(false);
        setLocationChosen(true);
        setLocationError(""); // Clear error when location is chosen.
      } else {
        handleSearch();
      }
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.description);
    setSuggestions([]);
    setShouldFetchSuggestions(false);
    setLocationChosen(true);
    setLocationError(""); // Clear error when location is chosen
  };

  // Handle mouse hover for suggestion highlighting
  const handleMouseEnter = (index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(-1);
  };

  // Close suggestions if user clicks outside the input box
  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <Container className="mt-5 home-background">
      <h3 className="text-center mb-2 text-white" style={{ marginTop: '140px' }}>
        Plan your perfect road trip across Massachusetts!
      </h3>
      <h4 className="text-center mb-2 text-white">
        Explore landmarks, get routes, and discover new places to visit.
      </h4>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          boxSizing: 'border-box',
        }}
      >
        {/* Left-aligned copyright */}
        <div style={{ width: '33%', textAlign: 'left' }}>
          <p className="text-white" style={{ margin: 0 }}>
            &copy; {new Date().getFullYear()} MassTrip
          </p>
        </div>

        {/* Centered photo credit */}
        <div style={{ width: '33%', textAlign: 'center' }}>
          <p className="text-white" style={{ margin: 0 }}>
            Photo by{' '}
            <a
              href="https://unsplash.com/@geraninmo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
              target="_blank"
              rel="noopener noreferrer"
            >
              Geranimo
            </a>{' '}
            on{' '}
            <a
              href="https://unsplash.com/photos/aerial-shot-of-road-surrounded-by-green-trees-qzgN45hseN0?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
          </p>
        </div>

        {/* Empty right side to maintain center alignment */}
        <div style={{ width: '33%' }}></div>
      </div>
      
      <div className="d-flex justify-content-center" style={{ position: 'relative', marginTop: '50px' }}>
        {(inputError || locationError) && (
          <div
            className="text-danger text-center"
            style={{
              position: 'absolute',
              top: '-30px',
              width: '100%'
            }}
          >
            {inputError || locationError}
          </div>
        )}
        <InputGroup style={{ maxWidth: '540px', width: '100%' }}>
          <Form.Control
            ref={inputRef}
            type="text"
            placeholder="Where is your starting location?"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            style={{ padding: '10px' }}
          />
          <Button variant="primary" onClick={handleSearch}>
            Go
          </Button>
        </InputGroup>
      </div>

      {suggestions.length > 0 && (
        <div style={{ maxWidth: '540px', width: '100%', margin: '0 auto' }}>
          <ul className="list-group" style={{ width: '100%' }}>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className={`list-group-item ${activeIndex === index ? 'active' : ''}`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: 'pointer' }}
              >
                {suggestion.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
}

export default Home;

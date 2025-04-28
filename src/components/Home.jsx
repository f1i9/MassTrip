import { useState, useEffect, useRef } from 'react';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import axios from 'axios';

function Home() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [shouldFetchSuggestions, setShouldFetchSuggestions] = useState(true);
  const inputRef = useRef(null);

  // Fetch autocomplete suggestions from backend
  useEffect(() => {
    if (query.length > 2 && shouldFetchSuggestions) {
      const fetchSuggestions = async () => {
        try {
          const response = await axios.get('http://localhost:3001/api/autocomplete', {
            params: { input: query }
          });
          setSuggestions(response.data);
          setActiveIndex(-1);
        } catch (error) {
          console.error('Error fetching autocomplete data:', error);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [query, shouldFetchSuggestions]);

  const handleSearch = () => {
    console.log("Searching for:", query);
  };

  // Handle keyboard navigation (arrows and enter)
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
      if (activeIndex >= 0) {
        setQuery(suggestions[activeIndex].description);
        setSuggestions([]);
        setShouldFetchSuggestions(false);
      }
    }
  };

  // Handle click on suggestion
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.description);
    setSuggestions([]);
    setShouldFetchSuggestions(false);
  };

  // Handle mouse hover on suggestions
  const handleMouseEnter = (index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(-1);
  };

  // When the input is changed, re-enable fetching suggestions
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShouldFetchSuggestions(true);
  };

  // Close suggestions if the user clicks outside input box
  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <Container className="mt-5">
      <h3 className="text-center mb-2">Plan your perfect road trip across Massachusetts!</h3>
      <h4 className="text-center mb-2">Explore landmarks, get routes, and discover new places to visit.</h4>

      <div className="d-flex justify-content-center">
        <InputGroup style={{ maxWidth: '540px', width: '100%', marginTop: '20px' }}>
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
        <div className="mt-2" style={{ maxWidth: '540px', width: '100%', margin: '0 auto' }}>
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

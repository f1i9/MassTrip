import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { jsPDF } from 'jspdf';
import { useJsApiLoader } from '@react-google-maps/api';

function Final_Itinerary() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const location = useLocation();
  const initialItems = location.state?.selectedItems || [];

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });
  
  const mapContainerStyle = {
    width: '100%',
    height: '85vh',
    borderRadius: '20px'
  };

  const defaultCenter = {
    lat: 42.3601,
    lng: -71.0589,
  };

  const center = selectedItems.length > 0 && selectedItems[0].location
    ? {
        lat: selectedItems[0].location.lat,
        lng: selectedItems[0].location.lng,
      }
    : defaultCenter;

  const containerStyle = {
    display: 'flex',
    height: '100vh',
  };

  const leftStyle = {
    width: '70%',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const rightStyle = {
    width: '30%',
    padding: '20px',
    backgroundColor: '#d0d0d0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const contentStyle = {
    marginBottom: '20px',
    width: '100%',
  };

  const listStyle = {
    marginBottom: '20px',
    maxHeight: '600px',
    overflowY: 'auto',
    width: '100%',
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '15px',
    marginBottom: '15px',
    width: '100%',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    alignSelf: 'center',
  };

  const buttonHoverStyle = {
    backgroundColor: '#45a049',
  };

  // Fetch address for lat/lng
  const fetchAddressFromLatLng = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return 'Address not found';
  };

  // Populate addresses
  useEffect(() => {
    const enhanceWithAddresses = async () => {
      const itemsWithAddress = await Promise.all(
        initialItems.map(async (item) => {
          if (item.location && !item.address) {
            const address = await fetchAddressFromLatLng(item.location.lat, item.location.lng);
            return { ...item, address };
          }
          return item;
        })
      );
      setSelectedItems(itemsWithAddress);
    };
  
    enhanceWithAddresses();
  }, []);  

  // Get directions once map is ready and items loaded
  useEffect(() => {
    if (!mapLoaded || selectedItems.length < 2) return;

    const directionsService = new window.google.maps.DirectionsService();

    const origin = selectedItems[0].location;
    const destination = selectedItems[selectedItems.length - 1].location;
    const waypoints = selectedItems.slice(1, -1).map(item => ({
      location: item.location,
      stopover: true
    }));

    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: 'DRIVING'
      },
      (result, status) => {
        if (status === 'OK') {
          setDirectionsResponse(result);
          const totalSeconds = result.routes[0].legs.reduce(
            (sum, leg) => sum + leg.duration.value,
            0
          );

          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);

          setTotalTime(`${hours}h ${minutes}m`);
        } else {
          console.error('Directions request failed due to ' + status);
        }
      }
    );
  }, [selectedItems, mapLoaded]);

  // Generate link to Google Maps
  const buildGoogleMapsLink = () => {
    if (selectedItems.length < 2) return '#';
  
    const origin = `${selectedItems[0].location.lat},${selectedItems[0].location.lng}`;
    const destination = `${selectedItems[selectedItems.length - 1].location.lat},${selectedItems[selectedItems.length - 1].location.lng}`;
    const waypoints = selectedItems
      .slice(1, -1)
      .map(item => `${item.location.lat},${item.location.lng}`)
      .join('|');
  
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
  };  

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
  
    const title = 'Road Trip Itinerary';
    doc.setFontSize(18);
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 20);
  
    const dateStr = `Created ${new Date().toLocaleDateString()}`;
    doc.setFontSize(12);
    const dateWidth = doc.getTextWidth(dateStr);
    doc.text(dateStr, (pageWidth - dateWidth) / 2, 28);
  
    let yPosition = 40;
  
    selectedItems.forEach((item, index) => {
      const label = String.fromCharCode(65 + index);
      doc.setFontSize(12);
      doc.text(`${label}. ${item.name}`, 20, yPosition);
      doc.text(`${item.address || 'Loading...'}`, 25, yPosition + 10);
      yPosition += 25;
    });
  
    doc.setFontSize(14);
    doc.text(`Total Time: ${totalTime || 'Calculating...'}`, 20, yPosition);
    doc.save('itinerary.pdf');
  };
  

  return (
    <div style={containerStyle}>
      <div style={leftStyle}>
        <div style={contentStyle}>
        {isLoaded && (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={12}
              onLoad={() => setMapLoaded(true)}
            >
              {directionsResponse && (
                <DirectionsRenderer
                  options={{
                    directions: directionsResponse,
                    preserveViewport: true,
                  }}
                />
              )}
            </GoogleMap>
          )}
        </div>
        <a href={buildGoogleMapsLink()} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <button
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
          >
            Start Trip in Google Maps
          </button>
        </a>
      </div>
      <div style={rightStyle}>
        <div style={listStyle}>
          <h2 style={{ textAlign: 'center' }}>Final Itinerary</h2>
          <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
            {selectedItems.length > 0 ? (
              selectedItems.map((item, index) => {
                const label = String.fromCharCode(65 + index); // A = 65
                return (
                  <li key={index}>
                    <div style={cardStyle}>
                      <h6>{label}. {item.name}</h6>
                      <p>{item.address || 'Loading address...'}</p>
                    </div>
                  </li>
                );
              })
            ) : (
              <p style={{ textAlign: 'center' }}>No items in your itinerary</p>
            )}
          </ul>
        </div>
        <div style={{ ...cardStyle, marginTop: 'auto' }}>
          <h6 style={{ textAlign: 'center' }}>
            Total Time: {totalTime ? totalTime : 'Calculating...'}
          </h6>
        </div>
        <button
          style={buttonStyle}
          onClick={generatePDF}
          onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
        >
          Download (PDF)
        </button>
      </div>
    </div>
  );
}

export default Final_Itinerary;

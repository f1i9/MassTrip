import { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

function Final_Itinerary() {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };

  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

  console.log("Google Maps API Key:", GOOGLE_MAPS_API_KEY);

  const mapContainerStyle = {
    width: '100%',
    height: '600px', 
    borderRadius: '20px'
  };


  const defaultCenter = {
    lat: 37.7749,
    lng: -122.4194,
  };

  const center = selectedItems.length > 0 && selectedItems[0].geometry?.location
    ? {
        lat: selectedItems[0].geometry.location.lat,
        lng: selectedItems[0].geometry.location.lng,
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

  return (
    <div style={containerStyle}>
      <div style={leftStyle}>
        <div style={contentStyle}>
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={12} // Adjust zoom level as needed
            >
              {/* Add markers for each selected item */}
              {selectedItems.map((item, index) =>
                item.geometry?.location ? (
                  <Marker
                    key={index}
                    position={{
                      lat: item.geometry.location.lat,
                      lng: item.geometry.location.lng,
                    }}
                    title={item.name}
                  />
                ) : null
              )}
            </GoogleMap>
          </LoadScript>
        </div>
        <button
          style={buttonStyle}
          onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
        >
          Left Button
        </button>
      </div>
      <div style={rightStyle}>
        <div style={listStyle}>
          <h2 style={{ textAlign: 'center' }}>Final Itinerary</h2>
          <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
            {selectedItems.length > 0 ? (
              selectedItems.map((item, index) => (
                <li key={index}>
                  <div style={cardStyle}>
                    <h6>{item.name}</h6>
                    <p>{item.vicinity}</p>
                  </div>
                </li>
              ))
            ) : (
              <p>No items in your itinerary.</p>
            )}
          </ul>
        </div>
        <div style={cardStyle}>
          <h6 style={{ textAlign: 'center' }}>Total Time:</h6>
        </div>
        <button
          style={buttonStyle}
          onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
        >
          Right Button
        </button>
      </div>
    </div>
  );
}

export default Final_Itinerary;
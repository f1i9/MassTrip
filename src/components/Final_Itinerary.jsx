import { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';



function Final_Itinerary() {

    const location = useLocation();
    const selectedItems = location.state?.selectedItems || [];  // Get the selected items from the state, default to empty array

    const containerStyle = {
        display: 'flex',
        height: '100vh',
      };
    
      const leftStyle = {
        width: '70%',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Space out content and button
        alignItems: 'center', // Center the button horizontally
      };
    
      const rightStyle = {
        width: '30%',
        padding: '20px',
        backgroundColor: '#d0d0d0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Space out content and button
        alignItems: 'center', // Center the button horizontally
      };
    
      const contentStyle = {
        marginBottom: '20px',
      };
    
      const listStyle = {
        marginBottom: '20px',
        maxHeight: '600px', // Set a fixed height for the list container
        overflowY: 'auto',  // Enable vertical scrolling when content overflows
        width: '100%', // Ensures it takes up full width of the container
      };
    
      const cardStyle = {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '15px',
        marginBottom: '15px',
        width: '100%', // Makes the card take up full width of the parent container
      };
    
      const buttonStyle = {
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        alignSelf: 'center', // Center button horizontally
      };
    
      const buttonHoverStyle = {
        backgroundColor: '#45a049',
      };

  return (
    <div style={containerStyle}>
      <div style={leftStyle}>
        <div style={contentStyle}>
          <h2>Google Maps</h2>
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
            {/* added the locations wanted by the user to the final interary */}
            {selectedItems.length > 0 ? (
              selectedItems.map((item, index) => (
                <li key={index}>
                  <div style={cardStyle}>
                    <h6>{item.name}</h6>
                    <p>{item.vicinity}</p>
                  </div>
                </li>
              ))
            ) : (<p>No items in your itinerary.</p>
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
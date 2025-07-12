import React, { useState, useEffect } from 'react';
const ActivityStatusQueue: React.FC = () => {
  const [currentPosition, setCurrentPosition] = useState(0);

  const handleIncrement = () => {
    // Increment the current position
    setCurrentPosition(prevPosition => prevPosition + 1);
  };

  const handleDecrement = () => {
    setCurrentPosition(prevPosition => prevPosition - 1);
  };

  return (
    <div>
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        {/* Container for buttons with relative positioning */}
        <button
          onClick={handleIncrement}
          style={{
            position: 'absolute', // Absolute positioning
            left: '10px', // Position from the left
            top: '50%', // Align vertically
            transform: 'translateY(-50%)', // Center vertically
            fontSize: '2em',
            backgroundColor: 'lightblue',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          +
        </button>
        <button
          onClick={handleDecrement}
          style={{
            position: 'absolute', // Absolute positioning
            left: '80px', // Position from the left, adjust as needed
            top: '50%', // Align vertically
            transform: 'translateY(-50%)', // Center vertically
            fontSize: '2em',
            backgroundColor: 'salmon',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
          }}>
          -
        </button>
      </div>
      <div id="queue_status_container">
        {/* Conditional rendering based on currentPosition */}
        {currentPosition > 3 ? (
          // If currentPosition is greater than 3
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
                  fontSize: '1.5em', // Adjusted font size for number inside div
                  marginRight: '4rem',
                  display: 'flex',
                  justifyContent: 'center', // Center content horizontally
                  alignItems: 'center', // Center content vertically
                  width: '50px', // Set a fixed width for the circle
                  height: '50px', // Set a fixed height for the circle
// Add a border for visibility
                }}
                >I</div>
            <div style={{
                  fontSize: '1.5em', // Adjusted font size for number inside div
                  marginRight: '4rem',
                  display: 'flex',
                  justifyContent: 'center', // Center content horizontally
                  alignItems: 'center', // Center content vertically
                  width: '50px', // Set a fixed width for the circle
                  height: '50px', // Set a fixed height for the circle
// Add a border for visibility
                }}
                >----</div>
            <div style={{
                  fontSize: '1.5em', // Adjusted font size for number inside div
                  marginRight: '4rem',
                  display: 'flex',
                  justifyContent: 'center', // Center content horizontally
                  alignItems: 'center', // Center content vertically
                  width: '50px', // Set a fixed width for the circle
                  height: '50px', // Set a fixed height for the circle
// Add a border for visibility
                }}
                >{currentPosition}</div>
            <div style={{
                  fontSize: '1.5em', // Adjusted font size for number inside div
                  marginRight: '4rem',
                  display: 'flex',
                  justifyContent: 'center', // Center content horizontally
                  alignItems: 'center', // Center content vertically
                  width: '50px', // Set a fixed width for the circle
                  height: '50px', // Set a fixed height for the circle
// Add a border for visibility
                }}
                >----</div>
          </div>
        ) : (
          // If currentPosition is 3 or less, render O/I queue
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {[0, 1, 2, 3].map((position) => (
              <div
                id="queue_person"
                key={position}
                style={{
                  fontSize: '1.5em', // Adjusted font size for number inside div
                  marginRight: '4rem',
                  display: 'flex',
                  justifyContent: 'center', // Center content horizontally
                  alignItems: 'center', // Center content vertically
                  width: '50px', // Set a fixed width for the circle
                  height: '50px', // Set a fixed height for the circle
                  borderRadius: '50%', // Make the div round
                  border: '2px solid black', // Add a border for visibility
                }}
              >
                {/* Logic to position 'I': 0 is rightmost, 3 is leftmost */}
                {currentPosition === (3 - position) ? 'I' : 'O'}
              </div>
            ))
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityStatusQueue;

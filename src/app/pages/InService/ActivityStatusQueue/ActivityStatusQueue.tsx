import React, { useState } from 'react';

const ActivityStatusQueue: React.FC = () => {
  const [currentPosition, setCurrentPosition] = useState(0);

  const handleIncrement = () => {
    setCurrentPosition(prevPosition => prevPosition + 1);
  };

  const handleDecrement = () => {
    setCurrentPosition(prevPosition => prevPosition - 1);
  };

  return (
    <div>
      <button
        onClick={handleIncrement}
        style={{
          fontSize: '2em',
          backgroundColor: 'lightblue',
          marginRight: '10px',
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
          fontSize: '2em',
          backgroundColor: 'salmon',
          padding: '10px',
          border: 'none',
          borderRadius: '5px',
        }}>
        -
      </button>
      <div id="queue_status_container">
        {/* Conditional rendering based on currentPosition */}
        {currentPosition > 3 ? (
          // If currentPosition is greater than 3
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '3em' }}>I</span>
            <span style={{ marginLeft: '20px' }}>----</span>
            <span style={{ fontSize: '2em', margin: '0 20px' }}>{currentPosition}</span>
            <span>----</span>
          </div>
        ) : (
          // If currentPosition is 3 or less, render O/I queue
          [0, 1, 2, 3].map((position) => (
            <span key={position} style={{ fontSize: '3em', marginRight: '10px', display: 'inline-block' }}>
              {/* Logic to position 'I': 0 is rightmost, 3 is leftmost */}
              {currentPosition === (3 - position) ? 'I' : 'O'}
          </span>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityStatusQueue;

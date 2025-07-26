import React from 'react';

interface ClientFeatureExplainerProps {
  closeModal: () => void;
  handleYes: () => void;
}

const ClientFeatureExplainer: React.FC<ClientFeatureExplainerProps> = ({ closeModal, handleYes }) => {
  const handleNoClick = () => {
    closeModal();
  };

  return (
    <div id="client-feature-explainer-container">
      {/* Content for ClientFeatureExplainer */}
      <h2>Client Feature Explainer</h2>
      <p>This component will explain client features.</p>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
        <button onClick={handleYes}>Yes</button>
        <button onClick={handleNoClick}>No</button>
      </div>
    </div>
  );
};

export default ClientFeatureExplainer;
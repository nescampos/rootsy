import React from 'react';
import CoinUpdateForm from '../components/CoinUpdateForm';

function UpdateProject() {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2>Update Project / Currency</h2>
      <CoinUpdateForm />
    </div>
  );
}

export default UpdateProject; 
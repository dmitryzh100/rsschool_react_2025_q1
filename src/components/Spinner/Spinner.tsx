import React from 'react';
import './style.css';

const Spinner: React.FC = () => {
  return (
    <div className="spinner">
      <div className="visually-hidden">Loading</div>
    </div>
  );
};

export default Spinner;

import React from 'react';

const Fallback: React.FC = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div>
      <h2>Something went wrong.</h2>
      <p>Please try refreshing the page or searching again.</p>
      <button onClick={handleRefresh}>Back</button>
    </div>
  );
};

export default Fallback;

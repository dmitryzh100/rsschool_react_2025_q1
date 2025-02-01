import React from 'react';

class Fallback extends React.Component {
  handleRefresh() {
    window.location.reload();
  }

  render() {
    return (
      <div>
        <h2>Something went wrong.</h2>
        <p>Please try refreshing the page or searching again.</p>
        <button onClick={this.handleRefresh}>Back</button>
      </div>
    );
  }
}

export default Fallback;

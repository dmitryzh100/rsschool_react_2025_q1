import React from 'react';

import './style.scss';

interface ErrorMsgProps {
  error: string;
}

class ErrorMsg extends React.Component<ErrorMsgProps> {
  render() {
    return (
      <div className="error">
        <p>Ooops! Something wrong happened &#128546;</p>
        <p>Error details: {this.props.error}</p>
      </div>
    );
  }
}

export default ErrorMsg;

import React from 'react';
import './style.scss';

interface ErrorMsgProps {
  error: string;
}

const ErrorMsg: React.FC<ErrorMsgProps> = ({ error }) => {
  return (
    <div className="error">
      <p>Ooops! Something wrong happened &#128546;</p>
      <p>Error details: {error}</p>
    </div>
  );
};

export default ErrorMsg;

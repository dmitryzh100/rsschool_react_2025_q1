import React from 'react';

import './style.scss';

// Extend native input attributes
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

class Input extends React.Component<InputProps> {
  static defaultProps = {
    type: 'text',
  };

  render() {
    const { label, className, ...rest } = this.props;

    return (
      <div className={`input-container ${className || ''}`}>
        {label && <label className="input-label">{label}</label>}
        <input className="input" {...rest} />
      </div>
    );
  }
}

export default Input;

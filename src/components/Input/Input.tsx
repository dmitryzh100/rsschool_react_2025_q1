import React from 'react';
import './style.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  className = '',
  type = 'text',
  ...rest
}) => {
  return (
    <div className={`input-container ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <input className="input" type={type} {...rest} />
    </div>
  );
};

export default Input;

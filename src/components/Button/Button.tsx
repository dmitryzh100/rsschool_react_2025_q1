import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  label = 'Button',
  children,
  className = '',
  ...rest
}) => {
  return (
    <button className={className} {...rest}>
      {children || label}
    </button>
  );
};

export default Button;

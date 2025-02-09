import React from 'react';
import './style.scss';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  className?: string;
}

const Form: React.FC<FormProps> = ({ children, className = '', ...rest }) => {
  return (
    <form className={className} {...rest}>
      {children}
    </form>
  );
};

export default Form;

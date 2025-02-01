import React from 'react';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  className?: string;
}

class Form extends React.Component<FormProps> {
  render() {
    const { children, className, ...rest } = this.props;

    return (
      <form className={`universal-form ${className || ''}`} {...rest}>
        {children}
      </form>
    );
  }
}

export default Form;

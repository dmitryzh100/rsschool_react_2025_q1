import React from 'react';

import './style.scss';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  className?: string;
}

class Form extends React.Component<FormProps> {
  render() {
    const { children, className, ...rest } = this.props;

    return (
      <form className={className || ''} {...rest}>
        {children}
      </form>
    );
  }
}

export default Form;

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

class Button extends React.Component<ButtonProps> {
  static defaultProps = {
    label: 'Button',
  };

  render() {
    const { label, children, className, ...rest } = this.props;

    return (
      <button className={className || ''} {...rest}>
        {children || label}
      </button>
    );
  }
}

export default Button;

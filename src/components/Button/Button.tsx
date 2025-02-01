import React from 'react';

// Extend native button attributes
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string; // Optional: Defaults to "Button"
  className?: string; // Allows custom styles
  children?: React.ReactNode; // Allows custom content inside the button
}

class Button extends React.Component<ButtonProps> {
  static defaultProps = {
    label: 'Button',
  };

  render() {
    const { label, children, className, ...rest } = this.props;

    return (
      <button className={className || ''} {...rest}>
        {children || label} {/* Allows custom content or default text */}
      </button>
    );
  }
}

export default Button;

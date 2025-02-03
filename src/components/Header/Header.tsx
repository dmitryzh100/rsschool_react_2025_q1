import React from 'react';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

class Header extends React.Component<HeaderProps> {
  render() {
    const { children, className, ...rest } = this.props;

    return (
      <header className={className || ''} {...rest}>
        {children}
      </header>
    );
  }
}

export default Header;

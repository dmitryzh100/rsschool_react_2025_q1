import React from 'react';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <header className={className} {...rest}>
      {children}
    </header>
  );
};

export default Header;

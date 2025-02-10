import React from 'react';
import './style.scss';

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

const Main: React.FC<MainProps> = ({ children, className = '', ...rest }) => {
  return (
    <main className={className} {...rest}>
      {children}
    </main>
  );
};

export default Main;

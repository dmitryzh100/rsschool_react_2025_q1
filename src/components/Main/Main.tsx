import React from 'react';

import './style.scss';

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

class Main extends React.Component<MainProps> {
  render() {
    const { children, className, ...rest } = this.props;

    return (
      <main className={className || ''} {...rest}>
        {children}
      </main>
    );
  }
}

export default Main;

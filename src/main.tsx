import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import App from './App.tsx';
import MyErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MyErrorBoundary>
        <App />
      </MyErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);

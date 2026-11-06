import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global Google Maps Auth & Error Handler per GMP Guidelines
(window as any).gm_authFailure = () => {
  window.dispatchEvent(new CustomEvent('gmp-auth-failure'));
  window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
};

const origError = console.error;
console.error = (...args: unknown[]) => {
  origError.apply(console, args);
  const msg = args.map((a) => String(a)).join(' ');
  if (msg.includes('OverQuotaMapError') || msg.includes('QuotaExceededError')) {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
  }
  if (msg.includes('InvalidKeyMapError') || msg.includes('gm_authFailure')) {
    window.dispatchEvent(new CustomEvent('gmp-auth-failure'));
  }
};

window.addEventListener('error', (event) => {
  const msg = event.message || '';
  if (
    msg.includes('InvalidKeyMapError') ||
    msg.includes('Google Maps') ||
    (msg === 'Script error.' && (event.filename?.includes('maps.googleapis.com') || document.querySelector('script[src*="maps.googleapis.com"]')))
  ) {
    window.dispatchEvent(new CustomEvent('gmp-auth-failure'));
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);


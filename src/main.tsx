import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';
import { log } from './utils/logger';

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('root 요소를 찾을 수 없습니다.');
}

log('info', '앱 마운트');

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

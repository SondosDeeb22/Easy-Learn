// ============================================
//? Import
// ============================================
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';

// ============================================

// The `!` non-null assertion tells TypeScript that `getElementById('root')`
// will never be null at runtime (the element is guaranteed to exist in index.html).
const rootElement = document.getElementById('root')!;

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

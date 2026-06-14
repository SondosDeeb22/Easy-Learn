// ============================================
//? Import
// ============================================
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';


// redux 
import store from './redux/reduxConfig';
import { Provider } from 'react-redux';
// ============================================


const rootElement = document.getElementById('root')!; // the "!" is non-null assertation here


createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);

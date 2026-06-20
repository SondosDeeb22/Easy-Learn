// ============================================
//? Import
// ============================================
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles/index.css';
import App from './App';


// redux 
import store from './redux/reduxConfig';
import { Provider } from 'react-redux';

// react query
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query/queryClient';
// ============================================


const rootElement = document.getElementById('root')!; // the "!" is non-null assertation here


createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);

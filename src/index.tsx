import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import '@aws-amplify/ui-react/styles.css';
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('node not found');

const root = createRoot(rootElement);
root.render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>
);

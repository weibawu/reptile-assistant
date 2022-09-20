import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { BrowserRouter } from 'react-router-dom';

import { HelmetProvider } from 'react-helmet-async';

import { Amplify } from 'aws-amplify';
import amplifyConfig from './aws-exports';
import '@aws-amplify/ui-react/styles.css';

import { I18n } from 'aws-amplify';
import { translations } from '@aws-amplify/ui-react';
I18n.putVocabularies(translations);
I18n.setLanguage('zh');

Amplify.configure(amplifyConfig);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('node not found');

const root = createRoot(rootElement);
root.render(
  <HelmetProvider>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </HelmetProvider>
);

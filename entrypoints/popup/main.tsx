import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { i18n } from '#i18n';

import { App } from './App';
import './style.css';

document.documentElement.lang = browser.i18n.getUILanguage();
document.title = i18n.t('popup.documentTitle');
document
  .querySelector('meta[name="description"]')
  ?.setAttribute('content', i18n.t('popup.documentDescription'));

const root = document.querySelector('#root');

if (!(root instanceof HTMLElement)) {
  throw new Error('Missing popup root element');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

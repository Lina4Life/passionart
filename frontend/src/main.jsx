document.getElementById('root').innerHTML = '<h1>Direct DOM Test</h1>';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

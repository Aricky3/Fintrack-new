import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* 
      The key point: 
      When the site is at https://aricky3.github.io/Fintrack-new/, 
      we set basename="/Fintrack-new". 
    */}
    <BrowserRouter basename="/Fintrack-new">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, 
// pass a function to log results (for example: reportWebVitals(console.log)) 
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
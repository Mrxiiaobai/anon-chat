import React from 'react';
// import { render } from 'react-dom'
import ReactDOM from 'react-dom/client';
import Router from './router';
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Router />
  // </React.StrictMode>
);
// render(
//   <Router />,
//   document.getElementById('root')
// )

// reportWebVitals();

/* eslint-disable no-unused-vars */
/* eslint-disable import/no-named-as-default-member */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ContextProvider } from './Context';

ReactDOM.render(
  // <ContextProvider>
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
    // </ContextProvider>,
    // eslint-disable-next-line comma-dangle
    document.getElementById('root')
);

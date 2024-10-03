import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RoutesProtected } from './config/Rotas_protegidas';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <RoutesProtected />
  </BrowserRouter>
);

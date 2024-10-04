import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RoutesProtected } from './config/Rotas_protegidas';
import { getBasename, setBasenameInLocalStorage, getBasenameInLocalStorage} from './config/getBasename';

const basename = getBasename();
setBasenameInLocalStorage(basename);

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={getBasenameInLocalStorage()}>
    <RoutesProtected />
  </BrowserRouter>
);

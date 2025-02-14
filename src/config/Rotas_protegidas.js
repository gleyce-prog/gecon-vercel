import React from 'react';
import { useRoutes, Navigate, useLocation  } from 'react-router-dom';
import { routes } from './Rotas.js';
import { modulos } from './Globals.js';
import { getWithExpiration } from '../utils/Login.js';

const isLogged = getWithExpiration();

const getModule = (key = null) => {
    return modulos.filter((modulo) => modulo && modulo?.ativo === true).map((modulo) => modulo.id).includes(key);
}


const RoutesProtected = () => {
    const element = useRoutes(routes);
    const location = useLocation();  
    const currentRoute = getCurrentRoute(routes, location.pathname);  
    if (location.pathname === "/" || !currentRoute || !hasAccess(currentRoute)) {
        window.location.pathname = location.pathname === "/" ? "/login" : "/pagina-nao-encontrada";
    }
    return hasAccess(currentRoute) ? element : window.location.pathname = "/login";
};


const getCurrentRoute = (routes, currentPath) => {
    return routes.find((route) => route.path === currentPath);
};

const hasAccess = (currentRoute) => {
    return currentRoute.type === "public" || (isLogged && (currentRoute.type === "logged" || Permission(currentRoute.key)));
}
const Permission = (key) => {
    return typeof key === 'number' ? getModule(key) : getModule(routes.find(route => route.path === key)?.key);
};

export { RoutesProtected, Permission };

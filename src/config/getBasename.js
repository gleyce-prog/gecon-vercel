import { routes } from './Rotas.js';

export const getBasename = () => {
    const pathArray = window.location.pathname.split('/').filter(Boolean);
    const basename = pathArray.join('/');
    const lastPart = pathArray[pathArray.length - 1];
    if (pathArray.length > 0) {
        if (routes.some(route => route.path === `/${lastPart}`))
            return `/${pathArray.slice(0, -1).join('/')}/`;
        else
            return `/${basename}/`;
    }


    return '/';
};

export const setBasenameInLocalStorage = (basename) => {
    if (!localStorage.getItem("basename")) {
        localStorage.setItem("basename", basename);
    }
};

export const getBasenameInLocalStorage = () => {
    return localStorage.getItem("basename");
};
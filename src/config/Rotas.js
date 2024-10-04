import React, { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import Login from '../Pages/Login.jsx';
import ListarUsuario from '../Pages/Usuário/Listar.jsx';
import ListarCliente from '../Pages/Cliente/Listar.jsx';
import { Styles, Scripts } from '../utils/Style.js';
import Layout from '../Pages/Layout.jsx';
import AlterarSenha from '../Pages/Alterar_senha.jsx';
import PaginaErro from '../Pages/Erro/Pagina_nao_encontrada.jsx';
import Home from '../Components/Comum/Dashboard.jsx';
import { getBasenameInLocalStorage } from "./getBasename.js";
const addCssLink = (href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = href;
    document.head.appendChild(link);
}

const addScripts = (src) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    document.body.appendChild(script);
}

export const routes = [
    {
        path: "/login",
        element: <Login rota={'/home'} />,
        type: "public",
        css: [Styles.login],
        script: [Scripts.modal_jquery, Scripts.modal_bootstrap]
    },
    {
        path: "/home",
        element: <Layout children={<Home />} title={'Home'} />,
        type: "logged",
        css: [],
        script: []
    },
    {
        path: "/nova-senha",
        element: <AlterarSenha rota={'/login'} />,
        type: "public",
        css: [],
    },
    {
        path: "/pagina-nao-encontrada",
        element: <PaginaErro rota={'/login'} />,
        type: "public",
        css: [],
    }, {
        path: "*",
        element: <PaginaErro rota={'/login'} />,
        type: "public",
        css: [],
    },
    {
        path: "/usuario",
        element: <Layout children={<ListarUsuario />} title={'Usuários'} />,
        type: "protected",
        key: 1,
        css: [],
    },
    {
        path: "/usuario-cadastrar",
        type: "protected",
        key: 2
    },
    {
        path: "/usuario-pesquisar",
        type: "protected",
        key: 2
    },
    {
        path: "/usuario-inativar",
        type: "protected",
        key: 2
    },
    {
        path: "/usuario-ativar",
        type: "protected",
        key: 2
    },
    {
        path: "/socio-pesquisar",
        type: "protected",
        key: 3
    },
    {
        path: "/socio-cadastrar",
        type: "protected",
        key: 3
    },
    {
        path: "/cliente",
        element: <Layout children={<ListarCliente />} title={'Usuários'} />,
        type: "protected",
        key: 3,
        css: [],
    },
    {
        path: "/cliente-cadastrar",
        type: "protected",
        key: 3
    },
    {
        path: "/cliente-pesquisar",
        type: "protected",
        key: 3
    },
    {
        path: "/cliente-inativar",
        type: "protected",
        key: 2
    },
    {
        path: "/cliente-ativar",
        type: "protected",
        key: 3
    },
]

const Rotas = () => {
    const element = useRoutes(routes);

    useEffect(() => {
        const currentRoute = routes.find((route) => route.path === window.location.pathname);
        if (currentRoute) {
            currentRoute.css.forEach((href) => addCssLink(href));
            Styles.forEach((styleHref) => addCssLink(styleHref));

            currentRoute.script.forEach((src) => addScripts(src));
        }

        return () => {
            const links = document.head.querySelectorAll('link[rel="stylesheet"]');
            links.forEach((link) => link.remove());

            const scripts = document.body.querySelectorAll('script[type="text/javascript"]');
            scripts.forEach((script) => script.remove());
        };
    }, [element]);

};

export default Rotas;
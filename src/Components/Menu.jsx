import React, { useMemo } from 'react';
import { getCookie } from '../utils/Cookies';
const Menu = ({ props = [] }) => {
  const renderedMenuItems = useMemo(() => {
    const addedMenus = new Set();
    const updatedProps = [
      ...props,
      { id: '3', menu: 'Cliente' } 
    ];
    return updatedProps.filter(item => {
      if (!addedMenus.has(item?.id) && item?.menu !== undefined) {
        addedMenus.add(item?.id);
        return true;
      }
      return false;
    })
    .map((item,index) => {
      const menu = item?.menu.toLowerCase();

        return (
          <li key={index}>
            <a href={`/${menu}`}>
              <div className="menu-icon">
                {icons[menu]}
              </div>
              <span className="nav-text">{item?.menu}</span>
            </a>
          </li>
        );
      });
  }, [props]);

  return (
    <div className="deznav">
      <div className="deznav-scroll mm-active">
        <ul className="metismenu mm-show" id="menu">
          {renderedMenuItems.length ? renderedMenuItems : <li>Nenhum item</li>}
        </ul>
      </div>
    </div>
  );
};

export default Menu;


const Preloader = () => {
  return (
    <div id="preloader">
      <div className="lds-ripple">
        <div />
        <div />
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <div className="footer">
      <div className="copyright">
        <p>
          Copyright © Developed <span>2024</span>
        </p>
      </div>
    </div>
  );
};

const Container = ({ children }) => {
  return (
    <div className="container-fluid">
      <div className="row">{children}</div>
    </div>
  );
};

const icons = {
  home: <i className={`fas fa-home ${getCookie('theme') === 'light' ? 'text-dark' : 'text-light'}`} />,
  usuario: <i className={`fas fa-user ${getCookie('theme') === 'light' ? 'text-dark' : 'text-light'}`} />,
  cliente: <i className={`fas fa-users ${getCookie('theme') === 'light' ? 'text-dark' : 'text-light'}`} />,  // Ícone de "clientes"
  default: <i className={`fas fa-cogs ${getCookie('theme') === 'light' ? 'text-dark' : 'text-light'}`} /> // Ícone padrão
};

export { Menu, Preloader, Footer, Container };

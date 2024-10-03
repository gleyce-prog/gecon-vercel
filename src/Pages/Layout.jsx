import React from "react";
import { Menu, Preloader, Footer, Container } from "../Components/Menu.jsx";
import Header from "../Components/Header.jsx";
import Title from "../Components/Title.jsx";
import { JWT_TOKEN } from "../config/Globals.js";
import { useLocation } from "react-router-dom";

const MainLayout = ({ ...props }) => {
  const location = useLocation();
  const pathname = location.pathname.split('/')[2];
  return (
    <div className="content-body">
      <Title title={props.title} pathname={pathname}/>
      <Container>{props.children}</Container>
    </div>
  );
};

const Layout = ({ ...props }) => {
  return (
    <>
      <div id="main-wrapper" className="show">
        <Preloader />
        <Header props={JWT_TOKEN?.sub} />
        <Menu props={JWT_TOKEN?.menu} />
        <MainLayout props={props.title}>{props.children}</MainLayout>
      </div>
      <Footer />
    </>
  );
};

export default Layout;

import React from "react";
import { Menu, Preloader, Footer, Container } from "../Components/Menu.jsx";
import Header from "../Components/Header.jsx";
import Title from "../Components/Title.jsx";
import { jwtToken } from "../config/Globals.js";


const MainLayout = ({ ...props }) => {
  return (
    <div className="content-body">
      <Title title={props.title}/>
      <Container>{props.children}</Container>
    </div>
  );
};

const Layout = ({ ...props }) => {
  return (
    <>
      <div id="main-wrapper" className="show">
        <Preloader />
        <Header props={jwtToken?.sub} />
        <Menu props={jwtToken?.menu} />
        <MainLayout title={props.title}>{props.children}</MainLayout>
      </div>
      <Footer />
    </>
  );
};

export default Layout;

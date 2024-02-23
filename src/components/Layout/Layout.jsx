import React from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Routes from "../../routes/Routers";

const Layout = () => {
  return (
    <>
      <Header />
      <div>
        <Routes />
      </div>
      <Footer />
    </>
  );
};

export default Layout;

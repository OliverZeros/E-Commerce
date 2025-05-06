import React from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Routes from "../../routes/Routers";

import AdminNav from "../../admin/page/AdminNav";
import { useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();

  if (location.pathname === "*" || location.pathname === "/404") {
    return (
      <div>
        <Routes />
      </div>
    );
  }

  return (
    <>
      {location.pathname.startsWith("/admin") ? <AdminNav /> : <Header />}
      <div>
        <Routes />
      </div>
      <Footer />
    </>
  );
};

export default Layout;

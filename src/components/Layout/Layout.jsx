import React from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Routes from "../../routes/Routers";

import AdminNav from "../../admin/page/AdminNav";
import { useLocation } from "react-router-dom";

const Layout = () => {
  return (
    <>
      {useLocation().pathname.startsWith("/admin") ? <AdminNav /> : <Header />}
      <div>
        <Routes />
      </div>
      <Footer />
    </>
  );
};

export default Layout;

import React from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Routes from "../../routes/Routers";

import AdminNav from "../../admin/page/AdminNav";
import { useLocation } from "react-router-dom";
import Chatbot from "../Chatbot/Chatbot";

const Layout = () => {
  const location = useLocation();

  if (location.pathname === "*" || location.pathname === "/404") {
    return (
      <div>
        <Routes />
      </div>
    );
  }

  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {isAdmin ? <AdminNav /> : <Header />}
      <div>
        <Routes />
      </div>
      <Footer />
      {!isAdmin && <Chatbot />}
    </>
  );
};

export default Layout;

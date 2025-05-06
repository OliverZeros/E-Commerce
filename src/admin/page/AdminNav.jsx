import React, { useRef, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/admin-nav.css";
import { motion } from "framer-motion";
import logo from "../../assets/images/logo2.png";
import userIcon from "../../assets/images/user-icon.png";
import { Container, Row } from "reactstrap";
import { logout } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const nav__links = [
  {
    path: "admin/all-products",
    display: "Products",
  },
  {
    path: "admin/all-users",
    display: "Users",
  },
  {
    path: "admin/all-receipts",
    display: "Receipt",
  },
];

const Header = () => {
  const headerRef = useRef(null);
  const [showLogout, setShowLogout] = useState(false);

  const menuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const stickyHeaderFunc = () => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("sticky__header");
      } else {
        headerRef.current.classList.remove("sticky__header");
      }
    });
  };

  useEffect(() => {
    stickyHeaderFunc();

    return () => window.removeEventListener("scroll", stickyHeaderFunc);
  });

  const menuToggle = () => {
    menuRef.current.classList.toggle("active__menu");
  };

  const navigateToHome = () => {
    navigate("/home");
  };

  const toggleProfileAction = () => {
    setShowLogout(!showLogout);
  };

  const logoutUser = () => {
    dispatch(logout());
    // setShowLogout(!showLogout);
    navigate("/home");
  };

  return (
    <header className="header_admin" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper">
            <div className="logoad" onClick={navigateToHome}>
              <img src={logo} alt="logo_Image" />
            </div>

            <div className="navigation" ref={menuRef} onClick={menuToggle}>
              <ul className="menu">
                {nav__links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "nav__active" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nav__icons">
              <div className="profile">
                <motion.img
                  whileTap={{ scale: 1.2 }}
                  src={userIcon}
                  alt="user_Icon"
                  onClick={toggleProfileAction}
                />
                <div
                  className="profile_action"
                  onClick={logoutUser}
                  style={{
                    display: showLogout ? "block" : "none",
                  }}
                >
                  <span>Logout</span>
                </div>
              </div>
              <div className="mobile__menu">
                <span onClick={menuToggle}>
                  <i className="ri-menu-line"></i>
                </span>
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;

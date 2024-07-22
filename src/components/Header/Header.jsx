import React, { useRef, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./header.css";
import { motion } from "framer-motion";
import logo from "../../assets/images/eco-logo.png";
import userIcon from "../../assets/images/user-icon.png";
import { Container, Row } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

const nav__links = [
  {
    path: "home",
    display: "Home",
  },
  {
    path: "shop",
    display: "Shop",
  },
  {
    path: "cart",
    display: "Cart",
  },
];

const Header = () => {
  const headerRef = useRef(null);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const isLoggedIn = useSelector((state) => (state.auth.token ? true : false));
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

  const navigateToCart = () => {
    navigate("/cart");
  };

  const navigateToHome = () => {
    navigate("/home");
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  const toggleProfileAction = () => {
    setShowLogout(!showLogout);
  };

  const logoutUser = () => {
    dispatch(logout());
    navigate("/home");
  };

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper">
            <div className="logo" onClick={navigateToHome}>
              <img src={logo} alt="logo_Image" />
              <div>
                <h1>Interior Modern</h1>
              </div>
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
                {isLoggedIn ? (
                  <>
                    <li className="nav__item">
                      <NavLink
                        to="/order"
                        className={(navClass) =>
                          navClass.isActive ? "nav__active" : ""
                        }
                      >
                        Order
                      </NavLink>
                    </li>
                    <li className="nav__item">
                      <NavLink
                        to="/profile"
                        className={(navClass) =>
                          navClass.isActive ? "nav__active" : ""
                        }
                      >
                        Profile
                      </NavLink>
                    </li>
                  </>
                ) : (
                  <></>
                )}
              </ul>
            </div>

            <div className="nav__icons">
              <span className="fav__icon">
                <i className="ri-heart-line"></i>
                <span className="badge">1</span>
              </span>
              <span className="cart__icon" onClick={navigateToCart}>
                <i className="ri-shopping-bag-3-line"></i>
                <span className="badge">{totalQuantity}</span>
              </span>
              <div className="profile">
                {isLoggedIn ? (
                  <div>
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
                ) : (
                  <div>
                    <motion.img
                      whileTap={{ scale: 1.2 }}
                      src={userIcon}
                      alt="user_Icon"
                      onClick={navigateToLogin}
                    />
                  </div>
                )}
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

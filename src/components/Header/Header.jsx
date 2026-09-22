import React, { useRef, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./header.css";
import { motion } from "framer-motion";
import logo from "../../assets/images/logo1.png";
import userIcon from "../../assets/images/user-icon.png";
import { Container, Row } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { cartActions } from "../../redux/slices/cartSlice";
import { getCartItems } from "../../service/cartService";

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
  const token = useSelector((state) => state.auth.token);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const isLoggedIn = Boolean(token);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const [showLogout, setShowLogout] = useState(false);

  const menuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) return;
    getCartItems(token)
      .then((res) => {
        const productsInCart = res.data?.productsInCart || [];
        const total = productsInCart.reduce((acc, item) => acc + (item.quantity || 1), 0);
        dispatch(cartActions.setTotalQuantity(total));
      })
      .catch(() => {});
  }, [token, dispatch]);

  useEffect(() => {
    const stickyHeaderFunc = () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current?.classList.add("sticky__header");
      } else {
        headerRef.current?.classList.remove("sticky__header");
      }
    };

    window.addEventListener("scroll", stickyHeaderFunc);
    return () => window.removeEventListener("scroll", stickyHeaderFunc);
  }, []);

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
                      style={{
                        display: showLogout ? "flex" : "none",
                        flexDirection: "column",
                        gap: "6px",
                        width: "160px",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      {isAdmin && (
                        <div
                          style={{ cursor: "pointer", fontWeight: 600, color: "#2563eb", padding: "4px 0" }}
                          onClick={() => {
                            setShowLogout(false);
                            navigate("/admin/all-products");
                          }}
                        >
                          <i className="ri-dashboard-line me-1"></i> Admin Portal
                        </div>
                      )}
                      <div
                        style={{ cursor: "pointer", fontWeight: 500, color: "#1e293b", padding: "4px 0" }}
                        onClick={() => {
                          setShowLogout(false);
                          navigate("/profile");
                        }}
                      >
                        <i className="ri-user-3-line me-1"></i> My Profile
                      </div>
                      <div
                        style={{ cursor: "pointer", fontWeight: 500, color: "#ef4444", padding: "4px 0" }}
                        onClick={logoutUser}
                      >
                        <i className="ri-logout-box-r-line me-1"></i> Logout
                      </div>
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

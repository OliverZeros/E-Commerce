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
  const totalWishlist = useSelector((state) => state.wishlist.totalWishlist);
  const isLoggedIn = Boolean(token);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const hoverTimeoutRef = useRef(null);

  const menuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMouseEnterProfile = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsProfileOpen(true);
  };

  const handleMouseLeaveProfile = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsProfileOpen(false);
    }, 180);
  };

  const closeProfileDropdown = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsProfileOpen(false);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

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

  const navigateToWishlist = () => {
    navigate("/wishlist");
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
              <span
                className="fav__icon"
                onClick={navigateToWishlist}
                title="Sản phẩm yêu thích"
                style={{ cursor: "pointer" }}
              >
                <i className="ri-heart-line"></i>
                <span className="badge">{totalWishlist}</span>
              </span>
              <span className="cart__icon" onClick={navigateToCart}>
                <i className="ri-shopping-bag-3-line"></i>
                <span className="badge">{totalQuantity}</span>
              </span>
              <div
                className="profile"
                onMouseEnter={handleMouseEnterProfile}
                onMouseLeave={handleMouseLeaveProfile}
              >
                {isLoggedIn ? (
                  <>
                    <motion.img
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      src={userIcon}
                      alt="user_Icon"
                      onClick={() => navigate("/profile")}
                    />
                    <div
                      className={`profile_action ${isProfileOpen ? "is-open" : ""}`}
                    >
                      {isAdmin && (
                        <div
                          className="profile_action-item admin-portal"
                          onClick={() => {
                            closeProfileDropdown();
                            navigate("/admin/all-products");
                          }}
                        >
                          <i className="ri-dashboard-line"></i>
                          <span>Quản trị hệ thống</span>
                        </div>
                      )}
                      <div
                        className="profile_action-item"
                        onClick={() => {
                          closeProfileDropdown();
                          navigate("/profile");
                        }}
                      >
                        <i className="ri-user-3-line"></i>
                        <span>Tài khoản của tôi</span>
                      </div>
                      <div
                        className="profile_action-item"
                        onClick={() => {
                          closeProfileDropdown();
                          navigate("/order");
                        }}
                      >
                        <i className="ri-file-list-3-line"></i>
                        <span>Đơn mua</span>
                      </div>
                      <div className="profile_action-divider"></div>
                      <div
                        className="profile_action-item logout-item"
                        onClick={() => {
                          closeProfileDropdown();
                          logoutUser();
                        }}
                      >
                        <i className="ri-logout-box-r-line"></i>
                        <span>Đăng xuất</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <motion.img
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      src={userIcon}
                      alt="user_Icon"
                      onClick={navigateToLogin}
                    />
                    <div
                      className={`profile_action ${isProfileOpen ? "is-open" : ""}`}
                    >
                      <div
                        className="profile_action-item"
                        onClick={() => {
                          closeProfileDropdown();
                          navigate("/login");
                        }}
                      >
                        <i className="ri-login-box-line"></i>
                        <span>Đăng nhập</span>
                      </div>
                      <div
                        className="profile_action-item"
                        onClick={() => {
                          closeProfileDropdown();
                          navigate("/signup");
                        }}
                      >
                        <i className="ri-user-add-line"></i>
                        <span>Đăng ký</span>
                      </div>
                    </div>
                  </>
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

import React, { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { Container } from "reactstrap";
import { logout } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import "../styles/admin-nav.css";

const adminNavLinks = [
  {
    path: "/admin/all-products",
    display: "Products",
    icon: "ri-archive-2-line",
  },
  {
    path: "/admin/all-users",
    display: "Users",
    icon: "ri-team-line",
  },
  {
    path: "/admin/all-receipts",
    display: "Orders & Receipts",
    icon: "ri-file-list-3-line",
  },
];

const AdminNav = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="header_admin">
      <Container>
        <div className="admin__nav-wrapper">
          {/* Brand Logo */}
          <Link to="/home" className="admin__brand" title="Back to Storefront">
            <img
              src="https://res.cloudinary.com/dxw7hwodj/image/upload/v1746629543/logo2_y9efmx.png"
              alt="Brand Logo"
            />
          </Link>

          {/* Navigation Links */}
          <ul className={`admin__menu ${mobileMenuOpen ? "show" : ""}`}>
            {adminNavLinks.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `admin__menu-link ${isActive ? "active" : ""}`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className={item.icon}></i>
                  <span>{item.display}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right Action Icons & Profile */}
          <div className="admin__nav-actions">
            <Link to="/home" className="text-decoration-none d-none d-sm-block">
              <button className="admin__visit-store-btn">
                <i className="ri-store-line"></i>
                <span>Storefront</span>
              </button>
            </Link>

            <div className="admin__profile">
              <div
                className="admin__profile-trigger"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img
                  src="https://api.dicebear.com/7.x/identicon/svg?seed=AdminUser"
                  alt="Admin Avatar"
                  className="admin__profile-avatar"
                />
                <div className="admin__profile-info">
                  <span className="admin__profile-name">Administrator</span>
                  <span className="admin__profile-role">Super Admin</span>
                </div>
                <i className="ri-arrow-down-s-line text-muted"></i>
              </div>

              {showDropdown && (
                <div className="admin__dropdown-menu">
                  <Link to="/profile" className="text-decoration-none">
                    <button
                      className="admin__dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <i className="ri-user-settings-line"></i> My Profile
                    </button>
                  </Link>
                  <Link to="/home" className="text-decoration-none d-sm-none">
                    <button
                      className="admin__dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <i className="ri-store-line"></i> View Store
                    </button>
                  </Link>
                  <button
                    className="admin__dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    <i className="ri-logout-box-r-line"></i> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              className="admin__mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className={mobileMenuOpen ? "ri-close-line" : "ri-menu-line"}></i>
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default AdminNav;

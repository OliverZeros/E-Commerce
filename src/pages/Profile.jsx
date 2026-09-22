import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserProfile, userSurvey } from "../service/userService";
import { getReceipts } from "../service/receiptService";
import { getCartItems } from "../service/cartService";
import { Container, Row, Col } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { toast } from "react-toastify";
import { logout } from "../redux/slices/authSlice";
import "../styles/profile.css";

const CATEGORY_OPTIONS = ["Sofa", "Table", "Armchair", "Bed"];
const COLOR_OPTIONS = ["Light", "Dark"];
const SIZE_OPTIONS = ["Small", "Medium", "Large"];
const MODEL_OPTIONS = ["Modern", "Classic", "Rustic"];

const Profile = () => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderCount, setOrderCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  // Active Tab: 'overview' | 'survey' | 'security'
  const [activeTab, setActiveTab] = useState("overview");

  // Survey editing state
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);
  const [savingSurvey, setSavingSurvey] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      const [userRes, receiptsRes, cartRes] = await Promise.allSettled([
        getUserProfile(token),
        getReceipts(token),
        getCartItems(token),
      ]);

      if (userRes.status === "fulfilled") {
        const user = userRes.value.data;
        setUserData(user);
        setSelectedCategories(user.survey?.category || []);
        setSelectedColors(user.survey?.color || []);
        setSelectedSizes(user.survey?.size || []);
        setSelectedModels(user.survey?.model || []);
      }

      if (receiptsRes.status === "fulfilled") {
        setOrderCount(receiptsRes.value.data?.length || 0);
      }

      if (cartRes.status === "fulfilled") {
        const products = cartRes.value.data?.productsInCart || [];
        setCartCount(products.reduce((acc, p) => acc + (p.quantity || 1), 0));
      }
    } catch (error) {
      console.error("Failed to load profile data", error);
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Toggle helpers for multi-select chips
  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Save updated preferences
  const handleSaveSurvey = async () => {
    if (
      selectedCategories.length === 0 ||
      selectedColors.length === 0 ||
      selectedSizes.length === 0 ||
      selectedModels.length === 0
    ) {
      toast.warn("Please select at least one option for each preference category.");
      return;
    }

    try {
      setSavingSurvey(true);
      await userSurvey(
        {
          category: selectedCategories,
          color: selectedColors,
          size: selectedSizes,
          model: selectedModels,
        },
        token,
      );
      toast.success("Interior preferences updated successfully!");
      fetchUserData();
    } catch (error) {
      console.error("Failed to update survey", error);
      toast.error("Failed to update preferences. Please try again.");
    } finally {
      setSavingSurvey(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.info("You have logged out.");
    navigate("/home");
  };

  if (loading) {
    return (
      <Helmet title="Profile">
        <CommonSection title="User Profile" />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Loading profile details...</p>
        </div>
      </Helmet>
    );
  }

  return (
    <Helmet title="My Profile">
      <CommonSection title="Account Dashboard" />
      <section className="profile__section">
        <Container>
          {/* Cover Banner */}
          <div className="profile__cover"></div>

          {/* Profile Header Card */}
          <div className="profile__header-card mb-4">
            <Row className="align-items-center">
              <Col md="7" className="d-flex align-items-center gap-3">
                <div className="profile__avatar-wrapper">
                  <img
                    src={`https://api.dicebear.com/7.x/identicon/svg?seed=${
                      userData?.username || "user"
                    }`}
                    alt="avatar"
                    className="profile__avatar"
                  />
                  <span className="profile__avatar-badge"></span>
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h3 className="fw-bold mb-0 text-dark">
                      {userData?.username || "Valued Customer"}
                    </h3>
                    <span
                      className={`badge rounded-pill ${
                        userData?.usertype === "ADMIN" ? "bg-danger" : "bg-primary"
                      }`}
                    >
                      {userData?.usertype || "CUSTOMER"}
                    </span>
                  </div>
                  <p className="text-muted mb-0 d-flex align-items-center gap-1">
                    <i className="ri-mail-line"></i> {userData?.email || "No email available"}
                  </p>
                </div>
              </Col>

              <Col md="5" className="mt-3 mt-md-0 d-flex justify-content-md-end gap-2">
                <Link to="/order">
                  <button className="btn btn-outline-dark d-flex align-items-center gap-2 px-3 py-2">
                    <i className="ri-shopping-bag-line"></i> My Orders
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger d-flex align-items-center gap-2 px-3 py-2"
                >
                  <i className="ri-logout-box-r-line"></i> Logout
                </button>
              </Col>
            </Row>
          </div>

          {/* Quick Stats Row */}
          <Row className="g-3 mb-4">
            <Col md="4" sm="6">
              <div className="profile__stat-card">
                <div
                  className="profile__stat-icon"
                  style={{ background: "rgba(37, 99, 235, 0.1)", color: "#2563eb" }}
                >
                  <i className="ri-file-list-3-line"></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-0 text-dark">{orderCount}</h4>
                  <span className="text-muted small">Orders Placed</span>
                </div>
              </div>
            </Col>

            <Col md="4" sm="6">
              <div className="profile__stat-card">
                <div
                  className="profile__stat-icon"
                  style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}
                >
                  <i className="ri-shopping-cart-2-line"></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-0 text-dark">{cartCount}</h4>
                  <span className="text-muted small">Items in Cart</span>
                </div>
              </div>
            </Col>

            <Col md="4" sm="12">
              <div className="profile__stat-card">
                <div
                  className="profile__stat-icon"
                  style={{ background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }}
                >
                  <i className="ri-magic-line"></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-0 text-dark">
                    {(userData?.survey?.category?.length || 0) > 0 ? "Active" : "Not Set"}
                  </h4>
                  <span className="text-muted small">Interior Style Profile</span>
                </div>
              </div>
            </Col>
          </Row>

          {/* Navigation Tabs */}
          <div className="profile__tabs">
            <button
              className={`profile__tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <i className="ri-user-line"></i> Account Details
            </button>
            <button
              className={`profile__tab-btn ${activeTab === "survey" ? "active" : ""}`}
              onClick={() => setActiveTab("survey")}
            >
              <i className="ri-palette-line"></i> Interior Preferences Studio
            </button>
            <button
              className={`profile__tab-btn ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <i className="ri-shield-check-line"></i> Security & Settings
            </button>
          </div>

          {/* TAB 1: Account Overview */}
          {activeTab === "overview" && (
            <div className="profile__content-box">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <i className="ri-information-line text-primary"></i>
                Personal Information
              </h5>

              <Row className="g-3 mb-4">
                <Col md="6">
                  <div className="profile__form-label">Username</div>
                  <div className="profile__form-value">{userData?.username || "N/A"}</div>
                </Col>
                <Col md="6">
                  <div className="profile__form-label">Email Address</div>
                  <div className="profile__form-value">{userData?.email || "N/A"}</div>
                </Col>
                <Col md="6">
                  <div className="profile__form-label">Account Role</div>
                  <div className="profile__form-value text-uppercase">{userData?.usertype || "User"}</div>
                </Col>
                <Col md="6">
                  <div className="profile__form-label">Account Status</div>
                  <div className="profile__form-value text-success d-flex align-items-center gap-2">
                    <i className="ri-checkbox-circle-fill"></i> Active & Verified
                  </div>
                </Col>
              </Row>

              <hr className="my-4" />

              <h6 className="fw-bold mb-3">Quick Navigation</h6>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/order">
                  <button className="btn btn-outline-primary px-3 py-2">
                    <i className="ri-history-line me-1"></i> View Order History
                  </button>
                </Link>
                <Link to="/cart">
                  <button className="btn btn-outline-secondary px-3 py-2">
                    <i className="ri-shopping-cart-line me-1"></i> Open Shopping Cart
                  </button>
                </Link>
                <Link to="/shop">
                  <button className="btn btn-dark px-3 py-2 text-white">
                    <i className="ri-store-2-line me-1"></i> Visit Furniture Store
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* TAB 2: Interior Preferences Studio */}
          {activeTab === "survey" && (
            <div className="profile__content-box">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="fw-bold mb-1 d-flex align-items-center gap-2">
                    <i className="ri-paint-brush-line text-primary"></i>
                    Your Interior Design Taste
                  </h5>
                  <p className="text-muted small mb-0">
                    We use these preferences to personalize product recommendations on your home page.
                  </p>
                </div>

                <button
                  className="btn btn-primary text-white fw-bold px-4 py-2"
                  onClick={handleSaveSurvey}
                  disabled={savingSurvey}
                >
                  {savingSurvey ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1"></span> Saving...
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line me-1"></i> Save Preferences
                    </>
                  )}
                </button>
              </div>

              <hr className="my-4" />

              {/* Categories */}
              <div className="preference__group">
                <div className="preference__group-title">
                  <i className="ri-archive-drawer-line text-muted"></i>
                  Interested Categories
                </div>
                <div className="chips__container">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <div
                        key={cat}
                        className={`preference__chip ${isSelected ? "selected" : ""}`}
                        onClick={() =>
                          toggleSelection(cat, selectedCategories, setSelectedCategories)
                        }
                      >
                        {isSelected && <i className="ri-check-line"></i>}
                        {cat}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Colors */}
              <div className="preference__group">
                <div className="preference__group-title">
                  <i className="ri-contrast-drop-line text-muted"></i>
                  Color Palettes
                </div>
                <div className="chips__container">
                  {COLOR_OPTIONS.map((color) => {
                    const isSelected = selectedColors.includes(color);
                    return (
                      <div
                        key={color}
                        className={`preference__chip ${isSelected ? "selected" : ""}`}
                        onClick={() =>
                          toggleSelection(color, selectedColors, setSelectedColors)
                        }
                      >
                        {isSelected && <i className="ri-check-line"></i>}
                        {color}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sizes */}
              <div className="preference__group">
                <div className="preference__group-title">
                  <i className="ri-ruler-line text-muted"></i>
                  Room / Furniture Sizes
                </div>
                <div className="chips__container">
                  {SIZE_OPTIONS.map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <div
                        key={size}
                        className={`preference__chip ${isSelected ? "selected" : ""}`}
                        onClick={() =>
                          toggleSelection(size, selectedSizes, setSelectedSizes)
                        }
                      >
                        {isSelected && <i className="ri-check-line"></i>}
                        {size}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Models */}
              <div className="preference__group mb-0">
                <div className="preference__group-title">
                  <i className="ri-home-heart-line text-muted"></i>
                  Design Models / Aesthetics
                </div>
                <div className="chips__container">
                  {MODEL_OPTIONS.map((model) => {
                    const isSelected = selectedModels.includes(model);
                    return (
                      <div
                        key={model}
                        className={`preference__chip ${isSelected ? "selected" : ""}`}
                        onClick={() =>
                          toggleSelection(model, selectedModels, setSelectedModels)
                        }
                      >
                        {isSelected && <i className="ri-check-line"></i>}
                        {model}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Security & Privacy */}
          {activeTab === "security" && (
            <div className="profile__content-box">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <i className="ri-lock-password-line text-primary"></i>
                Security & Account Privacy
              </h5>

              <div className="p-3 bg-light rounded-3 mb-4">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <i className="ri-shield-keyhole-line text-success fs-5"></i>
                  <h6 className="fw-bold mb-0">Authentication & Session</h6>
                </div>
                <p className="text-muted small mb-0">
                  Your session is protected with 256-Bit JWT encryption. Tokens expire automatically after 7 days of inactivity.
                </p>
              </div>

              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <div>
                  <h6 className="fw-bold mb-1">Password Management</h6>
                  <p className="text-muted small mb-0">
                    To change your current password, contact support or use account recovery.
                  </p>
                </div>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => toast.info("Password change feature is enabled via admin support.")}
                >
                  Change Password
                </button>
              </div>

              <div className="d-flex justify-content-between align-items-center py-3">
                <div>
                  <h6 className="fw-bold mb-1 text-danger">Sign Out from Device</h6>
                  <p className="text-muted small mb-0">
                    This will invalidate your current session and require you to sign in again.
                  </p>
                </div>
                <button className="btn btn-danger btn-sm text-white px-3" onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </Container>
      </section>
    </Helmet>
  );
};

export default Profile;

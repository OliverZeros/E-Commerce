import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Row, Col } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

import Helmet from "../components/Helmet/Helmet";
import Services from "../components/services/Services";
import ProductsList from "../components/UI/ProductsList";
import Clock from "../components/UI/Clock";
import UiverseButton from "../components/UI/UiverseButton";

import { setProducts } from "../redux/slices/productsSlice";
import { getAllProducts } from "../service/productService";
import { getUserProfile } from "../service/userService";

import heroImg from "../assets/images/hero-img.png";
import counterImg from "../assets/images/counter-timer-img.png";
import livingRoomImg from "../assets/images/blue-living-room-4k-blue-interior-modern-design-blue-walls.jpg";
import bedroomImg from "../assets/images/bedroom.jpg";
import tableImg from "../assets/images/table.jpg";
import armchairImg from "../assets/images/arm-chair-01.jpg";

import "../styles/home.css";

const CATEGORY_TABS = [
  { id: "ALL", label: "Tất Cả Sản Phẩm" },
  { id: "Sofa", label: "Sofa & Ghế Dài" },
  { id: "Armchair", label: "Ghế Thư Giãn" },
  { id: "Table", label: "Bàn Trà & Ăn" },
  { id: "Bed", label: "Giường Ngủ" },
];

const TESTIMONIALS = [
  {
    name: "KTS. Hoàng Nam",
    role: "Kiến trúc sư nội thất",
    location: "Hà Nội",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    comment:
      "Từng đường chỉ may đo và chất gỗ sồi rất sắc nét. Bàn ghế giao đến đúng hẹn và đội ngũ hỗ trợ bọc lót, lắp đặt tận phòng cực kỳ chuyên nghiệp.",
  },
  {
    name: "Chị Thu Thảo",
    role: "Chủ căn hộ Vinhomes",
    location: "TP. Hồ Chí Minh",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    comment:
      "Chiếc sofa văng êm vượt mong đợi! Vải nỉ cao cấp không bám bụi, phom dáng chuẩn Scandinavian tối giản mà vẫn vô cùng ấm cúng.",
  },
  {
    name: "Anh Minh Đức",
    role: "Creative Director",
    location: "Đà Nẵng",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    comment:
      "Mình đặt trọn combo phòng khách và bàn ăn. Sau gần một năm sử dụng, kết cấu gỗ vẫn chắc nịch, không hề có hiện tượng cong vênh hay mối mọt.",
  },
];

const Home = () => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const reduxProducts = useSelector((state) => state.products.products);
  const [products, setProductsState] = useState(reduxProducts || []);
  const [activeTab, setActiveTab] = useState("ALL");
  const [userSurvey, setSurvey] = useState([]);

  useEffect(() => {
    if (reduxProducts && reduxProducts.length > 0) {
      setProductsState(reduxProducts);
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        const data = response.data || [];
        setProductsState(data);
        dispatch(setProducts(data));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [dispatch, reduxProducts]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!token) return;
      try {
        const response = await getUserProfile(token);
        if (response?.data?.survey?.category) {
          setSurvey(response.data.survey.category);
        }
      } catch (error) {
        // Handled silently
      }
    };
    fetchUserInfo();
  }, [token]);

  // Filtered products for interactive tab
  const displayedProducts = useMemo(() => {
    if (activeTab === "ALL") {
      return products.slice(0, 8);
    }
    return products.filter((item) => {
      const cat = item.category || (item.productType && item.productType.category);
      return cat === activeTab;
    });
  }, [products, activeTab]);

  // Recommended products based on survey
  const recommendedProducts = useMemo(() => {
    if (!userSurvey || userSurvey.length === 0) return [];
    return products
      .filter((item) => {
        const cat = item.category || (item.productType && item.productType.category);
        return userSurvey.includes(cat);
      })
      .slice(0, 4);
  }, [products, userSurvey]);

  // Best sellers (first 4 armchairs/tables)
  const bestSalesProducts = useMemo(() => {
    return products
      .filter((item) => {
        const cat = item.category || (item.productType && item.productType.category);
        return cat === "Armchair" || cat === "Table";
      })
      .slice(0, 4);
  }, [products]);

  return (
    <Helmet title="Trang Chủ - Nội Thất Cao Cấp & Tinh Tế">
      {/* =========================================================
          1. Editorial Luxury Hero Section
          ========================================================= */}
      <section className="hero__luxury-section">
        <Container>
          <Row className="align-items-center gy-5">
            <Col lg="6" md="12">
              <div className="hero__luxury-content">
                <div className="hero__luxury-badge">
                  <i className="ri-sparkling-fill"></i>
                  <span>Bộ Sưu Tập 2026 • Nghệ Thuật Không Gian Tối Giản</span>
                </div>

                <h1 className="hero__luxury-title">
                  Nâng Tầm Không Gian Sống <br />
                  <span>Tinh Tế & Sang Trọng</span>
                </h1>

                <p className="hero__luxury-subtitle">
                  Khám phá những tuyệt tác nội thất chuẩn phong cách Scandinavian,
                  chế tác tỉ mỉ từ gỗ sồi tự nhiên và vật liệu bền vững nhằm mang đến
                  sự thư thái trọn vẹn cho ngôi nhà bạn.
                </p>

                <div className="hero__cta-group">
                  <UiverseButton
                    text="Khám Phá Sản Phẩm"
                    to="/shop"
                    variant="vibrant"
                    icon="ri-arrow-right-line"
                  />
                  <a href="#shop-by-room" className="hero__btn-secondary">
                    <i className="ri-layout-grid-line"></i>
                    <span>Xem Theo Không Gian</span>
                  </a>
                </div>

                <div className="hero__trust-strip">
                  <div className="trust-item">
                    <h4>15.000+</h4>
                    <p>Khách hàng tin chọn</p>
                  </div>
                  <div className="trust-divider"></div>
                  <div className="trust-item">
                    <h4>10 Năm</h4>
                    <p>Bảo hành khung sườn</p>
                  </div>
                  <div className="trust-divider"></div>
                  <div className="trust-item">
                    <h4>4.9 ★</h4>
                    <p>Đánh giá hài lòng</p>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg="6" md="12">
              <div className="hero__visual-container">
                <div className="hero__visual-bg-glow"></div>
                <div className="hero__main-image-wrap">
                  <img
                    src={heroImg}
                    alt="Nội thất hiện đại"
                    className="hero__main-image"
                    fetchpriority="high"
                  />
                </div>

                {/* Floating highlight card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="hero__floating-card hero__floating-card--product"
                >
                  <div className="card-dot"></div>
                  <div>
                    <span className="card-label">Sản Phẩm Xu Hướng</span>
                    <h5 className="card-title">Armchair Bắc Âu Cao Cấp</h5>
                    <div className="card-rating">
                      <i className="ri-star-fill"></i>
                      <span>4.9 (140+ đánh giá)</span>
                    </div>
                  </div>
                </motion.div>

                {/* Floating eco badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="hero__floating-card hero__floating-card--eco"
                >
                  <i className="ri-leaf-line eco-icon"></i>
                  <div>
                    <span className="card-title">100% Gỗ Tự Nhiên</span>
                    <span className="card-sub">Chứng nhận nguồn gốc bền vững</span>
                  </div>
                </motion.div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =========================================================
          2. Value Proposition Trust Bar
          ========================================================= */}
      <Services />

      {/* =========================================================
          3. "Shop By Room" Bento Grid Showcase
          ========================================================= */}
      <section className="shop-by-room__section" id="shop-by-room">
        <Container>
          <div className="section-header text-center">
            <span className="section-eyebrow">Không Gian Sống Đương Đại</span>
            <h2 className="section-heading">Mua Sắm Theo Từng Phòng</h2>
            <p className="section-desc">
              Từng không gian được phối hợp hài hòa về chất liệu và ánh sáng, giúp bạn
              dễ dàng định hình phong cách sống riêng biệt.
            </p>
          </div>

          <Row className="gy-4">
            {/* Room 1: Living Room (Large feature tile) */}
            <Col lg="6" md="12">
              <Link to="/shop" className="bento-card bento-card--large">
                <img
                  src={livingRoomImg}
                  alt="Phòng khách"
                  className="bento-card__bg"
                  loading="lazy"
                />
                <div className="bento-card__overlay"></div>
                <div className="bento-card__content">
                  <span className="bento-tag">Trái Tim Căn Nhà</span>
                  <h3 className="bento-title">Phòng Khách Sang Trọng</h3>
                  <p className="bento-desc">
                    Tuyển tập sofa văng, sofa góc và bàn trà nhập khẩu tinh gọn.
                  </p>
                  <span className="bento-link">
                    Khám phá ngay <i className="ri-arrow-right-line"></i>
                  </span>
                </div>
              </Link>
            </Col>

            {/* Room 2 & 3 Column */}
            <Col lg="6" md="12">
              <Row className="gy-4">
                <Col md="6" sm="6">
                  <Link to="/shop" className="bento-card bento-card--medium">
                    <img
                      src={armchairImg}
                      alt="Ghế thư giãn"
                      className="bento-card__bg"
                      loading="lazy"
                    />
                    <div className="bento-card__overlay"></div>
                    <div className="bento-card__content">
                      <span className="bento-tag">Thư Thái & Đọc Sách</span>
                      <h3 className="bento-title">Ghế Bành & Thư Giãn</h3>
                      <span className="bento-link">
                        Xem chi tiết <i className="ri-arrow-right-line"></i>
                      </span>
                    </div>
                  </Link>
                </Col>

                <Col md="6" sm="6">
                  <Link to="/shop" className="bento-card bento-card--medium">
                    <img
                      src={tableImg}
                      alt="Phòng ăn & bàn trà"
                      className="bento-card__bg"
                      loading="lazy"
                    />
                    <div className="bento-card__overlay"></div>
                    <div className="bento-card__content">
                      <span className="bento-tag">Gắn Kết Gia Đình</span>
                      <h3 className="bento-title">Bàn Ăn & Bàn Trà</h3>
                      <span className="bento-link">
                        Xem chi tiết <i className="ri-arrow-right-line"></i>
                      </span>
                    </div>
                  </Link>
                </Col>

                {/* Room 4: Bedroom wide banner */}
                <Col md="12">
                  <Link to="/shop" className="bento-card bento-card--wide">
                    <img
                      src={bedroomImg}
                      alt="Phòng ngủ"
                      className="bento-card__bg"
                      loading="lazy"
                    />
                    <div className="bento-card__overlay"></div>
                    <div className="bento-card__content">
                      <span className="bento-tag">Nơi Tái Tạo Năng Lượng</span>
                      <h3 className="bento-title">Phòng Ngủ Bình Yên & Ấm Cúng</h3>
                      <span className="bento-link">
                        Xem bộ sưu tập giường ngủ <i className="ri-arrow-right-line"></i>
                      </span>
                    </div>
                  </Link>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =========================================================
          4. Recommended For You (Personalized based on Survey)
          ========================================================= */}
      {recommendedProducts.length > 0 && (
        <section className="curated-section recommended-bg">
          <Container>
            <div className="section-header d-flex align-items-end justify-content-between mb-4">
              <div>
                <span className="section-eyebrow">Dành Riêng Cho Bạn</span>
                <h2 className="section-heading mb-0">Gợi Ý Theo Sở Thích Của Bạn</h2>
              </div>
              <Link to="/profile" className="view-more-link">
                Tùy chỉnh khảo sát <i className="ri-settings-4-line"></i>
              </Link>
            </div>
            <Row>
              <ProductsList data={recommendedProducts} />
            </Row>
          </Container>
        </section>
      )}

      {/* =========================================================
          5. Interactive Curated Collection with Filter Tabs
          ========================================================= */}
      <section className="curated-section">
        <Container>
          <div className="section-header text-center">
            <span className="section-eyebrow">Bộ Sưu Tập Tuyển Chọn</span>
            <h2 className="section-heading">Sản Phẩm Đang Được Yêu Thích</h2>
            <p className="section-desc">
              Khám phá các sản phẩm nội thất bán chạy nhất, kết hợp hoàn hảo giữa độ
              bền vật liệu và tính thẩm mỹ vượt thời gian.
            </p>

            {/* Filter Tabs */}
            <div className="category-tabs__wrapper">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`category-tab-btn ${
                    activeTab === tab.id ? "is-active" : ""
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <Row>
            {displayedProducts.length > 0 ? (
              <ProductsList data={displayedProducts} />
            ) : (
              <Col lg="12" className="text-center py-5">
                <p className="text-muted">Đang cập nhật các mẫu mới cho danh mục này...</p>
              </Col>
            )}
          </Row>

          <div className="text-center mt-5">
            <UiverseButton
              text="Xem Toàn Bộ Sản Phẩm"
              to="/shop"
              variant="dark"
              icon="ri-arrow-right-line"
            />
          </div>
        </Container>
      </section>

      {/* =========================================================
          6. Editorial "Room Inspiration / Lookbook" Banner
          ========================================================= */}
      <section className="editorial-banner__section">
        <div className="editorial-banner__container">
          <img
            src={livingRoomImg}
            alt="Editorial Scandinavian Interior"
            className="editorial-banner__image"
            loading="lazy"
          />
          <div className="editorial-banner__overlay"></div>
          <div className="editorial-banner__content">
            <span className="editorial-badge">LOOKBOOK NỘI THẤT</span>
            <h2 className="editorial-title">
              Sự Hòa Quyện Giữa Tối Giản Bắc Âu <br />
              Và Tiện Nghi Đương Đại
            </h2>
            <p className="editorial-desc">
              Từng đường nét may đo tỉ mỉ, mút đệm đàn hồi cao cấp kết hợp khung sườn
              gỗ sồi nguyên khối nhập khẩu đảm bảo độ bền vững trọn đời cho tổ ấm.
            </p>
            <div className="editorial-actions">
              <Link to="/shop" className="editorial-btn">
                <span>Khám Phá Phong Cách Này</span>
                <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          7. Modernized Flash Offer Countdown Section
          ========================================================= */}
      <section className="luxury-offer__section">
        <Container>
          <Row className="align-items-center gy-4">
            <Col lg="6" md="12" className="luxury-offer__content-col">
              <span className="offer-badge">Ưu Đãi Đặc Biệt Trong Tháng</span>
              <h2 className="offer-title">
                Ưu Đãi Lên Tới 30% <br />
                Ghế Thư Giãn Cao Cấp
              </h2>
              <p className="offer-desc">
                Cơ hội sở hữu chiếc ghế bành bọc nỉ êm ái với mức giá đặc quyền. Số
                lượng áp dụng có hạn trong đợt mở bán bộ sưu tập mới.
              </p>

              <Clock />

              <div className="mt-4">
                <UiverseButton
                  text="Nhận Ưu Đãi Ngay"
                  to="/shop"
                  variant="vibrant"
                  icon="ri-shopping-cart-2-line"
                />
              </div>
            </Col>

            <Col lg="6" md="12" className="text-center">
              <div className="offer-image-wrap">
                <img
                  src={counterImg}
                  alt="Ghế bành ưu đãi"
                  className="offer-image"
                  loading="lazy"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* =========================================================
          8. Best Selling Showcase
          ========================================================= */}
      <section className="curated-section pb-5">
        <Container>
          <div className="section-header text-center">
            <span className="section-eyebrow">Bán Chạy Nhất</span>
            <h2 className="section-heading">Lựa Chọn Hàng Đầu Của Khách Hàng</h2>
          </div>
          <Row>
            <ProductsList data={bestSalesProducts} />
          </Row>
        </Container>
      </section>

      {/* =========================================================
          9. Verified Customer Testimonials / Social Proof
          ========================================================= */}
      <section className="testimonials__section">
        <Container>
          <div className="section-header text-center">
            <span className="section-eyebrow">Trải Nghiệm Khách Hàng</span>
            <h2 className="section-heading">Được Tin Yêu Bởi Các Gia Đình Việt</h2>
            <p className="section-desc">
              Sự hài lòng của bạn là động lực để chúng tôi không ngừng hoàn thiện từng
              chi tiết thủ công.
            </p>
          </div>

          <Row className="gy-4">
            {TESTIMONIALS.map((item, idx) => (
              <Col lg="4" md="6" key={idx}>
                <div className="testimonial__card">
                  <div className="testimonial__rating">
                    {[...Array(item.rating)].map((_, i) => (
                      <i key={i} className="ri-star-fill"></i>
                    ))}
                  </div>
                  <p className="testimonial__quote">"{item.comment}"</p>
                  <div className="testimonial__author">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="testimonial__avatar"
                      loading="lazy"
                    />
                    <div>
                      <h5 className="author-name">{item.name}</h5>
                      <span className="author-role">
                        {item.role} • {item.location}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Home;

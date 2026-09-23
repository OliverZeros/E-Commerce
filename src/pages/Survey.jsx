import React, { useState } from "react";
import { toast } from "react-toastify";
import Helmet from "../components/Helmet/Helmet";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form } from "reactstrap";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import CommonSection from "../components/UI/CommonSection";
import UiverseButton from "../components/UI/UiverseButton";
import { userSurvey } from "../service/userService";

import "../styles/survey.css";

const CATEGORIES = [
  { id: "Sofa", label: "Sofa & Ghế Dài", icon: "ri-sofa-line", desc: "Sofa văng, sofa góc êm ái" },
  { id: "Table", label: "Bàn Trà & Ăn", icon: "ri-table-line", desc: "Bàn sồi, bàn tròn mặt đá" },
  { id: "Armchair", label: "Ghế Thư Giãn", icon: "ri-armchair-line", desc: "Ghế bành, đôn nệm êm" },
  { id: "Bed", label: "Giường Ngủ", icon: "ri-hotel-bed-line", desc: "Giường nệm, tab đầu giường" },
];

const STYLES = [
  { id: "Modern", label: "Hiện Đại & Tối Giản", icon: "ri-sparkling-line", desc: "Đường nét thanh thoát, tinh gọn" },
  { id: "Classic", label: "Cổ Điển & Quý Phái", icon: "ri-vip-crown-line", desc: "Đường cong sang trọng, bề thế" },
  { id: "Rustic", label: "Mộc Mạc & Tự Nhiên", icon: "ri-tree-line", desc: "Gỗ mộc nguyên bản, ấm cúng" },
];

const COLORS = [
  { id: "Red", label: "Tone Sáng Thanh Lịch", swatch: "#f8fafc", border: "#cbd5e1", desc: "Trắng, be, kem, gỗ sồi sáng" },
  { id: "Blue", label: "Tone Trầm Sang Trọng", swatch: "#1e293b", border: "#0f172a", desc: "Gỗ óc chó, xám than, đen mờ" },
];

const SIZES = [
  { id: "Small", label: "Căn Hộ Nhỏ / Studio", desc: "Dưới 50m² - Tối ưu diện tích" },
  { id: "Medium", label: "Chung Cư 2-3 Phòng Ngủ", desc: "50m² - 95m² - Cân bằng tiện nghi" },
  { id: "Large", label: "Nhà Phố / Biệt Thự", desc: "Trên 100m² - Không gian rộng rãi" },
];

function Survey() {
  const [category, setCategory] = useState(["Sofa"]);
  const [color, setColor] = useState(["Red"]);
  const [size, setSize] = useState(["Medium"]);
  const [model, setModel] = useState(["Modern"]);
  const [submitting, setSubmitting] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const toggleItem = (setter, list, item) => {
    setter(
      list.includes(item)
        ? list.filter((val) => val !== item)
        : [...list, item]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (token) {
        await userSurvey({ category, color, size, model }, token);
      }
      toast.success("Đã lưu sở thích phong cách! Chào mừng bạn đến với cửa hàng.");
      navigate("/home");
    } catch (error) {
      console.error("Survey submission failed:", error);
      toast.error("Không thể lưu khảo sát, nhưng bạn vẫn có thể tiếp tục mua sắm.");
      navigate("/home");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigate("/home");
  };

  return (
    <Helmet title="Khảo Sát Phong Cách - Nội Thất Cao Cấp">
      <CommonSection title="Xưởng Định Hình Phong Cách Nội Thất" />

      <section className="survey__section">
        <Container>
          <Row className="justify-content-center">
            <Col lg="9" md="11">
              <div className="survey__studio-card">
                <div className="survey__header text-center">
                  <span className="survey__badge">Cá Nhân Hóa Trải Nghiệm</span>
                  <h2 className="survey__title">Gu Thẩm Mỹ Của Bạn Là Gì?</h2>
                  <p className="survey__subtitle">
                    Hãy chia sẻ sở thích để chúng tôi gợi ý những mẫu nội thất phù hợp nhất với tổ ấm của bạn.
                  </p>
                </div>

                <Form onSubmit={handleSubmit} className="survey__form">
                  {/* Step 1: Category */}
                  <div className="survey__step-block">
                    <div className="survey__step-header">
                      <span className="step-num">01</span>
                      <div>
                        <h4 className="step-title">Loại nội thất bạn đang tìm kiếm</h4>
                        <p className="step-sub">Chọn một hoặc nhiều danh mục bạn quan tâm</p>
                      </div>
                    </div>

                    <div className="survey__chips-grid survey__chips-grid--4">
                      {CATEGORIES.map((cat) => {
                        const isSelected = category.includes(cat.id);
                        return (
                          <motion.div
                            whileTap={{ scale: 0.97 }}
                            key={cat.id}
                            className={`survey__chip-card ${
                              isSelected ? "is-selected" : ""
                            }`}
                            onClick={() => toggleItem(setCategory, category, cat.id)}
                          >
                            <div className="chip-icon-wrap">
                              <i className={cat.icon}></i>
                            </div>
                            <div className="chip-info">
                              <h5 className="chip-name">{cat.label}</h5>
                              <span className="chip-desc">{cat.desc}</span>
                            </div>
                            <div className="chip-check">
                              <i className={isSelected ? "ri-checkbox-circle-fill" : "ri-checkbox-blank-circle-line"}></i>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Model / Style */}
                  <div className="survey__step-block">
                    <div className="survey__step-header">
                      <span className="step-num">02</span>
                      <div>
                        <h4 className="step-title">Phong cách thiết kế yêu thích</h4>
                        <p className="step-sub">Định hình cá tính và cảm xúc cho không gian</p>
                      </div>
                    </div>

                    <div className="survey__chips-grid survey__chips-grid--3">
                      {STYLES.map((st) => {
                        const isSelected = model.includes(st.id);
                        return (
                          <motion.div
                            whileTap={{ scale: 0.97 }}
                            key={st.id}
                            className={`survey__chip-card ${
                              isSelected ? "is-selected" : ""
                            }`}
                            onClick={() => toggleItem(setModel, model, st.id)}
                          >
                            <div className="chip-icon-wrap">
                              <i className={st.icon}></i>
                            </div>
                            <div className="chip-info">
                              <h5 className="chip-name">{st.label}</h5>
                              <span className="chip-desc">{st.desc}</span>
                            </div>
                            <div className="chip-check">
                              <i className={isSelected ? "ri-checkbox-circle-fill" : "ri-checkbox-blank-circle-line"}></i>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 3: Color Palette */}
                  <div className="survey__step-block">
                    <div className="survey__step-header">
                      <span className="step-num">03</span>
                      <div>
                        <h4 className="step-title">Tone màu chủ đạo trong căn nhà</h4>
                        <p className="step-sub">Tạo sự hài hòa và ấm áp cho thị giác</p>
                      </div>
                    </div>

                    <div className="survey__chips-grid survey__chips-grid--2">
                      {COLORS.map((col) => {
                        const isSelected = color.includes(col.id);
                        return (
                          <motion.div
                            whileTap={{ scale: 0.97 }}
                            key={col.id}
                            className={`survey__chip-card ${
                              isSelected ? "is-selected" : ""
                            }`}
                            onClick={() => toggleItem(setColor, color, col.id)}
                          >
                            <div
                              className="chip-color-swatch"
                              style={{
                                background: col.swatch,
                                border: `2px solid ${col.border}`,
                              }}
                            ></div>
                            <div className="chip-info">
                              <h5 className="chip-name">{col.label}</h5>
                              <span className="chip-desc">{col.desc}</span>
                            </div>
                            <div className="chip-check">
                              <i className={isSelected ? "ri-checkbox-circle-fill" : "ri-checkbox-blank-circle-line"}></i>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 4: Size */}
                  <div className="survey__step-block">
                    <div className="survey__step-header">
                      <span className="step-num">04</span>
                      <div>
                        <h4 className="step-title">Diện tích không gian sống</h4>
                        <p className="step-sub">Để chúng tôi tư vấn kích thước đồ đạc vừa vặn</p>
                      </div>
                    </div>

                    <div className="survey__chips-grid survey__chips-grid--3">
                      {SIZES.map((sz) => {
                        const isSelected = size.includes(sz.id);
                        return (
                          <motion.div
                            whileTap={{ scale: 0.97 }}
                            key={sz.id}
                            className={`survey__chip-card ${
                              isSelected ? "is-selected" : ""
                            }`}
                            onClick={() => toggleItem(setSize, size, sz.id)}
                          >
                            <div className="chip-info">
                              <h5 className="chip-name">{sz.label}</h5>
                              <span className="chip-desc">{sz.desc}</span>
                            </div>
                            <div className="chip-check">
                              <i className={isSelected ? "ri-checkbox-circle-fill" : "ri-checkbox-blank-circle-line"}></i>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Large CTA Button with OliverZeros bitter-parrot-97 effect */}
                  <div className="survey__actions-box text-center mt-5">
                    <UiverseButton
                      text={submitting ? "Đang lưu sở thích..." : "Hoàn Tất Khảo Sát & Khám Phá Ngay"}
                      type="submit"
                      variant="vibrant"
                      className="w-100"
                      disabled={submitting}
                      icon="ri-arrow-right-line"
                    />

                    <div className="mt-3">
                      <button
                        type="button"
                        className="survey__skip-btn"
                        onClick={handleSkip}
                      >
                        Bỏ qua bước này và đến trang chủ sau
                      </button>
                    </div>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
}

export default Survey;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import Helmet from "../components/Helmet/Helmet";
import UiverseButton from "../components/UI/UiverseButton";
import { login } from "../redux/slices/authSlice";
import { registerService } from "../service/authService";

import "../styles/login.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc");
      return;
    }

    try {
      setLoading(true);
      const response = await registerService({
        username,
        email,
        password,
      });

      const data = response.data;
      const token = data.bearer;
      dispatch(login({ token, isAdmin: false }));
      toast.success("Tạo tài khoản thành công!");
      navigate("/survey");
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error(
        error.response?.data?.message ||
          "Không thể tạo tài khoản. Vui lòng kiểm tra lại thông tin!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Helmet title="Đăng Ký - Nội Thất Cao Cấp">
      <section className="auth__section">
        <Container>
          <Row className="justify-content-center">
            <Col lg="5" md="8" sm="11">
              <div className="auth__luxury-card">
                {/* Brand Header */}
                <div className="auth__brand-header text-center">
                  <div className="auth__icon-wrap">
                    <i className="ri-user-add-line"></i>
                  </div>
                  <h3 className="auth__title">Tạo Tài Khoản Mới</h3>
                  <p className="auth__subtitle">
                    Gia nhập cộng đồng người yêu thích nội thất tinh tế & nhận ưu đãi đặc quyền
                  </p>
                </div>

                {/* Form */}
                <Form onSubmit={handleSubmit} className="auth__form-inner">
                  <FormGroup className="auth__form-group">
                    <label className="auth__input-label">Họ và tên / Tên hiển thị</label>
                    <div className="auth__input-wrap">
                      <i className="ri-user-3-line input-icon"></i>
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        required
                      />
                    </div>
                  </FormGroup>

                  <FormGroup className="auth__form-group">
                    <label className="auth__input-label">Địa chỉ Email</label>
                    <div className="auth__input-wrap">
                      <i className="ri-mail-line input-icon"></i>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@domain.com"
                        required
                      />
                    </div>
                  </FormGroup>

                  <FormGroup className="auth__form-group">
                    <label className="auth__input-label">Mật khẩu</label>
                    <div className="auth__input-wrap">
                      <i className="ri-lock-password-line input-icon"></i>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ít nhất 6 ký tự"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i
                          className={
                            showPassword ? "ri-eye-off-line" : "ri-eye-line"
                          }
                        ></i>
                      </button>
                    </div>
                  </FormGroup>

                  {/* Large Button with OliverZeros bitter-parrot-97 effect */}
                  <div className="mt-4">
                    <UiverseButton
                      text={loading ? "Đang tạo tài khoản..." : "Đăng Ký Tài Khoản"}
                      type="submit"
                      variant="vibrant"
                      className="w-100"
                      disabled={loading}
                      icon="ri-arrow-right-line"
                    />
                  </div>

                  <div className="auth__footer-text text-center mt-4">
                    <span>Đã có tài khoản? </span>
                    <Link to="/login" className="auth__switch-link">
                      Đăng nhập ngay
                    </Link>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Signup;

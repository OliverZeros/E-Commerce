import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import Helmet from "../components/Helmet/Helmet";
import UiverseButton from "../components/UI/UiverseButton";
import { login } from "../redux/slices/authSlice";
import { loginService } from "../service/authService";

import "../styles/login.css";

const Login = () => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account.trim() || !password) {
      toast.error("Vui lòng điền email hoặc tên đăng nhập và mật khẩu");
      return;
    }

    try {
      setLoading(true);
      const response = await loginService({ identifier: account.trim(), password });
      const data = response.data;
      const token = data.bearer;
      const isAdmin = Boolean(data.isAdmin);

      dispatch(login({ token, isAdmin }));
      toast.success("Đăng nhập thành công!");

      if (isAdmin) {
        navigate("/admin/all-products");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(
        error.response?.data?.message ||
          "Email, tên đăng nhập hoặc mật khẩu không chính xác! Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Helmet title="Đăng Nhập - Nội Thất Cao Cấp">
      <section className="auth__section">
        <Container>
          <Row className="justify-content-center">
            <Col lg="5" md="8" sm="11">
              <div className="auth__luxury-card">
                {/* Brand Header */}
                <div className="auth__brand-header text-center">
                  <div className="auth__icon-wrap">
                    <i className="ri-user-smile-line"></i>
                  </div>
                  <h3 className="auth__title">Chào Mừng Trở Lại</h3>
                  <p className="auth__subtitle">
                    Đăng nhập để tiếp tục trải nghiệm không gian sống tinh tế
                  </p>
                </div>

                {/* Form */}
                <Form onSubmit={handleSubmit} className="auth__form-inner">
                  <FormGroup className="auth__form-group">
                    <label className="auth__input-label">Email hoặc Tên đăng nhập</label>
                    <div className="auth__input-wrap">
                      <i className="ri-user-line input-icon"></i>
                      <input
                        type="text"
                        id="account"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        placeholder="Nhập email hoặc tên đăng nhập..."
                        required
                        autoComplete="username"
                      />
                    </div>
                  </FormGroup>

                  <FormGroup className="auth__form-group">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="auth__input-label mb-0">Mật khẩu</label>
                      <span className="auth__forgot-link">Quên mật khẩu?</span>
                    </div>
                    <div className="auth__input-wrap">
                      <i className="ri-lock-password-line input-icon"></i>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu của bạn"
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
                      text={loading ? "Đang xử lý..." : "Đăng Nhập"}
                      type="submit"
                      variant="vibrant"
                      className="w-100"
                      disabled={loading}
                      icon="ri-login-box-line"
                    />
                  </div>

                  <div className="auth__footer-text text-center mt-4">
                    <span>Chưa có tài khoản? </span>
                    <Link to="/signup" className="auth__switch-link">
                      Tạo tài khoản mới
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

export default Login;

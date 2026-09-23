import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import UiverseButton from "../components/UI/UiverseButton";
import { cartActions } from "../redux/slices/cartSlice";
import { getCartItems, deleteCartItem } from "../service/cartService";

import "../styles/cart.css";

const Cart = () => {
  const token = useSelector((state) => state.auth.token);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCheckout = () => {
    if (token) {
      navigate("/checkout");
    } else {
      toast.info("Vui lòng đăng nhập để tiến hành thanh toán");
      navigate("/login");
    }
  };

  const getCartData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCartItems(token);
      const { productsInCart } = response.data || { productsInCart: [] };
      setCartItems(productsInCart || []);

      const total = (productsInCart || []).reduce((acc, item) => {
        return acc + Number(item.price || 0) * (item.quantity || 1);
      }, 0);
      setTotalAmount(total);

      const totalQuantity = (productsInCart || []).reduce((acc, item) => {
        return acc + (item.quantity || 1);
      }, 0);
      dispatch(cartActions.setTotalQuantity(totalQuantity));
    } catch (error) {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [token, dispatch]);

  useEffect(() => {
    getCartData();
  }, [getCartData]);

  const totalItemsCount = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0
  );

  return (
    <Helmet title="Giỏ Hàng - Nội Thất Cao Cấp">
      <CommonSection title="Giỏ Hàng Của Bạn" />

      <section className="cart__section">
        <Container>
          {loading ? (
            <div className="cart__loading">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-3 text-muted">Đang tải giỏ hàng...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="cart__empty-box text-center">
              <div className="cart__empty-icon">
                <i className="ri-shopping-bag-3-line"></i>
              </div>
              <h3 className="cart__empty-title">Giỏ hàng của bạn đang trống</h3>
              <p className="cart__empty-desc">
                Hãy khám phá các mẫu nội thất tinh tế để hoàn thiện không gian sống của bạn.
              </p>
              <div className="mt-4">
                <UiverseButton
                  text="Khám Phá Cửa Hàng"
                  to="/shop"
                  variant="vibrant"
                  icon="ri-arrow-right-line"
                />
              </div>
            </div>
          ) : (
            <Row className="gy-4">
              {/* Left Column: Product List */}
              <Col lg="8" md="12">
                <div className="cart__card">
                  <div className="cart__header">
                    <h4 className="cart__title">
                      Danh Sách Sản Phẩm ({totalItemsCount} món)
                    </h4>
                    <span className="cart__badge">Miễn Phí Vận Chuyển Toàn Quốc</span>
                  </div>

                  <div className="cart__items-list">
                    {cartItems.map((item, index) => (
                      <CartItemRow
                        item={item}
                        key={item.id || index}
                        token={token}
                        getCartData={getCartData}
                      />
                    ))}
                  </div>
                </div>
              </Col>

              {/* Right Column: Order Summary */}
              <Col lg="4" md="12">
                <div className="cart__summary-card">
                  <h4 className="summary__title">Tóm Tắt Đơn Hàng</h4>

                  <div className="summary__row">
                    <span className="summary__label">Tạm tính ({totalItemsCount} món)</span>
                    <span className="summary__value">
                      {totalAmount.toLocaleString("vi-VN")} VNĐ
                    </span>
                  </div>

                  <div className="summary__row">
                    <span className="summary__label">Vận chuyển & lắp đặt</span>
                    <span className="summary__badge-free">Miễn Phí</span>
                  </div>

                  <div className="summary__row">
                    <span className="summary__label">Bảo hành chính hãng</span>
                    <span className="summary__value">10 Năm</span>
                  </div>

                  <div className="summary__divider"></div>

                  <div className="summary__total-row">
                    <div>
                      <span className="total-title">Tổng Thanh Toán</span>
                      <span className="total-tax-note">(Đã bao gồm thuế VAT)</span>
                    </div>
                    <span className="total-price">
                      {totalAmount.toLocaleString("vi-VN")} VNĐ
                    </span>
                  </div>

                  {/* Large Buttons with Uiverse bitter-parrot-97 effect */}
                  <div className="summary__actions">
                    <UiverseButton
                      text="Tiến Hành Thanh Toán"
                      onClick={handleCheckout}
                      variant="vibrant"
                      className="w-100"
                      icon="ri-shield-check-line"
                    />

                    <div className="mt-3">
                      <UiverseButton
                        text="Tiếp Tục Mua Sắm"
                        to="/shop"
                        variant="dark"
                        className="w-100"
                        icon="ri-arrow-go-back-line"
                      />
                    </div>
                  </div>

                  {/* Trust guarantees */}
                  <div className="summary__guarantees">
                    <div className="guarantee-item">
                      <i className="ri-lock-2-line"></i>
                      <span>Thanh toán bảo mật SSL 256-bit</span>
                    </div>
                    <div className="guarantee-item">
                      <i className="ri-truck-line"></i>
                      <span>Giao lắp tận phòng chu đáo</span>
                    </div>
                    <div className="guarantee-item">
                      <i className="ri-refresh-line"></i>
                      <span>30 ngày đổi trả miễn phí</span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </section>
    </Helmet>
  );
};

const CartItemRow = ({ item, token, getCartData }) => {
  const [deleting, setDeleting] = useState(false);

  const deleteProduct = async () => {
    try {
      setDeleting(true);
      await deleteCartItem(item.id, token);
      toast.success("Đã xóa sản phẩm khỏi giỏ");
      getCartData();
    } catch (error) {
      toast.error("Không thể xóa sản phẩm");
    } finally {
      setDeleting(false);
    }
  };

  const imgSrc = (
    Array.isArray(item.imageUrl) ? item.imageUrl[0] : item.imageUrl || "/noavatar.png"
  ).replace(/^http:\/\//i, "https://");

  const lineTotal = Number(item.price || 0) * (item.quantity || 1);

  return (
    <div className={`cart-item ${deleting ? "is-deleting" : ""}`}>
      <Link to={`/shop/${item.id}`} className="cart-item__thumb-wrap">
        <img
          src={imgSrc}
          alt={item.name}
          className="cart-item__thumb"
          onError={(e) => {
            e.target.src = "/noavatar.png";
          }}
        />
      </Link>

      <div className="cart-item__info">
        <span className="cart-item__category">Nội Thất Cao Cấp</span>
        <h5 className="cart-item__name">
          <Link to={`/shop/${item.id}`}>{item.name}</Link>
        </h5>
        <div className="cart-item__price-unit">
          Đơn giá: {Number(item.price || 0).toLocaleString("vi-VN")} VNĐ
        </div>
      </div>

      <div className="cart-item__qty-box">
        <span className="qty-label">Số lượng</span>
        <span className="qty-badge">{item.quantity}</span>
      </div>

      <div className="cart-item__total-box">
        <span className="total-label">Thành tiền</span>
        <span className="cart-item__total-price">
          {lineTotal.toLocaleString("vi-VN")} VNĐ
        </span>
      </div>

      <div className="cart-item__action">
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          onClick={deleteProduct}
          className="cart-item__del-btn"
          title="Xóa khỏi giỏ hàng"
          disabled={deleting}
          type="button"
        >
          <i className="ri-delete-bin-line"></i>
        </motion.button>
      </div>
    </div>
  );
};

export default Cart;

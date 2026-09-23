import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Row } from "reactstrap";
import { toast } from "react-toastify";

import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import ProductsList from "../components/UI/ProductsList";
import UiverseButton from "../components/UI/UiverseButton";
import { wishlistActions } from "../redux/slices/wishlistSlice";

import "../styles/wishlist.css";

const Wishlist = () => {
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const totalWishlist = useSelector((state) => state.wishlist.totalWishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClearAll = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ sản phẩm yêu thích?")) {
      dispatch(wishlistActions.clearWishlist());
      toast.info("Đã xóa toàn bộ sản phẩm yêu thích");
    }
  };

  return (
    <Helmet title="Sản Phẩm Yêu Thích - Nội Thất Cao Cấp">
      <CommonSection title="Sản Phẩm Yêu Thích" />

      <section className="wishlist__section">
        <Container>
          {wishlistItems.length === 0 ? (
            <div className="wishlist__empty-card">
              <div className="wishlist__empty-icon">
                <i className="ri-heart-line"></i>
              </div>
              <h3 className="wishlist__empty-title">
                Danh Sách Yêu Thích Đang Trống
              </h3>
              <p className="wishlist__empty-sub">
                Hãy khám phá các bộ sưu tập nội thất cao cấp và lưu lại những sản phẩm bạn yêu thích bằng cách nhấn vào biểu tượng trái tim.
              </p>
              <div className="d-flex justify-content-center">
                <UiverseButton
                  text="Khám Phá Cửa Hàng Ngay"
                  variant="vibrant"
                  icon="ri-store-2-line"
                  onClick={() => navigate("/shop")}
                />
              </div>
            </div>
          ) : (
            <>
              {/* Header Action Bar */}
              <div className="wishlist__header-bar d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div className="wishlist__count-badge">
                  Bạn đang lưu <strong>{totalWishlist}</strong> sản phẩm trong danh sách yêu thích
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="wishlist__clear-btn"
                    onClick={handleClearAll}
                  >
                    <i className="ri-delete-bin-line"></i> Xóa tất cả
                  </button>
                  <button
                    type="button"
                    className="wishlist__continue-btn"
                    onClick={() => navigate("/shop")}
                  >
                    <i className="ri-shopping-bag-line"></i> Tiếp tục mua sắm
                  </button>
                </div>
              </div>

              {/* Product Grid */}
              <Row>
                <ProductsList data={wishlistItems} />
              </Row>
            </>
          )}
        </Container>
      </section>
    </Helmet>
  );
};

export default Wishlist;

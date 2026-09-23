import React from "react";
import { motion } from "framer-motion";
import "../../styles/product-card.css";
import { Col } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../redux/slices/cartSlice";
import { wishlistActions } from "../../redux/slices/wishlistSlice";
import { addToCartService } from "../../service/cartService";

const ProductCard = ({ item }) => {
  const isLoggedIn = useSelector((state) => !!state.auth.token);
  const token = useSelector((state) => state.auth.token);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const isFavorite = wishlistItems.some((fav) => fav.id === item.id);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleWishlistHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(wishlistActions.toggleWishlist(item));
    if (isFavorite) {
      toast.info("Đã xóa khỏi danh sách yêu thích");
    } else {
      toast.success("Đã thêm vào danh sách yêu thích ❤️");
    }
  };

  const addToCart = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      navigate("/login");
    } else {
      try {
        toast.success("Đã thêm vào giỏ hàng");
        const response = await addToCartService(item.id, token);
        const { productsInCart } = response.data;
        const totalQuantity = productsInCart.reduce((acc, currentItem) => {
          return acc + currentItem.quantity;
        }, 0);

        dispatch(cartActions.setTotalQuantity(totalQuantity));
      } catch (error) {
        // Handled silently
      }
    }
  };

  const imgSrc = (
    Array.isArray(item.imageUrl)
      ? item.imageUrl[0]
      : item.imageUrl || "/noavatar.png"
  ).replace(/^http:\/\//i, "https://");

  const categoryName =
    item.category ||
    (item.productType && item.productType.category) ||
    "Nội thất";

  const formattedPrice = item.price
    ? Number(item.price).toLocaleString("vi-VN") + " VNĐ"
    : "Liên hệ";

  return (
    <Col lg="3" md="6" sm="6" className="mb-4">
      <div className="product__item">
        <div className="product__img-box">
          <span className="product__category-tag">{categoryName}</span>
          <motion.button
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.15 }}
            className={`product__fav-btn ${isFavorite ? "is-favorite" : ""}`}
            onClick={toggleWishlistHandler}
            title={isFavorite ? "Bỏ yêu thích" : "Lưu vào yêu thích"}
            type="button"
          >
            <i className={isFavorite ? "ri-heart-fill" : "ri-heart-line"}></i>
          </motion.button>
          <Link to={`/shop/${item.id}`} className="product__img-link">
            <img
              src={imgSrc}
              alt={item.name || "Product"}
              loading="lazy"
              onError={(e) => {
                e.target.src = "/noavatar.png";
              }}
            />
          </Link>
        </div>

        <div className="product__bottom-content">
          <div className="product__rating">
            <i className="ri-star-fill"></i>
            <span>4.9</span>
            <span className="rating__count">(48)</span>
          </div>

          <h3 className="product__name">
            <Link to={`/shop/${item.id}`} title={item.name}>
              {item.name}
            </Link>
          </h3>

          <div className="product__card-bottom d-flex align-items-center justify-content-between">
            <span className="price">{formattedPrice}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              className="product__add-btn"
              onClick={addToCart}
              title="Thêm vào giỏ hàng"
              type="button"
            >
              <i className="ri-shopping-bag-line"></i>
            </motion.button>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;

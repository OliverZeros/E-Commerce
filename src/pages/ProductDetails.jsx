import React, { useState, useRef, useEffect } from "react";

import { Container, Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import CommonSection from "../components/UI/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import { motion } from "framer-motion";
import ProductsList from "../components/UI/ProductsList";
import { addToCartService } from "../service/cartService";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../redux/slices/cartSlice";
import { wishlistActions } from "../redux/slices/wishlistSlice";
import { getProductById } from "../service/productService";
import { useNavigate } from "react-router-dom";

import "../styles/product-details.css";

const ProductDetails = () => {
  const products = useSelector((state) => state.products.products);
  const token = useSelector((state) => state.auth.token);
  const [tab, setTab] = useState("desc");
  const reviewUser = useRef("");
  const reviewMsg = useRef("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const product = products.find((item) => item.id === id);
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [loading, setLoading] = useState(!product);

  const currentProduct = product || fetchedProduct;

  useEffect(() => {
    if (!product && id) {
      setLoading(true);
      getProductById(id)
        .then((res) => {
          setFetchedProduct(res.data);
        })
        .catch((err) => {
          console.error("Failed to load product detail:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [id, product]);

  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const [rating, setRating] = useState(null);
  const isFavorite = wishlistItems.some((fav) => fav.id === id);

  const toggleWishlist = () => {
    if (!currentProduct) return;
    dispatch(wishlistActions.toggleWishlist(currentProduct));
    if (isFavorite) {
      toast.info("Đã xóa khỏi danh sách yêu thích");
    } else {
      toast.success("Đã thêm vào danh sách yêu thích ❤️");
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const reviewUserName = reviewUser.current.value;
    const reviewUserMsg = reviewMsg.current.value;

    const revewObj = {
      userName: reviewUserName,
      text: reviewUserMsg,
      rating,
    };

    console.log(revewObj);
    toast.success("Review submitted");
  };

  const relatedProducts = (products || []).filter((item) => {
    if (!currentProduct) return false;
    const currentCat =
      currentProduct.category || currentProduct.productType?.category;
    const itemCat = item.category || item.productType?.category;
    return currentCat && itemCat === currentCat && item.id !== currentProduct.id;
  });

  const addToCart = async () => {
    if (!token) {
      toast.error("Please login to add the product to the cart");
      navigate("/login");
      return;
    }

    toast.success("Product added to cart successfully");
    try {
      const response = await addToCartService(id, token);
      const { productsInCart } = response.data;
      const totalQuantity = productsInCart.reduce((acc, item) => {
        return acc + item.quantity;
      }, 0);

      dispatch(cartActions.setTotalQuantity(totalQuantity));
    } catch (error) {}
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentProduct]);

  if (loading) {
    return (
      <Helmet title="Đang tải...">
        <CommonSection title="Chi Tiết Sản Phẩm" />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Đang tải thông tin sản phẩm...</p>
        </div>
      </Helmet>
    );
  }

  if (!currentProduct) {
    return (
      <Helmet title="Không tìm thấy sản phẩm">
        <CommonSection title="Sản Phẩm Không Tồn Tại" />
        <div className="text-center py-5">
          <h3 className="text-muted mb-3">Sản phẩm không tồn tại hoặc đã bị xóa.</h3>
          <button className="buy__btn" onClick={() => navigate("/shop")}>
            Khám phá cửa hàng
          </button>
        </div>
      </Helmet>
    );
  }

  const imgSrc = (
    Array.isArray(currentProduct.imageUrl)
      ? currentProduct.imageUrl[0]
      : currentProduct.imageUrl || "/noavatar.png"
  ).replace(/^http:\/\//i, "https://");

  const categoryName =
    currentProduct.category ||
    currentProduct.productType?.category ||
    "Nội thất";

  const formattedPrice = currentProduct.price
    ? Number(currentProduct.price).toLocaleString("vi-VN") + " VNĐ"
    : "Liên hệ";

  return (
    <Helmet title={currentProduct.name}>
      <CommonSection title={currentProduct.name} />
      <section className="pt-0">
        <Container>
          <Row>
            <Col lg="6">
              <div className="product__image">
                <img
                  src={imgSrc}
                  alt={currentProduct.name}
                  onError={(e) => {
                    e.target.src = "/noavatar.png";
                  }}
                />
              </div>
            </Col>

            <Col lg="6">
              <div className="product__details">
                <h2>{currentProduct.name}</h2>
                <div className="product__rating d-flex align-item-center gap-5 mb-3">
                  <div>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i className="ri-star-s-fill"></i>
                    </span>
                  </div>
                  <p>
                    (<span>{currentProduct.rating || 5}</span> ratings)
                  </p>
                </div>

                <div className="d-flex align-items-center gap-5">
                  <span className="product__price">{formattedPrice}</span>
                  <span>Danh mục: {categoryName}</span>
                </div>
                <div className="d-flex align-items-center gap-3 mt-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="buy__btn m-0"
                    onClick={addToCart}
                  >
                    <i className="ri-shopping-bag-line me-1"></i> Add to Cart
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ scale: 1.04 }}
                    type="button"
                    className={`wishlist__btn ${isFavorite ? "active" : ""}`}
                    onClick={toggleWishlist}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "8px",
                      border: isFavorite ? "1px solid #ef4444" : "1px solid #cbd5e1",
                      backgroundColor: isFavorite ? "#fef2f2" : "#ffffff",
                      color: isFavorite ? "#ef4444" : "#475569",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.2s ease",
                      boxShadow: isFavorite ? "0 2px 10px rgba(239, 68, 68, 0.15)" : "0 2px 6px rgba(0,0,0,0.04)",
                    }}
                  >
                    <i
                      className={isFavorite ? "ri-heart-fill" : "ri-heart-line"}
                      style={{ fontSize: "1.2rem", color: isFavorite ? "#ef4444" : "#64748b" }}
                    ></i>
                    <span>{isFavorite ? "Đã Yêu Thích" : "Lưu Yêu Thích"}</span>
                  </motion.button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="12">
              <div className="tab__wrapper d-flex align-items-center gap-5">
                <h6
                  className={`${tab === "desc" ? "active__tab" : ""}`}
                  onClick={() => setTab("desc")}
                >
                  Descrpition
                </h6>
                <h6
                  className={`${tab === "rev" ? "active__tab" : ""}`}
                  onClick={() => setTab("rev")}
                >
                  Reviews
                </h6>
              </div>
              {tab === "desc" ? (
                <div className="tab__content mt-5">
                  <p>{currentProduct.description || "Chưa có mô tả chi tiết cho sản phẩm này."}</p>
                </div>
              ) : (
                <div className="product__review">
                  <div className="review__wrapper">
                    <ul>
                      <li className="mb-4">
                        <h6>Jhon Doe</h6>
                        <span>{currentProduct.rating || 5}( rating)</span>
                      </li>
                    </ul>

                    <div className="review__form">
                      <h4>Leave your experience</h4>
                      <form action="" onSubmit={submitHandler}>
                        <div className="form__group">
                          <input
                            type="text"
                            placeholder="Enter your Name"
                            ref={reviewUser}
                            required
                          />
                        </div>

                        <div className="form__group d-flex align-items-center gap-5 rating__group">
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(1)}
                          >
                            1<i class="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(2)}
                          >
                            2<i class="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(3)}
                          >
                            3<i class="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(4)}
                          >
                            4<i class="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(5)}
                          >
                            5<i class="ri-star-s-fill"></i>
                          </motion.span>
                        </div>

                        <div className="form__group">
                          <textarea
                            ref={reviewMsg}
                            rows={4}
                            type="text"
                            placeholder="Enter your Review"
                            required
                          />
                        </div>

                        <motion.button
                          whileTap={{ scale: 1.2 }}
                          type="submit"
                          className="buy__btn"
                        >
                          Submit
                        </motion.button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </Col>

            <Col lg="12" className="mt-5">
              <h2 className="related__title">You might also like</h2>
            </Col>

            <ProductsList data={relatedProducts} />
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default ProductDetails;

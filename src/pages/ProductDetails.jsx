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

  const [rating, setRating] = useState(null);
  const { id } = useParams();
  const product = products.find((item) => item.id === id);

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
  const relatedProducts = products.filter(
    (item) => item.productType.category === product.productType.category
  );

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
  }, [product]);

  return (
    <Helmet title={product.name}>
      <CommonSection title={product.name} />
      <section className="pt-0">
        <Container>
          <Row>
            <Col lg="6">
              <div className="product__image">
                <img src={product.imageUrl} alt={product.name} />
              </div>
            </Col>

            <Col lg="6">
              <div className="product__details">
                <h2>{product.name}</h2>
                <div className="product__rating d-flex align-item-center gap-5 mb-3">
                  <div>
                    <span>
                      <i class="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i class="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i class="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i class="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i class="ri-star-s-fill"></i>
                    </span>
                  </div>
                  <p>
                    (<span>{product.rating}</span> ratings)
                  </p>
                </div>

                <div className="d-flex align-items-center gap-5">
                  <span className="product__price">{product.price} VNĐ</span>
                  <span>Category:{product.productType.category}</span>
                </div>
                <motion.button
                  whileTap={{ scale: 1.2 }}
                  className="buy__btn"
                  onClick={addToCart}
                >
                  Add to Cart
                </motion.button>
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
                  <p>{product.description}</p>
                </div>
              ) : (
                <div className="product__review">
                  <div className="review__wrapper">
                    <ul>
                      <li className="mb-4">
                        <h6>Jhon Doe</h6>
                        <span>{product.rating}( rating)</span>
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

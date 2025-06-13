import React from "react";
import { motion } from "framer-motion";
import "../../styles/product-card.css";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { cartActions } from "../../redux/slices/cartSlice";
import { addToCartService } from "../../service/cartService";

import { useSelector } from "react-redux";

const ProductCard = ({ item }) => {
  const isLoggedIn = useSelector((state) => (state.auth.token ? true : false));
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const addToCart = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to add the product to the cart");
      navigate("/login");
    } else {
      toast.success("Product added successfully");
      try {
        const response = await addToCartService(item.id, token);
        const { productsInCart } = response.data;
        const totalQuantity = productsInCart.reduce((acc, item) => {
          return acc + item.quantity;
        }, 0);

        dispatch(cartActions.setTotalQuantity(totalQuantity));
      } catch (error) {}
    }
  };

  return (
    <Col lg="3" md="4" className="mb-2">
      <div className="product__item">
        <div className="product__img">
          <Link to={`/shop/${item.id}`}>
            <motion.img
              whileHover={{ scale: 0.9 }}
              src={item.imageUrl}
              alt=""
              style={{ width: "310px", height: "310px" }}
            />
          </Link>
        </div>
        <div className="product__bottom">
          <div className="p-2 product__info">
            <h3 className="product__name">
              <Link to={`/shop/${item.id}`}>{item.name}</Link>
            </h3>
            <span>{item.category}</span>
          </div>
          <div className="product__card-bottom d-flex align-items-center justify-content-between p-2">
            <span className="price">{item.price} VNĐ</span>
            <motion.span whileTap={{ scale: 1.2 }} onClick={addToCart}>
              <i class="ri-add-line"></i>
            </motion.span>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;

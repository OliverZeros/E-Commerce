import React from "react";
import { motion } from "framer-motion";
import "../../styles/product-card.css";
import { Col } from "reactstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../redux/slices/cartSlice";

const ProductCard = ({ item }) => {
  const isLoggedIn = useSelector((state) => (state.auth.token ? true : false));
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCart = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to add the product to the cart");
      navigate("/login");
    } else {
      dispatch(
        cartActions.addItem({
          id: item.id,
          productName: item.name,
          price: item.price,
          imgUrl: item.imageUrl,
        })
      );
      toast.success("Product added successfully");
      const response = await axios.post(
        "https://ece-project.adaptable.app/cart/add",
        { productid: item.id },
        {
          headers: {
            Authorization: token,
          },
        }
      );
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

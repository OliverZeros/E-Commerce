import React from "react";
import "../styles/cart.css";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { Container, Row, Col } from "reactstrap";

import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

import { toast } from "react-toastify";
import { getCartItems, deleteCartItem } from "../service/cartService";
import { useEffect, useState } from "react";

const Cart = () => {
  const token = useSelector((state) => state.auth.token);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCheckout = () => {
    if (token) {
      navigate("/checkout");
    } else {
      navigate("/login");
    }
  };

  const getCartData = async () => {
    try {
      const response = await getCartItems(token);
      const { productsInCart } = response.data;
      setCartItems(productsInCart);
      const total = productsInCart.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0);
      setTotalAmount(total);
      const totalQuantity = productsInCart.reduce((acc, item) => {
        return acc + item.quantity;
      }, 0);
      dispatch(cartActions.setTotalQuantity(totalQuantity));
    } catch (error) {
      // console.error("Failed to fetch cart items", error);
      return [];
    }
  };

  useEffect(() => {
    getCartData();
  }, [token]);

  return (
    <Helmet title="Cart">
      <CommonSection title="Shopping Cart" />
      <section>
        <Container>
          <Row>
            <Col lg="9">
              {cartItems.length === 0 ? (
                <h2 className="fs-4 text-center">No item added to the cart</h2>
              ) : (
                <table className="table bordered">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product Name</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Delete</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cartItems.map((item, index) => (
                      <Tr
                        item={item}
                        key={index}
                        token={token}
                        getCartData={getCartData}
                      />
                    ))}
                  </tbody>
                </table>
              )}
            </Col>

            <Col lg="3">
              <div>
                <h6 className="d-flex align-item-center justify-content-between">
                  Subtotal
                  <span className="fs-4 fw-bold">{totalAmount} VNĐ</span>
                </h6>
              </div>
              <p className="fs-6 mt-2">
                Thuế và phí vận chuyển sẽ được tính khi thanh toán
              </p>
              <div>
                <button onClick={handleCheckout} className="buy__btn w-100">
                  Checkout
                </button>

                <Link to="/shop">
                  <button className="buy__btn w-100 mt-3">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

const Tr = ({ item, token, getCartData }) => {
  const deleteProduct = async () => {
    try {
      await deleteCartItem(item.id, token);
      toast.success("Product removed from cart");
      getCartData();
    } catch (error) {
      console.error("Failed to delete product from cart", error);
    }
  };
  return (
    <tr>
      <td>
        <img src={item.imageUrl} alt="" />
      </td>
      <td>{item.name}</td>
      <td>{item.price} VNĐ</td>
      <td>{item.quantity}</td>
      <td>
        <motion.i
          whileTap={{ scale: 1.2 }}
          onClick={deleteProduct}
          class="ri-delete-bin-line delete-icon"
        ></motion.i>
      </td>
    </tr>
  );
};

export default Cart;

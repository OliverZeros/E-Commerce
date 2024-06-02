import React, { useEffect, useState } from "react";
import "../styles/cart.css";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { Container, Row, Col } from "reactstrap";

import { motion } from "framer-motion";
import { cartActions } from "../redux/slices/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const Order = () => {
  const isLoggedIn = useSelector((state) => (state.auth.token ? true : false));
  const token = useSelector((state) => state.auth.token);
  const [orderItems, setOrderItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getOrder = async () => {
      const response = await axios.get(
        "https://ece-project.adaptable.app/receipt/get",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const orders = response.data;
      const products = orders[0].products;
      setOrderItems(products);
    };
    getOrder();
  }, []);

  return (
    <Helmet title="Cart">
      <CommonSection title="Order" />
      <section>
        <Container>
          <Row>
            <Col lg="12">
              {orderItems.length === 0 ? (
                <h2 className="fs-4 text-center">No item added to the cart</h2>
              ) : (
                <table className="table bordered">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Qty</th>
                    </tr>
                  </thead>

                  <tbody>
                    {orderItems.map((item, index) => (
                      <Tr item={item} key={index} />
                    ))}
                  </tbody>
                </table>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

const Tr = ({ item }) => {
  return (
    <tr>
      <td>
        <img src={item.imageUrl} alt="" />
      </td>
      <td>{item.name}</td>
      <td>{item.price} VNĐ</td>
      <td>{item.quantity}</td>
    </tr>
  );
};

export default Order;

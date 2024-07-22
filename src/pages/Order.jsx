import React, { useEffect, useState } from "react";
import "../styles/order.css";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { Container, Row, Col } from "reactstrap";

import { useSelector } from "react-redux";

import axios from "axios";

const Order = () => {
  const token = useSelector((state) => state.auth.token);
  const [orderInfo, setOrderInfo] = useState([]);

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
      setOrderInfo(orders);
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
              <h3>Order Details</h3>
              {orderInfo.length === 0 ? (
                <h2 className="fs-4 text-center">No item added to the cart</h2>
              ) : (
                <div>
                  {orderInfo.map((item, index) => (
                    <div className="order__card">
                      <table className="order__info">
                        <tr>
                          <th>Name: </th>
                          <td>{item.billingInfo.name}</td>
                        </tr>
                        <tr>
                          <th>Phone Number: </th>
                          <td>{item.billingInfo.phoneNumber}</td>
                        </tr>
                        <tr>
                          <th>Address: </th>
                          <td>{item.billingInfo.address}</td>
                        </tr>
                        <tr>
                          <th>Date Created :</th>
                          <td>
                            {new Date(item.createdAt).toLocaleString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </td>
                        </tr>
                      </table>

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
                          {orderInfo[index].products.map((item, index) => (
                            <Tr item={item} key={index} />
                          ))}
                        </tbody>
                      </table>
                      <hr />
                    </div>
                  ))}
                </div>
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

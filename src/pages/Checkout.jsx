import React, { useState } from "react";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import { toast } from "react-toastify";
import CommonSection from "../components/UI/CommonSection";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/checkout.css";

import { useSelector } from "react-redux";

const Checkout = () => {
  const totalQty = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(
      "https://ece-project.adaptable.app/receipt/create",
      {
        name,
        phoneNumber,
        address,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const response = await axios.get(
      "https://ece-project.adaptable.app/receipt/get",
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const receiptId = response.data[0].id;
    const status = await axios.post(
      "https://ece-project.adaptable.app/receipt/pay",
      {
        receiptid: receiptId,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    toast.success(
      "Payment completed successfully! Thank you for your purchase!"
    );
    navigate("/home");
  };
  return (
    <Helmet title="Checkout">
      <CommonSection title="Checkout" />
      <section>
        <Container>
          <Row>
            <Col lg="8">
              <h6 className="mb-4 fw-bold">Billing Information</h6>
              <Form className="billing__form">
                <FormGroup className="form__group">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup className="form__group">
                  <input
                    type="number"
                    placeholder="Enter your Phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup className="form__group">
                  <input
                    type="text"
                    placeholder="Enter your Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </FormGroup>
              </Form>
            </Col>

            <Col lg="4">
              <div className="checkout__cart">
                <h6>
                  Total Qty: <span>{totalQty}</span>
                </h6>
                <h6>
                  Subtotal: <span>{totalAmount} VNĐ</span>
                </h6>
                <h6>
                  Shipping: <span>0</span>
                </h6>
                <h6>Free shipping</h6>
                <h4>
                  Total Cost: <span>{totalAmount} VNĐ</span>
                </h4>
                <button
                  className="buy__btn auth__btn w-100"
                  onClick={handleSubmit}
                >
                  Place an order
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Checkout;

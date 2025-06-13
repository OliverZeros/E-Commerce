import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import { toast } from "react-toastify";
import CommonSection from "../components/UI/CommonSection";
import { useNavigate } from "react-router-dom";
import { getCartItems } from "../service/cartService";
import {
  createReceipt,
  getReceipts,
  payReceipt,
} from "../service/receiptService";

import "../styles/checkout.css";

import { useSelector } from "react-redux";

const Checkout = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalQty, setTotalQty] = useState(0);

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const calTotalAmount = async () => {
    try {
      const response = await getCartItems(token);
      const { productsInCart } = response.data;
      setTotalQty(productsInCart.reduce((acc, item) => acc + item.quantity, 0));
      setTotalAmount(
        productsInCart.reduce((acc, item) => {
          return acc + item.price * item.quantity;
        }, 0)
      );
    } catch (error) {
      // console.error("Failed to fetch cart items", error);
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createReceipt(
      {
        name,
        phoneNumber,
        address,
      },
      token
    );
    const response = await getReceipts(token);
    const receiptId = response.data[0].id;
    const status = await payReceipt(receiptId, token);

    toast.success(
      "Payment completed successfully! Thank you for your purchase!"
    );
    navigate("/home");
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      calTotalAmount();
    }
  }, []);

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

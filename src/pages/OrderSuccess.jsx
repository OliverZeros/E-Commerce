import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import "../styles/order.css";

const OrderSuccess = () => {
  const location = useLocation();
  const orderData = location.state || {};

  const {
    receiptId = "ORD-" + Math.floor(100000 + Math.random() * 900000),
    billingInfo = {},
    products = [],
    totalAmount = 0,
    shippingFee = 0,
    discount = 0,
    paymentMethod = "Credit Card",
    isPaid = true,
  } = orderData;

  const grandTotal = Math.max(0, totalAmount + shippingFee - discount);

  return (
    <Helmet title="Order Confirmation">
      <CommonSection title="Order Confirmation" />
      <section className="order__success-section py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg="8" md="10">
              <div className="order__success-card p-4 p-md-5 rounded-4 shadow-sm bg-white border">
                {/* Success Header */}
                <div className="text-center mb-4">
                  <div className="order__success-icon mb-3">
                    <i
                      className="ri-checkbox-circle-fill text-success"
                      style={{ fontSize: "4.5rem" }}
                    ></i>
                  </div>
                  <h2 className="fw-bold mb-2">Thank You For Your Order!</h2>
                  <p className="text-muted fs-6">
                    A confirmation email will be sent shortly. Your order is now being processed.
                  </p>
                  <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-light border mt-2">
                    <span className="fw-semibold text-muted">Order ID:</span>
                    <span className="fw-bold text-dark font-monospace">
                      #{receiptId.slice(-8).toUpperCase()}
                    </span>
                  </div>
                </div>

                <hr className="my-4" style={{ borderColor: "#eee" }} />

                {/* Order Meta Details */}
                <div className="row g-3 mb-4">
                  <div className="col-sm-6">
                    <div className="p-3 rounded-3 bg-light h-100">
                      <div className="d-flex align-items-center gap-2 mb-2 text-primary">
                        <i className="ri-map-pin-line fs-5"></i>
                        <h6 className="fw-bold mb-0">Delivery Address</h6>
                      </div>
                      <p className="mb-1 fw-semibold text-dark">{billingInfo.name || "Customer"}</p>
                      <p className="mb-1 text-muted fs-6">{billingInfo.phoneNumber || "N/A"}</p>
                      <p className="mb-0 text-muted fs-6">{billingInfo.address || "N/A"}</p>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="p-3 rounded-3 bg-light h-100">
                      <div className="d-flex align-items-center gap-2 mb-2 text-primary">
                        <i className="ri-bank-card-line fs-5"></i>
                        <h6 className="fw-bold mb-0">Payment Summary</h6>
                      </div>
                      <p className="mb-1">
                        <span className="text-muted">Method: </span>
                        <span className="fw-semibold text-dark">{paymentMethod}</span>
                      </p>
                      <p className="mb-1">
                        <span className="text-muted">Status: </span>
                        <span
                          className={`badge ${
                            isPaid ? "bg-success" : "bg-warning text-dark"
                          }`}
                        >
                          {isPaid ? "Paid Successfully" : "Pending COD Payment"}
                        </span>
                      </p>
                      <p className="mb-0">
                        <span className="text-muted">Estimated Delivery: </span>
                        <span className="fw-semibold text-dark">2 - 3 Business Days</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Purchased Items List */}
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <i className="ri-shopping-bag-3-line text-primary"></i>
                  Ordered Items ({products.reduce((acc, i) => acc + (i.quantity || 1), 0)})
                </h6>
                <div className="order__items-container mb-4 border rounded-3 p-2 bg-light">
                  {products.length === 0 ? (
                    <p className="text-muted p-2 mb-0">No item details available</p>
                  ) : (
                    products.map((item, idx) => (
                      <div
                        key={idx}
                        className="d-flex align-items-center justify-content-between p-2 border-bottom last-border-0 bg-white rounded-2 mb-1"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={
                              Array.isArray(item.imageUrl)
                                ? item.imageUrl[0]
                                : item.imageUrl || "/noavatar.png"
                            }
                            alt={item.name}
                            style={{
                              width: "55px",
                              height: "55px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                          <div>
                            <p className="mb-0 fw-bold text-dark">{item.name}</p>
                            <small className="text-muted">Qty: {item.quantity}</small>
                          </div>
                        </div>
                        <div className="text-end">
                          <span className="fw-bold text-dark">
                            {(item.price * item.quantity).toLocaleString("vi-VN")} VNĐ
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Financial Summary */}
                <div className="order__financials p-3 rounded-3 bg-light mb-4">
                  <div className="d-flex justify-content-between mb-2 fs-6">
                    <span className="text-muted">Subtotal</span>
                    <span className="fw-semibold">
                      {Number(totalAmount).toLocaleString("vi-VN")} VNĐ
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2 fs-6">
                    <span className="text-muted">Shipping Fee</span>
                    <span className="fw-semibold text-success">
                      {shippingFee > 0
                        ? `${Number(shippingFee).toLocaleString("vi-VN")} VNĐ`
                        : "Free Shipping"}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="d-flex justify-content-between mb-2 fs-6 text-danger">
                      <span>Discount Applied</span>
                      <span className="fw-semibold">
                        -{Number(discount).toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>
                  )}
                  <hr className="my-2" />
                  <div className="d-flex justify-content-between fs-5 fw-bold text-dark">
                    <span>Total Paid</span>
                    <span className="text-primary">
                      {Number(grandTotal).toLocaleString("vi-VN")} VNĐ
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex flex-wrap gap-3 justify-content-between mt-4">
                  <button
                    onClick={() => window.print()}
                    className="btn btn-outline-secondary d-flex align-items-center gap-2 px-3 py-2"
                  >
                    <i className="ri-printer-line"></i> Print Receipt
                  </button>

                  <div className="d-flex gap-2">
                    <Link to="/order">
                      <button className="btn btn-outline-primary px-4 py-2">
                        View Order History
                      </button>
                    </Link>
                    <Link to="/shop">
                      <button className="btn btn-primary px-4 py-2 text-white">
                        Continue Shopping
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default OrderSuccess;

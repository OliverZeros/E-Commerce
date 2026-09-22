import React, { useEffect, useState, useMemo } from "react";
import { Container, Row, Col } from "reactstrap";
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
import { useSelector } from "react-redux";
import "../styles/checkout.css";

const Checkout = () => {
  // Navigation & Auth
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  // Cart & Order State
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Stepper: 1: Shipping, 2: Delivery, 3: Payment, 4: Review
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Shipping Info
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Hà Nội");
  const [address, setAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  // Step 2: Delivery Method
  const [shippingMethod, setShippingMethod] = useState("standard"); // 'standard' (0) or 'express' (35000)

  // Step 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState("card"); // 'card' | 'cod' | 'qr'
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Coupon / Discount
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // Fetch Cart Items
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        setLoadingCart(true);
        const response = await getCartItems(token);
        const items = response.data?.productsInCart || [];
        setCartItems(items);
        if (items.length === 0) {
          toast.info("Your cart is currently empty.");
        }
      } catch (error) {
        console.error("Failed to load cart items", error);
      } finally {
        setLoadingCart(false);
      }
    };

    fetchCart();
  }, [token, navigate]);

  // Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const totalQuantity = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const shippingCost = shippingMethod === "express" ? 35000 : 0;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const grandTotal = Math.max(0, subtotal + shippingCost - discountAmount);

  // Card formatting helpers
  const handleCardNumberChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = rawVal.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let rawVal = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (rawVal.length >= 3) {
      rawVal = `${rawVal.slice(0, 2)}/${rawVal.slice(2)}`;
    }
    setCardExpiry(rawVal);
  };

  const cardBrand = useMemo(() => {
    const cleanNum = cardNumber.replace(/\s/g, "");
    if (cleanNum.startsWith("4")) return "VISA";
    if (/^5[1-5]/.test(cleanNum)) return "MasterCard";
    if (/^3[47]/.test(cleanNum)) return "AMEX";
    if (/^35/.test(cleanNum)) return "JCB";
    return "CARD";
  }, [cardNumber]);

  // Apply Promo Code
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === "WELCOME10" || code === "SALE10") {
      setDiscountPercent(10);
      setCouponApplied(true);
      toast.success("Coupon applied! 10% discount added.");
    } else if (code === "FREESHIP") {
      setShippingMethod("standard");
      setDiscountPercent(0);
      setCouponApplied(true);
      toast.success("Free shipping coupon applied!");
    } else {
      toast.error("Invalid coupon code. Try 'WELCOME10'");
    }
  };

  // Validation before placing order
  const validateForm = () => {
    if (!name.trim()) {
      toast.warn("Please enter your recipient name.");
      setCurrentStep(1);
      return false;
    }
    if (!phoneNumber.trim() || phoneNumber.length < 9) {
      toast.warn("Please enter a valid phone number.");
      setCurrentStep(1);
      return false;
    }
    if (!address.trim()) {
      toast.warn("Please enter your delivery address.");
      setCurrentStep(1);
      return false;
    }
    if (paymentMethod === "card") {
      const cleanNum = cardNumber.replace(/\s/g, "");
      if (cleanNum.length < 15) {
        toast.warn("Please enter a valid card number (15-16 digits).");
        setCurrentStep(3);
        return false;
      }
      if (!cardExpiry.includes("/")) {
        toast.warn("Please enter card expiry date (MM/YY).");
        setCurrentStep(3);
        return false;
      }
      if (cardCvv.length < 3) {
        toast.warn("Please enter a valid CVV.");
        setCurrentStep(3);
        return false;
      }
    }
    return true;
  };

  // Submit Order
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty. Please add items to checkout.");
      navigate("/shop");
      return;
    }

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const fullAddress = `${address}, ${city}${
        orderNotes ? ` (Notes: ${orderNotes})` : ""
      }`;

      // 1. Create Receipt on Backend
      const createRes = await createReceipt(
        {
          name,
          phoneNumber,
          address: fullAddress,
        },
        token,
      );

      // Extract receiptId directly from response or fetch latest receipt
      let receiptId = createRes.data?.receiptId || createRes.data?.id;

      if (!receiptId) {
        const response = await getReceipts(token);
        if (response.data && response.data.length > 0) {
          receiptId = response.data[0].id;
        }
      }

      if (!receiptId) {
        throw new Error("Unable to retrieve order identifier.");
      }

      // 2. Process Payment on Backend
      // Both Card and QR trigger payReceipt for immediate success
      // If COD, receipt is created with isPaid=false pending delivery
      let isPaid = false;
      if (paymentMethod === "card" || paymentMethod === "qr") {
        await payReceipt(receiptId, token);
        isPaid = true;
      }

      toast.success("Order placed successfully! Thank you!");

      // 3. Navigate to Order Success Screen
      navigate("/order-success", {
        state: {
          receiptId,
          billingInfo: {
            name,
            phoneNumber,
            address: fullAddress,
          },
          products: cartItems,
          totalAmount: subtotal,
          shippingFee: shippingCost,
          discount: discountAmount,
          paymentMethod:
            paymentMethod === "card"
              ? `Credit Card (${cardBrand} ****${cardNumber.slice(-4)})`
              : paymentMethod === "qr"
              ? "VietQR Bank Transfer"
              : "Cash on Delivery (COD)",
          isPaid,
        },
      });
    } catch (error) {
      console.error("Order processing failed", error);
      const errMsg =
        error.response?.data?.message ||
        "Payment or order creation failed. Please try again.";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Helmet title="Checkout">
      <CommonSection title="International Checkout" />
      <section className="checkout__section py-5">
        <Container>
          {/* Stepper Progress Header */}
          <div className="checkout__stepper">
            <div
              className={`step__item ${currentStep >= 1 ? "active" : ""} ${
                currentStep > 1 ? "completed" : ""
              }`}
              onClick={() => setCurrentStep(1)}
            >
              <div className="step__circle">
                {currentStep > 1 ? <i className="ri-check-line"></i> : "1"}
              </div>
              <span className="step__label">Shipping</span>
            </div>

            <div
              className={`step__item ${currentStep >= 2 ? "active" : ""} ${
                currentStep > 2 ? "completed" : ""
              }`}
              onClick={() => setCurrentStep(2)}
            >
              <div className="step__circle">
                {currentStep > 2 ? <i className="ri-check-line"></i> : "2"}
              </div>
              <span className="step__label">Delivery</span>
            </div>

            <div
              className={`step__item ${currentStep >= 3 ? "active" : ""} ${
                currentStep > 3 ? "completed" : ""
              }`}
              onClick={() => setCurrentStep(3)}
            >
              <div className="step__circle">
                {currentStep > 3 ? <i className="ri-check-line"></i> : "3"}
              </div>
              <span className="step__label">Payment</span>
            </div>

            <div
              className={`step__item ${currentStep === 4 ? "active" : ""}`}
              onClick={() => setCurrentStep(4)}
            >
              <div className="step__circle">4</div>
              <span className="step__label">Review</span>
            </div>
          </div>

          <Row>
            {/* Left Column: Checkout Steps */}
            <Col lg="7" md="12">
              {/* STEP 1: Shipping Information */}
              <div
                className="checkout__box"
                style={{ display: currentStep === 1 ? "block" : "none" }}
              >
                <div className="checkout__box-title">
                  <i className="ri-map-pin-user-line text-primary"></i>
                  1. Shipping & Contact Information
                </div>

                <div className="row g-3">
                  <div className="col-sm-6 custom__form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      className="custom__input"
                      placeholder="e.g. Nguyen Van A"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-sm-6 custom__form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      className="custom__input"
                      placeholder="e.g. 0912345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-sm-6 custom__form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      className="custom__input"
                      placeholder="your.email@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="col-sm-6 custom__form-group">
                    <label>City / Province *</label>
                    <select
                      className="custom__input"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Hải Phòng">Hải Phòng</option>
                      <option value="Cần Thơ">Cần Thơ</option>
                      <option value="Khác">Tỉnh / Thành khác</option>
                    </select>
                  </div>

                  <div className="col-12 custom__form-group">
                    <label>Street Address & Apartment *</label>
                    <input
                      type="text"
                      className="custom__input"
                      placeholder="e.g. 123 Nguyen Trai, Thanh Xuan"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12 custom__form-group">
                    <label>Delivery Instructions (Optional)</label>
                    <textarea
                      className="custom__input"
                      rows="2"
                      placeholder="e.g. Deliver during office hours, call before arriving..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-3">
                  <button
                    className="btn btn-dark px-4 py-2"
                    onClick={() => {
                      if (!name.trim() || !phoneNumber.trim() || !address.trim()) {
                        toast.warn("Please fill in all required shipping fields.");
                        return;
                      }
                      setCurrentStep(2);
                    }}
                  >
                    Continue to Delivery <i className="ri-arrow-right-line ms-1"></i>
                  </button>
                </div>
              </div>

              {/* STEP 2: Delivery Method */}
              <div
                className="checkout__box"
                style={{ display: currentStep === 2 ? "block" : "none" }}
              >
                <div className="checkout__box-title">
                  <i className="ri-truck-line text-primary"></i>
                  2. Choose Shipping Speed
                </div>

                <div
                  className={`shipping__method-card ${
                    shippingMethod === "standard" ? "selected" : ""
                  }`}
                  onClick={() => setShippingMethod("standard")}
                >
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="radio"
                      checked={shippingMethod === "standard"}
                      onChange={() => setShippingMethod("standard")}
                    />
                    <div>
                      <h6 className="fw-bold mb-1">Standard Delivery</h6>
                      <small className="text-muted">Estimated 3-5 business days</small>
                    </div>
                  </div>
                  <span className="fw-bold text-success">FREE</span>
                </div>

                <div
                  className={`shipping__method-card ${
                    shippingMethod === "express" ? "selected" : ""
                  }`}
                  onClick={() => setShippingMethod("express")}
                >
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="radio"
                      checked={shippingMethod === "express"}
                      onChange={() => setShippingMethod("express")}
                    />
                    <div>
                      <h6 className="fw-bold mb-1">Express Fast Shipping</h6>
                      <small className="text-muted">Estimated 1-2 business days with Priority Handling</small>
                    </div>
                  </div>
                  <span className="fw-bold text-dark">35,000 VNĐ</span>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <button
                    className="btn btn-outline-secondary px-4 py-2"
                    onClick={() => setCurrentStep(1)}
                  >
                    <i className="ri-arrow-left-line me-1"></i> Back to Shipping
                  </button>
                  <button
                    className="btn btn-dark px-4 py-2"
                    onClick={() => setCurrentStep(3)}
                  >
                    Continue to Payment <i className="ri-arrow-right-line ms-1"></i>
                  </button>
                </div>
              </div>

              {/* STEP 3: Payment Method */}
              <div
                className="checkout__box"
                style={{ display: currentStep === 3 ? "block" : "none" }}
              >
                <div className="checkout__box-title">
                  <i className="ri-secure-payment-line text-primary"></i>
                  3. Select Payment Method
                </div>

                {/* Payment Tabs */}
                <div className="payment__methods-grid">
                  <div
                    className={`payment__method-tab ${
                      paymentMethod === "card" ? "active" : ""
                    }`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <i className="ri-bank-card-2-line"></i>
                    <span>Credit / Debit</span>
                  </div>

                  <div
                    className={`payment__method-tab ${
                      paymentMethod === "qr" ? "active" : ""
                    }`}
                    onClick={() => setPaymentMethod("qr")}
                  >
                    <i className="ri-qr-code-line"></i>
                    <span>VietQR / MoMo</span>
                  </div>

                  <div
                    className={`payment__method-tab ${
                      paymentMethod === "cod" ? "active" : ""
                    }`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <i className="ri-hand-coin-line"></i>
                    <span>Cash on Delivery</span>
                  </div>
                </div>

                {/* Credit Card Input & 3D Interactive Card Preview */}
                {paymentMethod === "card" && (
                  <div>
                    {/* Live Interactive Card Widget */}
                    <div className="credit__card-preview">
                      <div className="card__preview-top">
                        <div className="card__chip"></div>
                        <span className="card__brand-logo">{cardBrand}</span>
                      </div>
                      <div className="card__preview-number">
                        {cardNumber || "•••• •••• •••• ••••"}
                      </div>
                      <div className="card__preview-bottom">
                        <div>
                          <div className="card__preview-label">Card Holder</div>
                          <div className="card__preview-val">
                            {cardHolder || "YOUR FULL NAME"}
                          </div>
                        </div>
                        <div>
                          <div className="card__preview-label">Expires</div>
                          <div className="card__preview-val">
                            {cardExpiry || "MM/YY"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Input Form */}
                    <div className="row g-3">
                      <div className="col-12 custom__form-group">
                        <label>Card Number</label>
                        <div className="position-relative">
                          <input
                            type="text"
                            className="custom__input pe-5"
                            placeholder="4532 1234 5678 9012"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                          />
                          <i
                            className="ri-lock-line position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                          ></i>
                        </div>
                      </div>

                      <div className="col-12 custom__form-group">
                        <label>Cardholder Name</label>
                        <input
                          type="text"
                          className="custom__input text-uppercase"
                          placeholder="NGUYEN VAN A"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                        />
                      </div>

                      <div className="col-6 custom__form-group">
                        <label>Expiration Date</label>
                        <input
                          type="text"
                          className="custom__input"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                        />
                      </div>

                      <div className="col-6 custom__form-group">
                        <label>CVV / CVC</label>
                        <input
                          type="password"
                          className="custom__input"
                          maxLength="4"
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* QR Code / MoMo Payment */}
                {paymentMethod === "qr" && (
                  <div className="qr__payment-container">
                    <h6 className="fw-bold mb-2">Scan with Any Banking App or E-Wallet</h6>
                    <p className="text-muted fs-6 mb-3">
                      Open your banking app (Vietcombank, MB, Techcombank, Momo, etc.) and scan the QR code below.
                    </p>
                    <div className="qr__code-box">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=2|99|0912345678|Nguyen%20Van%20A||0|0|${grandTotal}|Payment%20Ecommerce|transfer_myqr`}
                        alt="Payment QR"
                        className="img-fluid"
                      />
                    </div>
                    <div className="p-2 bg-light rounded text-muted small">
                      Account: <strong>19034567891011</strong> | Bank: <strong>Techcombank</strong>
                      <br />
                      Amount: <strong>{grandTotal.toLocaleString("vi-VN")} VNĐ</strong>
                    </div>
                  </div>
                )}

                {/* COD Payment */}
                {paymentMethod === "cod" && (
                  <div className="p-4 rounded-3 border bg-light text-center">
                    <i
                      className="ri-hand-coin-line text-primary"
                      style={{ fontSize: "3rem" }}
                    ></i>
                    <h6 className="fw-bold mt-2">Cash on Delivery (COD)</h6>
                    <p className="text-muted fs-6 mb-0">
                      You will pay directly in cash when the delivery courier delivers the package to your address. Please prepare the exact amount for faster processing.
                    </p>
                  </div>
                )}

                <div className="d-flex justify-content-between mt-4">
                  <button
                    className="btn btn-outline-secondary px-4 py-2"
                    onClick={() => setCurrentStep(2)}
                  >
                    <i className="ri-arrow-left-line me-1"></i> Back to Delivery
                  </button>
                  <button
                    className="btn btn-dark px-4 py-2"
                    onClick={() => setCurrentStep(4)}
                  >
                    Review Order <i className="ri-arrow-right-line ms-1"></i>
                  </button>
                </div>
              </div>

              {/* STEP 4: Review & Final Confirmation */}
              <div
                className="checkout__box"
                style={{ display: currentStep === 4 ? "block" : "none" }}
              >
                <div className="checkout__box-title">
                  <i className="ri-file-list-3-line text-primary"></i>
                  4. Review Your Order Details
                </div>

                <div className="p-3 bg-light rounded-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold">Recipient:</span>
                    <span>{name} ({phoneNumber})</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold">Address:</span>
                    <span>{address}, {city}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold">Delivery Speed:</span>
                    <span>{shippingMethod === "express" ? "Express (1-2 days)" : "Standard (3-5 days)"}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Payment Method:</span>
                    <span className="text-uppercase fw-semibold">{paymentMethod}</span>
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <button
                    className="btn btn-outline-secondary px-4 py-2"
                    onClick={() => setCurrentStep(3)}
                  >
                    <i className="ri-arrow-left-line me-1"></i> Edit Payment
                  </button>

                  <button
                    className="btn btn-primary text-white px-5 py-2 fw-bold"
                    onClick={handlePlaceOrder}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        Confirm & Pay {grandTotal.toLocaleString("vi-VN")} VNĐ
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Col>

            {/* Right Column: Order Summary Sidebar */}
            <Col lg="5" md="12">
              <div className="checkout__summary-card">
                <h5 className="fw-bold mb-3 d-flex justify-content-between align-items-center">
                  <span>Order Summary</span>
                  <span className="badge bg-dark rounded-pill">
                    {totalQuantity} items
                  </span>
                </h5>

                {/* Cart Items List */}
                <div
                  className="checkout__items-list mb-3"
                  style={{ maxHeight: "240px", overflowY: "auto" }}
                >
                  {loadingCart ? (
                    <p className="text-muted text-center py-3">Loading items...</p>
                  ) : cartItems.length === 0 ? (
                    <p className="text-muted text-center py-3">Your cart is empty.</p>
                  ) : (
                    cartItems.map((item, idx) => (
                      <div key={idx} className="checkout__item-row">
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={
                              Array.isArray(item.imageUrl)
                                ? item.imageUrl[0]
                                : item.imageUrl || "/noavatar.png"
                            }
                            alt={item.name}
                            className="checkout__item-img"
                          />
                          <div>
                            <p className="mb-0 fw-bold text-dark text-truncate" style={{ maxWidth: "160px" }}>
                              {item.name}
                            </p>
                            <small className="text-muted">Qty: {item.quantity}</small>
                          </div>
                        </div>
                        <span className="fw-bold text-dark">
                          {(item.price * item.quantity).toLocaleString("vi-VN")} VNĐ
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="coupon__box">
                  <input
                    type="text"
                    className="custom__input"
                    placeholder="Discount code (e.g. WELCOME10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button type="submit" className="coupon__btn">
                    Apply
                  </button>
                </form>

                {couponApplied && (
                  <div className="text-success small mb-2 d-flex align-items-center gap-1">
                    <i className="ri-checkbox-circle-fill"></i> Coupon discount active
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="checkout__price-breakdown">
                  <div className="checkout__price-row">
                    <span>Subtotal</span>
                    <span>{subtotal.toLocaleString("vi-VN")} VNĐ</span>
                  </div>
                  <div className="checkout__price-row">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-success fw-bold">FREE</span>
                      ) : (
                        `${shippingCost.toLocaleString("vi-VN")} VNĐ`
                      )}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="checkout__price-row text-danger">
                      <span>Discount ({discountPercent}%)</span>
                      <span>-{discountAmount.toLocaleString("vi-VN")} VNĐ</span>
                    </div>
                  )}
                  <div className="checkout__price-row total">
                    <span>Grand Total</span>
                    <span>{grandTotal.toLocaleString("vi-VN")} VNĐ</span>
                  </div>
                </div>

                {/* Main Action Button for Quick Submission from Any Step */}
                <button
                  className="checkout__submit-btn"
                  onClick={handlePlaceOrder}
                  disabled={submitting || cartItems.length === 0}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm"></span>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <i className="ri-shield-check-line"></i>
                      Place Order • {grandTotal.toLocaleString("vi-VN")} VNĐ
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="trust__badges-container">
                  <div className="trust__badge">
                    <i className="ri-lock-2-line"></i>
                    <span>256-Bit SSL</span>
                  </div>
                  <div className="trust__badge">
                    <i className="ri-shield-check-line"></i>
                    <span>PCI Compliant</span>
                  </div>
                  <div className="trust__badge">
                    <i className="ri-arrow-go-back-line"></i>
                    <span>Easy Returns</span>
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

export default Checkout;

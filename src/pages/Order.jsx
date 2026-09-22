import React, { useEffect, useState, useCallback } from "react";
import "../styles/order.css";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getReceipts,
  payReceipt,
  cancelReceipt,
} from "../service/receiptService";

const Order = () => {
  const token = useSelector((state) => state.auth.token);
  const [orderInfo, setOrderInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await getReceipts(token);
      setOrderInfo(response.data || []);
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePayNow = async (receiptId) => {
    try {
      setActionLoading(receiptId);
      await payReceipt(receiptId, token);
      toast.success("Payment completed successfully!");
      fetchOrders();
    } catch (error) {
      const msg = error.response?.data?.message || "Payment failed. Please try again.";
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelOrder = async (receiptId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }
    try {
      setActionLoading(receiptId);
      await cancelReceipt(receiptId, token);
      toast.success("Order cancelled and items returned to your cart.");
      fetchOrders();
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to cancel order.";
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Helmet title="Order History">
      <CommonSection title="My Orders" />
      <section className="py-5 bg-light min-vh-100">
        <Container>
          <Row>
            <Col lg="12">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">Order History</h3>
                <span className="badge bg-primary fs-6 px-3 py-2 rounded-pill">
                  {orderInfo.length} Orders Placed
                </span>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="mt-3 text-muted">Loading your orders...</p>
                </div>
              ) : orderInfo.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-4 border shadow-sm p-4">
                  <i
                    className="ri-shopping-bag-line text-muted"
                    style={{ fontSize: "4rem" }}
                  ></i>
                  <h4 className="fw-bold mt-3">No orders found</h4>
                  <p className="text-muted">You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="orders__wrapper">
                  {orderInfo.map((item, index) => {
                    const orderTotal = (item.products || []).reduce(
                      (acc, p) => acc + (p.price || 0) * (p.quantity || 1),
                      0,
                    );

                    return (
                      <div
                        className="order__card-modern mb-4 bg-white rounded-4 border shadow-sm overflow-hidden"
                        key={item.id || index}
                      >
                        {/* Order Card Header */}
                        <div className="order__card-header p-3 px-md-4 bg-light border-bottom d-flex flex-wrap justify-content-between align-items-center gap-2">
                          <div>
                            <span className="text-muted small">ORDER ID</span>
                            <h6 className="fw-bold mb-0 font-monospace text-dark">
                              #{item.id ? item.id.slice(-8).toUpperCase() : `ORD-${index + 1}`}
                            </h6>
                          </div>

                          <div>
                            <span className="text-muted small">DATE PLACED</span>
                            <div className="fw-semibold text-dark small">
                              {new Date(item.createdAt).toLocaleString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>

                          <div>
                            <span className="text-muted small">STATUS</span>
                            <div>
                              {item.isPaid ? (
                                <span className="badge bg-success d-inline-flex align-items-center gap-1">
                                  <i className="ri-checkbox-circle-line"></i> Paid
                                </span>
                              ) : (
                                <span className="badge bg-warning text-dark d-inline-flex align-items-center gap-1">
                                  <i className="ri-time-line"></i> Pending Payment
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-md-end">
                            <span className="text-muted small">TOTAL</span>
                            <div className="fw-bold text-primary fs-6">
                              {orderTotal.toLocaleString("vi-VN")} VNĐ
                            </div>
                          </div>
                        </div>

                        {/* Order Body & Recipient Info */}
                        <div className="p-3 px-md-4">
                          <div className="row g-3 mb-3 pb-3 border-bottom text-muted small">
                            <div className="col-sm-4">
                              <strong>Recipient:</strong> {item.billingInfo?.name || "N/A"}
                            </div>
                            <div className="col-sm-4">
                              <strong>Phone:</strong> {item.billingInfo?.phoneNumber || "N/A"}
                            </div>
                            <div className="col-sm-4">
                              <strong>Address:</strong> {item.billingInfo?.address || "N/A"}
                            </div>
                          </div>

                          {/* Items Table */}
                          <div className="table-responsive">
                            <table className="table align-middle table-borderless mb-0">
                              <thead className="table-light rounded">
                                <tr>
                                  <th style={{ width: "80px" }}>Product</th>
                                  <th>Name</th>
                                  <th>Unit Price</th>
                                  <th>Qty</th>
                                  <th className="text-end">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(item.products || []).map((product, pIndex) => (
                                  <tr key={product.id || pIndex} className="border-bottom last-border-0">
                                    <td>
                                      <img
                                        src={
                                          Array.isArray(product.imageUrl)
                                            ? product.imageUrl[0]
                                            : product.imageUrl || "/noavatar.png"
                                        }
                                        alt={product.name}
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                          objectFit: "cover",
                                          borderRadius: "8px",
                                        }}
                                      />
                                    </td>
                                    <td className="fw-bold text-dark">{product.name}</td>
                                    <td>{Number(product.price).toLocaleString("vi-VN")} VNĐ</td>
                                    <td>x{product.quantity}</td>
                                    <td className="text-end fw-bold text-dark">
                                      {(product.price * product.quantity).toLocaleString("vi-VN")} VNĐ
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Order Action Footer (if unpaid) */}
                        {!item.isPaid && (
                          <div className="order__card-footer p-3 px-md-4 bg-light border-top d-flex justify-content-end gap-2">
                            <button
                              className="btn btn-outline-danger btn-sm px-3"
                              onClick={() => handleCancelOrder(item.id)}
                              disabled={actionLoading === item.id}
                            >
                              <i className="ri-close-circle-line me-1"></i> Cancel Order
                            </button>

                            <button
                              className="btn btn-success btn-sm px-4 text-white fw-bold"
                              onClick={() => handlePayNow(item.id)}
                              disabled={actionLoading === item.id}
                            >
                              {actionLoading === item.id ? (
                                <span className="spinner-border spinner-border-sm me-1"></span>
                              ) : (
                                <i className="ri-secure-payment-line me-1"></i>
                              )}
                              Pay Now
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Order;

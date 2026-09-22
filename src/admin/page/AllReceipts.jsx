import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { Container } from "reactstrap";
import { getAllReceipts } from "../../service/receiptService";
import "../styles/data-table.css";
import "../styles/all-order.css";

const AllReceipts = () => {
  const token = useSelector((state) => state.auth.token);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [collapsedOrders, setCollapsedOrders] = useState({});

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await getAllReceipts(token);
      const orders = response.data || [];
      setAllOrders(orders);
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Toggle single order collapse
  const toggleCollapse = (orderId) => {
    setCollapsedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // KPIs
  const totalOrders = allOrders.length;
  const paidOrders = useMemo(
    () => allOrders.filter((o) => o.isPaid).length,
    [allOrders]
  );
  const pendingOrders = useMemo(
    () => allOrders.filter((o) => !o.isPaid).length,
    [allOrders]
  );
  const totalRevenue = useMemo(() => {
    return allOrders.reduce((sum, order) => {
      if (!order.isPaid) return sum;
      const orderTotal = (order.products || []).reduce(
        (acc, p) => acc + (p.price || 0) * (p.quantity || 1),
        0
      );
      return sum + orderTotal;
    }, 0);
  }, [allOrders]);

  // Filter & Search
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      // Status Filter
      if (filterStatus === "PAID" && !order.isPaid) return false;
      if (filterStatus === "PENDING" && order.isPaid) return false;

      // Search Term
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      const orderId = (order.id || "").toLowerCase();
      const name = (order.billingInfo?.name || "").toLowerCase();
      const phone = (order.billingInfo?.phoneNumber || "").toLowerCase();
      const address = (order.billingInfo?.address || "").toLowerCase();

      return (
        orderId.includes(term) ||
        name.includes(term) ||
        phone.includes(term) ||
        address.includes(term)
      );
    });
  }, [allOrders, filterStatus, searchTerm]);

  return (
    <div className="admin__orders-page">
      <Container>
        {/* Header */}
        <div className="admin__page-header">
          <div>
            <h2 className="admin__page-title">Order Management</h2>
            <p className="admin__page-subtitle">
              Monitor real-time transactions, payment status, revenue, and customer deliveries.
            </p>
          </div>
          <button
            className="admin__primary-btn"
            onClick={fetchOrders}
            disabled={loading}
          >
            <i className={`ri-refresh-line ${loading ? "ri-spin" : ""}`}></i>
            <span>Refresh Orders</span>
          </button>
        </div>

        {/* KPI Grid */}
        <div className="admin__kpi-grid">
          <div className="admin__kpi-card">
            <div
              className="admin__kpi-icon"
              style={{ background: "rgba(37, 99, 235, 0.1)", color: "#2563eb" }}
            >
              <i className="ri-shopping-bag-3-line"></i>
            </div>
            <div>
              <div className="admin__kpi-val">{totalOrders}</div>
              <div className="admin__kpi-label">Total Orders</div>
            </div>
          </div>

          <div className="admin__kpi-card">
            <div
              className="admin__kpi-icon"
              style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}
            >
              <i className="ri-money-dollar-circle-line"></i>
            </div>
            <div>
              <div className="admin__kpi-val">
                {totalRevenue.toLocaleString("vi-VN")} đ
              </div>
              <div className="admin__kpi-label">Total Revenue</div>
            </div>
          </div>

          <div className="admin__kpi-card">
            <div
              className="admin__kpi-icon"
              style={{ background: "rgba(16, 185, 129, 0.1)", color: "#059669" }}
            >
              <i className="ri-checkbox-circle-line"></i>
            </div>
            <div>
              <div className="admin__kpi-val">{paidOrders}</div>
              <div className="admin__kpi-label">Completed (Paid)</div>
            </div>
          </div>

          <div className="admin__kpi-card">
            <div
              className="admin__kpi-icon"
              style={{ background: "rgba(245, 158, 11, 0.1)", color: "#d97706" }}
            >
              <i className="ri-time-line"></i>
            </div>
            <div>
              <div className="admin__kpi-val">{pendingOrders}</div>
              <div className="admin__kpi-label">Pending Payment</div>
            </div>
          </div>
        </div>

        {/* Control Bar: Filter Tabs & Search */}
        <div className="admin__orders-controls">
          <div className="admin__filter-tabs">
            <button
              className={`admin__filter-tab ${filterStatus === "ALL" ? "active" : ""}`}
              onClick={() => setFilterStatus("ALL")}
            >
              All Orders
              <span className="admin__tab-count">{totalOrders}</span>
            </button>
            <button
              className={`admin__filter-tab ${filterStatus === "PAID" ? "active" : ""}`}
              onClick={() => setFilterStatus("PAID")}
            >
              Paid
              <span className="admin__tab-count">{paidOrders}</span>
            </button>
            <button
              className={`admin__filter-tab ${filterStatus === "PENDING" ? "active" : ""}`}
              onClick={() => setFilterStatus("PENDING")}
            >
              Pending
              <span className="admin__tab-count">{pendingOrders}</span>
            </button>
          </div>

          <div className="admin__search-box">
            <i className="ri-search-line search-icon"></i>
            <input
              type="text"
              className="admin__search-input"
              placeholder="Search by customer, phone, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="admin__search-clear"
                onClick={() => setSearchTerm("")}
                title="Clear search"
              >
                <i className="ri-close-line"></i>
              </button>
            )}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 text-muted">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="admin__orders-empty">
            <i className="ri-inbox-archive-line"></i>
            <h4>No orders match your criteria</h4>
            <p>Try clearing filters or search keywords to view all transaction records.</p>
          </div>
        ) : (
          <div className="admin__order-list">
            {filteredOrders.map((order, idx) => {
              const orderTotal = (order.products || []).reduce(
                (acc, p) => acc + (p.price || 0) * (p.quantity || 1),
                0
              );
              const totalItemsCount = (order.products || []).reduce(
                (acc, p) => acc + (p.quantity || 1),
                0
              );
              const isCollapsed = !!collapsedOrders[order.id || idx];

              return (
                <div className="admin__order-card" key={order.id || idx}>
                  {/* Card Header */}
                  <div className="admin__order-header">
                    <div className="admin__order-id-group">
                      <span className="admin__order-id-badge">
                        #{order.id ? order.id.slice(-8).toUpperCase() : `ORD-${idx + 1}`}
                      </span>
                      <span className="admin__order-date">
                        <i className="ri-calendar-line"></i>
                        {new Date(order.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="admin__order-status-group">
                      {order.isPaid ? (
                        <span className="status__badge paid">
                          <i className="ri-checkbox-circle-fill"></i> Paid
                        </span>
                      ) : (
                        <span className="status__badge pending">
                          <i className="ri-time-fill"></i> Pending Payment
                        </span>
                      )}

                      <div className="admin__order-total-block">
                        <div className="admin__order-total-label">Grand Total</div>
                        <div className="admin__order-total-amount">
                          {orderTotal.toLocaleString("vi-VN")} VNĐ
                        </div>
                      </div>

                      <button
                        className="admin__collapse-btn"
                        onClick={() => toggleCollapse(order.id || idx)}
                        title={isCollapsed ? "Expand Details" : "Collapse Details"}
                      >
                        <i
                          className={
                            isCollapsed
                              ? "ri-arrow-down-s-line"
                              : "ri-arrow-up-s-line"
                          }
                        ></i>
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Details */}
                  {!isCollapsed && (
                    <>
                      {/* Customer & Delivery Details */}
                      <div className="admin__order-info-strip">
                        <div className="admin__info-cell">
                          <div className="admin__info-cell-icon">
                            <i className="ri-user-3-line"></i>
                          </div>
                          <div>
                            <div className="admin__info-cell-label">Customer Name</div>
                            <div className="admin__info-cell-value">
                              {order.billingInfo?.name || "N/A"}
                            </div>
                          </div>
                        </div>

                        <div className="admin__info-cell">
                          <div className="admin__info-cell-icon">
                            <i className="ri-phone-line"></i>
                          </div>
                          <div>
                            <div className="admin__info-cell-label">Phone Number</div>
                            <div className="admin__info-cell-value">
                              {order.billingInfo?.phoneNumber ? (
                                <a
                                  href={`tel:${order.billingInfo.phoneNumber}`}
                                  className="text-decoration-none text-primary"
                                >
                                  {order.billingInfo.phoneNumber}
                                </a>
                              ) : (
                                "N/A"
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="admin__info-cell">
                          <div className="admin__info-cell-icon">
                            <i className="ri-map-pin-line"></i>
                          </div>
                          <div>
                            <div className="admin__info-cell-label">Shipping Address</div>
                            <div className="admin__info-cell-value">
                              {order.billingInfo?.address || "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Products Table */}
                      <div className="admin__order-products">
                        <div className="table-responsive">
                          <table className="admin__order-table">
                            <thead>
                              <tr>
                                <th style={{ width: "60px" }}>Item</th>
                                <th>Product Details</th>
                                <th>Unit Price</th>
                                <th>Quantity</th>
                                <th className="text-end">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(order.products || []).map((product, pIdx) => {
                                const itemTotal =
                                  (product.price || 0) * (product.quantity || 1);
                                const imageSrc = Array.isArray(product.imageUrl)
                                  ? product.imageUrl[0]
                                  : product.imageUrl || "/noavatar.png";

                                return (
                                  <tr key={product.id || pIdx}>
                                    <td>
                                      <img
                                        src={imageSrc}
                                        alt={product.name}
                                        className="admin__product-thumb"
                                      />
                                    </td>
                                    <td>
                                      <div className="admin__product-name">
                                        {product.name}
                                      </div>
                                    </td>
                                    <td>
                                      {Number(product.price || 0).toLocaleString("vi-VN")} VNĐ
                                    </td>
                                    <td>
                                      <span className="admin__product-qty-badge">
                                        x{product.quantity || 1}
                                      </span>
                                    </td>
                                    <td className="text-end fw-bold text-dark">
                                      {itemTotal.toLocaleString("vi-VN")} VNĐ
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Order Footer */}
                      <div className="admin__order-footer">
                        <span>
                          <i className="ri-archive-line me-1"></i>
                          Total Items: <strong>{totalItemsCount}</strong>
                        </span>
                        <span>
                          Customer ID: <code className="small text-muted">{order.userId || "Guest"}</code>
                        </span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
};

export default AllReceipts;

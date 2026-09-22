import React, { useState, useEffect, useCallback, useMemo } from "react";
import DataTable from "../components/DataTable";
import { useSelector } from "react-redux";
import { Container } from "reactstrap";
import { getAllUsers } from "../../service/userService";
import "../styles/data-table.css";

const columns = [
  {
    field: "username",
    headerName: "User Name",
    width: 180,
    renderCell: (params) => {
      return (
        <div className="d-flex align-items-center gap-2">
          <img
            src={`https://api.dicebear.com/7.x/identicon/svg?seed=${params.row.username}`}
            alt=""
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "#f1f5f9",
              flexShrink: 0,
            }}
          />
          <span className="fw-bold text-dark">{params.row.username}</span>
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 220,
    renderCell: (params) => (
      <span className="text-secondary">{params.row.email}</span>
    ),
  },
  {
    field: "usertype",
    headerName: "Role",
    width: 110,
    renderCell: (params) => {
      const isAdmin = (params.row.usertype || "").toUpperCase() === "ADMIN";
      return (
        <span
          className={`badge rounded-pill ${
            isAdmin ? "bg-danger" : "bg-primary"
          }`}
          style={{ padding: "5px 12px", fontSize: "0.75rem", fontWeight: 700 }}
        >
          {isAdmin ? "ADMIN" : "USER"}
        </span>
      );
    },
  },
  {
    field: "category",
    headerName: "Interested Category",
    width: 190,
    renderCell: (params) => {
      const items = params.row.category || [];
      if (!Array.isArray(items) || items.length === 0) {
        return <span className="text-muted small">—</span>;
      }
      return (
        <div className="d-flex flex-wrap gap-1">
          {items.map((cat, idx) => (
            <span key={idx} className="survey__tag">
              {cat}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    field: "model",
    headerName: "Interested Model",
    width: 170,
    renderCell: (params) => {
      const items = params.row.model || [];
      if (!Array.isArray(items) || items.length === 0) {
        return <span className="text-muted small">—</span>;
      }
      return (
        <div className="d-flex flex-wrap gap-1">
          {items.map((m, idx) => (
            <span key={idx} className="survey__tag">
              {m}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    field: "color",
    headerName: "Interested Color",
    width: 150,
    renderCell: (params) => {
      const items = params.row.color || [];
      if (!Array.isArray(items) || items.length === 0) {
        return <span className="text-muted small">—</span>;
      }
      return (
        <div className="d-flex flex-wrap gap-1">
          {items.map((c, idx) => (
            <span key={idx} className="survey__tag">
              {c}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    field: "size",
    headerName: "Interested Size",
    width: 150,
    renderCell: (params) => {
      const items = params.row.size || [];
      if (!Array.isArray(items) || items.length === 0) {
        return <span className="text-muted small">—</span>;
      }
      return (
        <div className="d-flex flex-wrap gap-1">
          {items.map((s, idx) => (
            <span key={idx} className="survey__tag">
              {s}
            </span>
          ))}
        </div>
      );
    },
  },
];

const AllUsers = () => {
  const token = useSelector((state) => state.auth.token);
  const [allUser, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await getAllUsers(token);
      const users = response.data || [];
      const formatted = users.map((user, index) => {
        return {
          id: user.id || index,
          username: user.username,
          email: user.email,
          usertype: user.usertype || "USER",
          category: user.survey?.category || [],
          model: user.survey?.model || [],
          color: user.survey?.color || [],
          size: user.survey?.size || [],
        };
      });
      setUser(formatted);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Metrics
  const totalUsers = allUser.length;
  const adminCount = useMemo(() => {
    return allUser.filter((u) => u.usertype === "ADMIN").length;
  }, [allUser]);
  const surveyedCount = useMemo(() => {
    return allUser.filter((u) => u.category.length > 0).length;
  }, [allUser]);

  return (
    <div className="admin__page-container">
      <Container>
        {/* Page Header */}
        <div className="admin__page-header">
          <div>
            <h2 className="admin__page-title">User Directory</h2>
            <p className="admin__page-subtitle">
              Monitor registered customers, administrator roles, and interior survey profiles.
            </p>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="admin__kpi-grid">
          <div className="admin__kpi-card">
            <div
              className="admin__kpi-icon"
              style={{ background: "rgba(37, 99, 235, 0.1)", color: "#2563eb" }}
            >
              <i className="ri-team-line"></i>
            </div>
            <div>
              <div className="admin__kpi-val">{totalUsers}</div>
              <div className="admin__kpi-label">Registered Users</div>
            </div>
          </div>

          <div className="admin__kpi-card">
            <div
              className="admin__kpi-icon"
              style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}
            >
              <i className="ri-shield-user-line"></i>
            </div>
            <div>
              <div className="admin__kpi-val">{adminCount}</div>
              <div className="admin__kpi-label">Administrators</div>
            </div>
          </div>

          <div className="admin__kpi-card">
            <div
              className="admin__kpi-icon"
              style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}
            >
              <i className="ri-survey-line"></i>
            </div>
            <div>
              <div className="admin__kpi-val">{surveyedCount}</div>
              <div className="admin__kpi-label">Completed Surveys</div>
            </div>
          </div>
        </div>

        {/* User Table */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 text-muted">Loading user accounts...</p>
          </div>
        ) : (
          <DataTable slug="user" columns={columns} rows={allUser} fetchData={fetchUsers} />
        )}
      </Container>
    </div>
  );
};

export default AllUsers;

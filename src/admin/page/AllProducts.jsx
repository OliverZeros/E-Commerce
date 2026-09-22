import React, { useState, useEffect, useCallback, useMemo } from "react";
import DataTable from "../components/DataTable";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Container } from "reactstrap";
import { setProducts } from "../../redux/slices/productsSlice";
import { getAllProducts } from "../../service/productService";
import "../styles/data-table.css";

const columns = [
  {
    field: "img",
    headerName: "Image",
    width: 80,
    sortable: false,
    renderCell: (params) => {
      return (
        <img
          src={params.row.img || "/noavatar.png"}
          alt=""
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "8px",
            objectFit: "cover",
            border: "1px solid #e2e8f0",
          }}
        />
      );
    },
  },
  {
    field: "name",
    headerName: "Product Name",
    width: 240,
    renderCell: (params) => (
      <span className="fw-bold text-dark">{params.row.name}</span>
    ),
  },
  {
    field: "category",
    headerName: "Category",
    width: 130,
    renderCell: (params) => (
      <span className="fw-semibold text-secondary">
        {params.row.category || params.value || "—"}
      </span>
    ),
  },
  {
    field: "priceFormatted",
    headerName: "Unit Price",
    width: 150,
    renderCell: (params) => (
      <span className="fw-bold text-primary">
        {Number(params.row.price).toLocaleString("vi-VN")} VNĐ
      </span>
    ),
  },
  {
    field: "model",
    headerName: "Model",
    width: 120,
  },
  {
    field: "size",
    headerName: "Size",
    width: 100,
  },
  {
    field: "color",
    headerName: "Color",
    width: 100,
  },
  {
    field: "slot",
    headerName: "Slots",
    width: 100,
    renderCell: (params) => {
      const slot = Number(params.row.slot || 0);
      if (slot === 0) {
        return (
          <span className="stock__badge out-stock">
            0 (Out)
          </span>
        );
      }
      if (slot < 5) {
        return (
          <span className="stock__badge low-stock">
            {slot} (Low)
          </span>
        );
      }
      return (
        <span className="stock__badge in-stock">
          {slot}
        </span>
      );
    },
  },
];

const AllProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [allProduct, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllProducts();
      const products = response.data || [];
      const newProducts = products.map((product) => {
        return {
          id: product.id,
          img: Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl,
          name: product.name,
          slot: product.slot || 0,
          price: product.price || 0,
          priceFormatted: product.price,
          category: product.productType?.category || "N/A",
          model: product.productType?.model || "N/A",
          color: product.productType?.color || "N/A",
          size: product.productType?.size || "N/A",
        };
      });
      setProduct(newProducts);
      dispatch(setProducts(products));
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  // Metric calculations
  const totalProducts = allProduct.length;
  const totalSlots = useMemo(() => {
    return allProduct.reduce((acc, p) => acc + Number(p.slot || 0), 0);
  }, [allProduct]);
  const lowStockCount = useMemo(() => {
    return allProduct.filter((p) => Number(p.slot || 0) < 5).length;
  }, [allProduct]);

  return (
    <div className="admin__page-container">
      <Container>
        {/* Page Header */}
        <div className="admin__page-header">
          <div>
            <h2 className="admin__page-title">Product Catalog</h2>
            <p className="admin__page-subtitle">
              Manage furniture inventory, pricing, categories and product listings.
            </p>
          </div>
          <button
            className="admin__primary-btn"
            onClick={() => navigate("/admin/add-products")}
          >
            <i className="ri-add-line fs-5"></i>
            <span>Add New Product</span>
          </button>
        </div>

        {/* KPI Cards */}
        <div className="admin__kpi-grid">
          <div className="admin__kpi-card">
            <div
              className="admin__kpi-icon"
              style={{ background: "rgba(37, 99, 235, 0.1)", color: "#2563eb" }}
            >
              <i className="ri-archive-line"></i>
            </div>
            <div>
              <div className="admin__kpi-val">{totalProducts}</div>
              <div className="admin__kpi-label">Total Products</div>
            </div>
          </div>

          <div className="admin__kpi-card">
            <div
              className="admin__kpi-icon"
              style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}
            >
              <i className="ri-stack-line"></i>
            </div>
            <div>
              <div className="admin__kpi-val">{totalSlots}</div>
              <div className="admin__kpi-label">Units in Inventory</div>
            </div>
          </div>

          <div className="admin__kpi-card">
            <div
              className="admin__kpi-icon"
              style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}
            >
              <i className="ri-alert-line"></i>
            </div>
            <div>
              <div className="admin__kpi-val">{lowStockCount}</div>
              <div className="admin__kpi-label">Low Stock Alerts</div>
            </div>
          </div>
        </div>

        {/* Table Card */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 text-muted">Loading inventory catalog...</p>
          </div>
        ) : (
          <DataTable
            slug="product"
            columns={columns}
            rows={allProduct}
            fetchData={getProducts}
          />
        )}
      </Container>
    </div>
  );
};

export default AllProducts;

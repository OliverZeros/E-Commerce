import React, { useState, useEffect, useMemo } from "react";

import CommonSection from "../components/UI/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";
import "../styles/shop.css";

import ProductsList from "../components/UI/ProductsList";
import { useSelector, useDispatch } from "react-redux";
import { setProducts } from "../redux/slices/productsSlice";
import { getAllProducts } from "../service/productService";

const Shop = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(products.length === 0);

  useEffect(() => {
    if (products.length === 0) {
      setLoading(true);
      getAllProducts()
        .then((res) => {
          const data = res.data || [];
          dispatch(setProducts(data));
        })
        .catch((err) => console.error("Error loading products in Shop:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [products.length, dispatch]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (
      selectedCategory &&
      selectedCategory !== "All" &&
      selectedCategory !== "Filter By Category"
    ) {
      result = result.filter((item) => {
        const cat =
          item.category ||
          (item.productType && item.productType.category);
        return cat === selectedCategory;
      });
    }

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((item) =>
        item.name?.toLowerCase().includes(lower)
      );
    }

    if (sortBy === "ascending") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortBy === "descending") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    return result;
  }, [products, selectedCategory, searchTerm, sortBy]);

  return (
    <Helmet title="Cửa Hàng - Nội Thất Cao Cấp">
      <CommonSection title="Danh Sách Sản Phẩm" />

      <section>
        <Container>
          <Row>
            <Col lg="3" md="6">
              <div className="filter__widget">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">Tất cả danh mục</option>
                  <option value="Sofa">Sofa</option>
                  <option value="Table">Bàn (Table)</option>
                  <option value="Armchair">Ghế bành (Armchair)</option>
                  <option value="Bed">Giường ngủ (Bed)</option>
                </select>
              </div>
            </Col>
            <Col lg="3" md="6" className="text-end">
              <div className="filter__widget">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Sắp xếp theo giá</option>
                  <option value="ascending">Giá tăng dần</option>
                  <option value="descending">Giá giảm dần</option>
                </select>
              </div>
            </Col>
            <Col lg="6" md="12">
              <div className="search__box">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span>
                  <i className="ri-search-line"></i>
                </span>
              </div>
            </Col>
          </Row>
        </Container>

        <section className="pt-3">
          <Container>
            <Row>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="mt-3 text-muted">Đang tải sản phẩm...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <h3 className="text-center fs-4 text-muted py-5">
                  Không tìm thấy sản phẩm phù hợp
                </h3>
              ) : (
                <ProductsList data={filteredProducts} />
              )}
            </Row>
          </Container>
        </section>
      </section>
    </Helmet>
  );
};

export default Shop;

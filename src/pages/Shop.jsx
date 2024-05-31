import React, { useState } from "react";

import CommonSection from "../components/UI/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";
import "../styles/shop.css";

import ProductsList from "../components/UI/ProductsList";
import { useSelector } from "react-redux";

const Shop = () => {
  const products = useSelector((state) => state.products.products);
  const [productsData, setProductsData] = useState(products);

  const handleFilter = (e) => {
    const filterValue = e.target.value;
    if (filterValue === "All") {
      setProductsData(products);
    }

    if (filterValue === "Sofa") {
      const filteredProducts = products.filter(
        (item) => item.productType.category === "Sofa"
      );
      setProductsData(filteredProducts);
    }

    if (filterValue === "Table") {
      const filteredProducts = products.filter(
        (item) => item.productType.category === "Table"
      );
      setProductsData(filteredProducts);
    }

    if (filterValue === "Armchair") {
      const filteredProducts = products.filter(
        (item) => item.productType.category === "Armchair"
      );
      setProductsData(filteredProducts);
    }

    if (filterValue === "Bed") {
      const filteredProducts = products.filter(
        (item) => item.productType.category === "Bed"
      );
      setProductsData(filteredProducts);
    }
  };

  const sortProducts = (sortBy) => {
    let sortedProducts = [...productsData];

    if (sortBy === "ascending") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "descending") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }

    setProductsData(sortedProducts);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    const searchedProducts = products.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setProductsData(searchedProducts);
  };

  return (
    <Helmet title="Shop">
      <CommonSection title="Products" />

      <section>
        <Container>
          <Row>
            <Col lg="3" md="6">
              <div className="filter__widget">
                <select onChange={handleFilter}>
                  <option>Filter By Category</option>
                  <option value="All">All Products</option>
                  <option value="Sofa">Sofa</option>
                  <option value="Table">Table</option>
                  <option value="Armchair">Armchair</option>
                  <option value="Bed">Bed</option>
                </select>
              </div>
            </Col>
            <Col lg="3" md="6" className="text-end">
              <div className="filter__widget">
                <select onChange={(e) => sortProducts(e.target.value)}>
                  <option>Sort By</option>
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select>
              </div>
            </Col>
            <Col lg="6" md="12">
              <div className="search__box">
                <input
                  type="text"
                  placeholder="Search.........."
                  onChange={handleSearch}
                />
                <span>
                  <i class="ri-search-line"></i>
                </span>
              </div>
            </Col>
          </Row>
        </Container>

        <section>
          <Container>
            <Row>
              {productsData.length === 0 ? (
                <h1 className="text-center fs-2">No Products Found</h1>
              ) : (
                <ProductsList data={productsData} />
              )}
            </Row>
          </Container>
        </section>
      </section>
    </Helmet>
  );
};

export default Shop;

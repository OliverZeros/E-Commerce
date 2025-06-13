import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
// import products from "../assets/data/products";

import Helmet from "../components/Helmet/Helmet";
import "../styles/home.css";

import { Container, Row, Col } from "reactstrap";

import heroImg from "../assets/images/hero-img.png";

import Services from "../components/services/Services";
import ProductsList from "../components/UI/ProductsList";

import Clock from "../components/UI/Clock";

import counterImg from "../assets/images/counter-timer-img.png";

import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../redux/slices/productsSlice";
import { getAllProducts } from "../service/productService";
import { getUserProfile } from "../service/userService";

const Home = () => {
  const token = useSelector((state) => state.auth.token);
  const [userSurvey, setSurvey] = useState([]);
  const [reconmendedProducts, setReconmendedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bestSalesProducts, setBestSalesProducts] = useState([]);
  const [sofaProducts, setsofaProducts] = useState([]);
  const [armchairProducts, setarmchairProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const dispatch = useDispatch();

  const year = new Date().getFullYear();

  useEffect(() => {
    const getProducts = async () => {
      const response = await getAllProducts();
      const products = response.data;

      dispatch(setProducts(products));

      const filteredTrendingProducts = products.filter(
        (item) => item.productType.category === "Sofa"
      );

      const filteredBestSalesProducts = products.filter(
        (item) => item.productType.category === "Armchair"
      );

      const filteredsofaProducts = products.filter(
        (item) => item.productType.category === "Sofa"
      );

      const filteredarmchairProducts = products.filter(
        (item) => item.productType.category === "Armchair"
      );

      const filteredPopularProducts = products.filter(
        (item) => item.productType.category === "Table"
      );

      const filteredRecommendedProducts = products.filter((item) =>
        userSurvey.includes(item.productType.category)
      );

      setTrendingProducts(filteredTrendingProducts);
      setBestSalesProducts(filteredBestSalesProducts);
      setsofaProducts(filteredsofaProducts);
      setarmchairProducts(filteredarmchairProducts);
      setPopularProducts(filteredPopularProducts);
      setReconmendedProducts(filteredRecommendedProducts);
    };
    getProducts();
  }, [userSurvey, dispatch]);

  useEffect(() => {
    const getUserInfo = async () => {
      if (!token) return;
      const response = await getUserProfile(token);
      const survey = response.data.survey.category;
      setSurvey(survey);
    };
    getUserInfo();
  }, [token]);

  return (
    <Helmet title="Home">
      <section className="hero__section">
        <Container>
          <Row>
            <Col lg="6" md="6">
              <div className="hero__content">
                <p className="hero__subtitle">Trending product in {year}</p>
                <h2>Make Your Interior More Minimalistic & Modern</h2>
                <p>
                  Giving you a minimalist space that still meets your needs!
                </p>
                <motion.button whileTap={{ scale: 1.2 }} className="buy__btn">
                  <Link to="/shop">SHOP NOW</Link>
                </motion.button>
              </div>
            </Col>

            <Col lg="6" md="6">
              <div className="hero__img">
                <img fetchpriority="high" src={heroImg} alt="hero" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Services />

      {reconmendedProducts.length > 0 && (
        <section className="recommend__products">
          <Container>
            <Row>
              <Col lg="12" className="text-center">
                <h2 className="section__title">Recommended for You</h2>
              </Col>
              <ProductsList data={reconmendedProducts} />
            </Row>
          </Container>
        </section>
      )}

      <section className="trending__products">
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h2 className="section__title">Trending Products</h2>
            </Col>
            <ProductsList data={trendingProducts} />
          </Row>
        </Container>
      </section>

      <section className="best__sales">
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h2 className="section__title">Best Sales</h2>
            </Col>
            <ProductsList data={bestSalesProducts} />
          </Row>
        </Container>
      </section>

      <section className="timer__count">
        <Container>
          <Row>
            <Col lg="6" md="12" className="count__down-col">
              <div className="clock__top-content">
                <h4 className="text-white fs-6 mb-2">Limited Offers</h4>
                <h3 className="text-white fs-5 mb-3">Quality Armchair</h3>
              </div>
              <Clock />

              <motion.button
                whileTap={{ scale: 1.2 }}
                className="buy__btn store__btn"
              >
                <Link to="/shop">Visit Store</Link>
              </motion.button>
            </Col>

            <Col lg="6" md="12" className="text-end counter__img">
              <img src={counterImg} alt="" />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="new__arrivals">
        <Container>
          <Row>
            <Col lg="12" className="text-center mb-5">
              <h2 className="section__title">New Arrivals</h2>
            </Col>
            <ProductsList data={sofaProducts} />
            <ProductsList data={armchairProducts} />
          </Row>
        </Container>
      </section>

      <section className="popular__category">
        <Container>
          <Row>
            <Col lg="12" className="text-center mb-5">
              <h2 className="section__title">Popular in Category</h2>
            </Col>
            <ProductsList data={popularProducts} />
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Home;

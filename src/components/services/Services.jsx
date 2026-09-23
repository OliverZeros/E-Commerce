import React from "react";
import { Container, Row, Col } from "reactstrap";
import { motion } from "framer-motion";
import "./services.css";
import serviceData from "../../assets/data/serviceData";

const Services = () => {
  return (
    <section className="services__section">
      <Container>
        <Row className="gy-4">
          {serviceData.map((item, index) => (
            <Col lg="3" md="6" sm="6" key={index}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="service__luxury-card"
              >
                <div className="service__header">
                  <div className="service__icon-wrap">
                    <i className={item.icon}></i>
                  </div>
                  <span className="service__tag">{item.tag}</span>
                </div>
                <div className="service__content">
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Services;

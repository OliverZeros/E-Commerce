import React, { useState } from "react";
// import Helmet from "../components/Helmet/Helmet";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";

import "../styles/add-products.css";

const AddProducts = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState();
  const [slot, setSlot] = useState();
  const [rating, setRating] = useState();
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState([""]);
  const [productType, setProductType] = useState({
    category: "Sofa/Chair/Clock",
    color: "Lght/Dark",
    size: "Small/Medium/Large",
    model: "Modern/Classic/Rustic",
  });

  const navigate = useNavigate();

  const handleProductTypeChange = (e) => {
    setProductType({
      ...productType,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      name,
      price,
      slot,
      rating,
      description,
      imageUrl,
      productType,
    };
    // await axios.post("https://ece-project.adaptable.app/products", productData);
    navigate("/admin/all-products");
  };

  return (
    <section>
      <Container>
        <Form className="auth__form" onSubmit={handleSubmit}>
          <h3 className="fw-bold mb-4">Add New Product</h3>
          <Row xs="2">
            <Col>
              <FormGroup className="form__group">
                <Label for="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup className="form__group">
                <Label for="price">Price</Label>
                <Input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter product price"
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup className="form__group">
                <Label for="slot">Slot</Label>
                <Input
                  type="number"
                  id="slot"
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                  placeholder="Enter product slot"
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup className="form__group">
                <Label for="rating">Rating</Label>
                <Input
                  type="number"
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  placeholder="Enter product rating"
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup className="form__group">
                <Label for="description">Description</Label>
                <Input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter product description"
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup className="form__group">
                <Label for="imageUrl">Image URL</Label>
                <Input
                  type="text"
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL "
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup className="form__group">
                <Label for="category">Category</Label>
                <Input
                  type="text"
                  name="category"
                  id="category"
                  value={productType.category}
                  onChange={handleProductTypeChange}
                  placeholder="Enter product category"
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup className="form__group">
                <Label for="color">Color</Label>
                <Input
                  type="text"
                  name="color"
                  id="color"
                  value={productType.color}
                  onChange={handleProductTypeChange}
                  placeholder="Enter product color"
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup className="form__group">
                <Label for="size">Size</Label>
                <Input
                  type="text"
                  name="size"
                  id="size"
                  value={productType.size}
                  onChange={handleProductTypeChange}
                  placeholder="Enter product size"
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup className="form__group">
                <Label for="model">Model</Label>
                <Input
                  type="text"
                  name="model"
                  id="model"
                  value={productType.model}
                  onChange={handleProductTypeChange}
                  placeholder="Enter product model"
                />
              </FormGroup>
            </Col>
            <Col lg="12" className="text-center">
              <button type="submit" className="buy__btn auth__btn">
                Add Product
              </button>
            </Col>
          </Row>
        </Form>
      </Container>
    </section>
  );
};

export default AddProducts;

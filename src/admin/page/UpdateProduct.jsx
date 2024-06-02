import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import "../styles/add-products.css";

const UpdateProducts = () => {
  const id = useLocation().state.id;
  const token = useSelector((state) => state.auth.token);
  const product = useSelector((state) => state.products.products).find(
    (product) => product.id === id
  );
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [slot, setSlot] = useState(product.slot);
  const [rating, setRating] = useState(product.rating);
  const [description, setDescription] = useState(product.description);
  const [image, setImage] = useState(null);
  const [productType, setProductType] = useState({
    category: product.productType.category,
    color: product.productType.color,
    size: product.productType.size,
    model: product.productType.model,
  });

  const navigate = useNavigate();

  function handleChangeImg(e) {
    setImage(e.target.files?.[0]);
  }

  const handleProductTypeChange = (e) => {
    setProductType({
      ...productType,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productId", id);
    formData.append("image", image);

    formData.append("name", name);
    formData.append("price", price);
    formData.append("slot", slot);
    formData.append("rating", rating);
    formData.append("description", description);
    formData.append("category", productType.category);
    formData.append("color", productType.color);
    formData.append("size", productType.size);
    formData.append("model", productType.model);

    const response = await axios.patch(
      "https://ece-project.adaptable.app/product/update",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      }
    );
    console.log(response);

    navigate("/admin/all-products");
  };

  return (
    <section>
      <Container>
        <Form className="auth__form" onSubmit={handleSubmit}>
          <h3 className="fw-bold mb-4">Update Product</h3>
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
                <Label for="image">Image</Label>
                <Input type="file" id="images" onChange={handleChangeImg} />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup className="type__product">
                <Label for="category">Category</Label>
                <div>
                  <Label>
                    <Input
                      type="radio"
                      name="category"
                      value="Sofa"
                      checked={productType.category === "Sofa"}
                      onChange={handleProductTypeChange}
                    />
                    Sofa
                  </Label>
                  <Label>
                    <Input
                      type="radio"
                      name="category"
                      value="Table"
                      checked={productType.category === "Table"}
                      onChange={handleProductTypeChange}
                    />
                    Table
                  </Label>
                  <Label>
                    <Input
                      type="radio"
                      name="category"
                      value="Armchair"
                      checked={productType.category === "Armchair"}
                      onChange={handleProductTypeChange}
                    />
                    Armchair
                  </Label>
                  <Label>
                    <Input
                      type="radio"
                      name="category"
                      value="Bed"
                      checked={productType.category === "Bed"}
                      onChange={handleProductTypeChange}
                    />
                    Bed
                  </Label>
                </div>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup className="type__product">
                <Label for="color">Color</Label>
                <div>
                  <Label>
                    <Input
                      type="radio"
                      name="color"
                      value="Light"
                      checked={productType.color === "Light"}
                      onChange={handleProductTypeChange}
                    />
                    Light
                  </Label>
                  <Label>
                    <Input
                      type="radio"
                      name="color"
                      value="Dark"
                      checked={productType.color === "Dark"}
                      onChange={handleProductTypeChange}
                    />
                    Dark
                  </Label>
                </div>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup className="type__product">
                <Label for="size">Size</Label>
                <div>
                  <Label>
                    <Input
                      type="radio"
                      name="size"
                      value="Small"
                      checked={productType.size === "Small"}
                      onChange={handleProductTypeChange}
                    />
                    Small
                  </Label>
                  <Label>
                    <Input
                      type="radio"
                      name="size"
                      value="Medium"
                      checked={productType.size === "Medium"}
                      onChange={handleProductTypeChange}
                    />
                    Medium
                  </Label>
                  <Label>
                    <Input
                      type="radio"
                      name="size"
                      value="Large"
                      checked={productType.size === "Large"}
                      onChange={handleProductTypeChange}
                    />
                    Large
                  </Label>
                </div>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup className="type__product">
                <Label for="model">Model</Label>
                <div>
                  <Label>
                    <Input
                      type="radio"
                      name="model"
                      value="Modern"
                      checked={productType.model === "Modern"}
                      onChange={handleProductTypeChange}
                    />
                    Modern
                  </Label>
                  <Label>
                    <Input
                      type="radio"
                      name="model"
                      value="Classic"
                      checked={productType.model === "Classic"}
                      onChange={handleProductTypeChange}
                    />
                    Classic
                  </Label>
                  <Label>
                    <Input
                      type="radio"
                      name="model"
                      value="Rustic"
                      checked={productType.model === "Rustic"}
                      onChange={handleProductTypeChange}
                    />
                    Rustic
                  </Label>
                </div>
              </FormGroup>
            </Col>
            <Col lg="12" className="text-center">
              <button type="submit" className="buy__btn auth__btn">
                Update Product
              </button>
            </Col>
          </Row>
        </Form>
      </Container>
    </section>
  );
};

export default UpdateProducts;

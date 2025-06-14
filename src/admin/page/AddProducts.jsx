import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";
import { toast } from "react-toastify";
import { addProduct } from "../../service/productService";
import { useSelector } from "react-redux";
import axios from "axios";
import "../styles/add-products.css";

const AddProducts = () => {
  const token = useSelector((state) => state.auth.token);
  const [name, setName] = useState("");
  const [price, setPrice] = useState();
  const [slot, setSlot] = useState();
  const [rating, setRating] = useState();
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [productType, setProductType] = useState({
    category: "Sofa",
    color: "Light",
    size: "Small",
    model: "Modern",
  });

  const navigate = useNavigate();

  function handleChangeImg(e) {
    const file = e.target.files?.[0];
    setImage(file);
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

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/product/add`,
      formData,
      {
        headers: {
          "ngrok-skip-browser-warning": "69420",
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      }
    );
    console.log("formdata", formData);

    toast.success("Product added successfully!");
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
                <Label for="image">Image</Label>
                <Input
                  type="file"
                  id="images"
                  accept="image/*"
                  required
                  onChange={handleChangeImg}
                />
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

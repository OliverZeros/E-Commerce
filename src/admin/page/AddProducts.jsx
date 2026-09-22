import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";
import "../styles/add-products.css";

const CATEGORIES = ["Sofa", "Table", "Armchair", "Bed"];
const COLORS = ["Light", "Dark"];
const SIZES = ["Small", "Medium", "Large"];
const MODELS = ["Modern", "Classic", "Rustic"];

const AddProducts = () => {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [slot, setSlot] = useState("");
  const [rating, setRating] = useState("5");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [productType, setProductType] = useState({
    category: "Sofa",
    color: "Light",
    size: "Small",
    model: "Modern",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !price || !slot || !description.trim()) {
      toast.warn("Please complete all required fields.");
      return;
    }

    if (!image) {
      toast.warn("Please upload a product photo.");
      return;
    }

    try {
      setSubmitting(true);
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

      await axios.post(
        `${process.env.REACT_APP_API_URL}/product/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        },
      );

      toast.success("Product created successfully!");
      navigate("/admin/all-products");
    } catch (error) {
      console.error("Failed to add product", error);
      const msg = error.response?.data?.message || "Failed to create product.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="product__studio-container">
      <Container>
        {/* Header with breadcrumb */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 text-muted small mb-1">
              <Link to="/admin/all-products" className="text-decoration-none text-muted">
                Products
              </Link>
              <span>/</span>
              <span className="text-dark fw-semibold">New Product</span>
            </div>
            <h2 className="fw-bold mb-0 text-dark">Add New Furniture Product</h2>
          </div>

          <Link to="/admin/all-products">
            <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
              <i className="ri-arrow-left-line"></i> Cancel
            </button>
          </Link>
        </div>

        <Form onSubmit={handleSubmit}>
          <Row>
            {/* Left Column: General Information */}
            <Col lg="7" md="12" className="mb-4 mb-lg-0">
              <div className="product__studio-card h-100">
                <div className="product__studio-section-title">
                  <i className="ri-information-line text-primary"></i>
                  General Information
                </div>

                <FormGroup className="mb-3">
                  <Label for="name" className="fw-bold text-dark small">
                    Product Title *
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Modern Velvet Scandinavian Sofa"
                    required
                  />
                </FormGroup>

                <Row>
                  <Col sm="6">
                    <FormGroup className="mb-3">
                      <Label for="price" className="fw-bold text-dark small">
                        Price (VNĐ) *
                      </Label>
                      <Input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 2500000"
                        required
                      />
                    </FormGroup>
                  </Col>

                  <Col sm="6">
                    <FormGroup className="mb-3">
                      <Label for="slot" className="fw-bold text-dark small">
                        Inventory Stock (Units) *
                      </Label>
                      <Input
                        type="number"
                        id="slot"
                        value={slot}
                        onChange={(e) => setSlot(e.target.value)}
                        placeholder="e.g. 50"
                        required
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <FormGroup className="mb-3">
                  <Label for="rating" className="fw-bold text-dark small">
                    Initial Rating (1 - 5 Stars)
                  </Label>
                  <Input
                    type="select"
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option value="5">★★★★★ (5 Stars)</option>
                    <option value="4">★★★★☆ (4 Stars)</option>
                    <option value="3">★★★☆☆ (3 Stars)</option>
                  </Input>
                </FormGroup>

                <FormGroup className="mb-0">
                  <Label for="description" className="fw-bold text-dark small">
                    Detailed Description *
                  </Label>
                  <Input
                    type="textarea"
                    id="description"
                    rows="6"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe material, dimensions, warranty, assembly instructions..."
                    required
                  />
                </FormGroup>
              </div>
            </Col>

            {/* Right Column: Media & Attributes */}
            <Col lg="5" md="12">
              <div className="product__studio-card mb-4">
                <div className="product__studio-section-title">
                  <i className="ri-image-line text-primary"></i>
                  Product Media
                </div>

                {imagePreview ? (
                  <div className="image__preview-box">
                    <img src={imagePreview} alt="Preview" className="image__preview-img" />
                  </div>
                ) : (
                  <label className="image__upload-dropzone d-block" htmlFor="imageUpload">
                    <i className="ri-upload-cloud-2-line image__upload-icon"></i>
                    <h6 className="fw-bold mb-1">Click to browse product image</h6>
                    <small className="text-muted">Supports JPG, PNG, WEBP up to 5MB</small>
                  </label>
                )}

                <Input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  className="d-none"
                  onChange={handleImageChange}
                />

                {imagePreview && (
                  <div className="text-center">
                    <label
                      htmlFor="imageUpload"
                      className="btn btn-outline-secondary btn-sm"
                      style={{ cursor: "pointer" }}
                    >
                      <i className="ri-refresh-line me-1"></i> Change Image
                    </label>
                  </div>
                )}
              </div>

              {/* Product Attributes Studio */}
              <div className="product__studio-card">
                <div className="product__studio-section-title">
                  <i className="ri-palette-line text-primary"></i>
                  Product Attributes
                </div>

                {/* Category */}
                <div className="attribute__group">
                  <span className="attribute__group-label">Category</span>
                  <div className="attribute__chips-grid">
                    {CATEGORIES.map((cat) => (
                      <div
                        key={cat}
                        className={`attribute__chip ${
                          productType.category === cat ? "selected" : ""
                        }`}
                        onClick={() => setProductType({ ...productType, category: cat })}
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div className="attribute__group">
                  <span className="attribute__group-label">Color Tone</span>
                  <div className="attribute__chips-grid">
                    {COLORS.map((col) => (
                      <div
                        key={col}
                        className={`attribute__chip ${
                          productType.color === col ? "selected" : ""
                        }`}
                        onClick={() => setProductType({ ...productType, color: col })}
                      >
                        {col}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div className="attribute__group">
                  <span className="attribute__group-label">Size</span>
                  <div className="attribute__chips-grid">
                    {SIZES.map((sz) => (
                      <div
                        key={sz}
                        className={`attribute__chip ${
                          productType.size === sz ? "selected" : ""
                        }`}
                        onClick={() => setProductType({ ...productType, size: sz })}
                      >
                        {sz}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Model */}
                <div className="attribute__group mb-0">
                  <span className="attribute__group-label">Design Model</span>
                  <div className="attribute__chips-grid">
                    {MODELS.map((md) => (
                      <div
                        key={md}
                        className={`attribute__chip ${
                          productType.model === md ? "selected" : ""
                        }`}
                        onClick={() => setProductType({ ...productType, model: md })}
                      >
                        {md}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Action Footer */}
          <div className="product__studio-actions">
            <Link to="/admin/all-products">
              <button type="button" className="btn btn-outline-secondary px-4 py-2">
                Cancel
              </button>
            </Link>

            <button
              type="submit"
              className="btn btn-primary text-white fw-bold px-5 py-2"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Saving Product...
                </>
              ) : (
                <>
                  <i className="ri-save-line me-1"></i> Create & Publish Product
                </>
              )}
            </button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default AddProducts;

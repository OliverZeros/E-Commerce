import React, { useState } from "react";
import { toast } from "react-toastify";
import Helmet from "../components/Helmet/Helmet";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import CommonSection from "../components/UI/CommonSection";
import { useSelector } from "react-redux";
import { userSurvey } from "../service/userService";

import "../styles/survey.css";

function Survey() {
  const [category, setCategory] = useState([]);
  const [color, setColor] = useState([]);
  const [size, setSize] = useState([]);
  const [model, setModel] = useState([]);
  const token = useSelector((state) => state.auth.token);

  const navigate = useNavigate();

  const handleCheckboxChange = (setter, value) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(category, color, size, model);
    console.log(token);
    await userSurvey({ category, color, size, model }, token);

    toast.success("Survey submitted! Shop Now!");
    navigate("/login");
  };

  return (
    <Helmet title={"Survey"}>
      {console.log(token)}
      <CommonSection title="Let us know about your needs" />
      <section>
        <Container>
          <Row>
            <Col lg="6" className="m-auto text-center">
              <Form className="auth__form" onSubmit={handleSubmit}>
                <FormGroup className="form__group">
                  <p>Type of Interior:</p>
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        value="Sofa"
                        onChange={() =>
                          handleCheckboxChange(setCategory, "Sofa")
                        }
                      />
                      Sofa
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Table"
                        onChange={() =>
                          handleCheckboxChange(setCategory, "Table")
                        }
                      />
                      Table
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Armchair"
                        onChange={() =>
                          handleCheckboxChange(setCategory, "Armchair")
                        }
                      />
                      Armchair
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Bed"
                        onChange={() =>
                          handleCheckboxChange(setCategory, "Bed")
                        }
                      />
                      Bed
                    </label>
                  </div>
                </FormGroup>

                <FormGroup className="form__group">
                  <div>
                    <p className="mt-4">Interested Style:</p>
                    <div>
                      <label>
                        <input
                          type="checkbox"
                          value="Modern"
                          onChange={() =>
                            handleCheckboxChange(setModel, "Modern")
                          }
                        />
                        Modern
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          value="Classic"
                          onChange={() =>
                            handleCheckboxChange(setModel, "Classic")
                          }
                        />
                        Classic
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          value="Rustic"
                          onChange={() =>
                            handleCheckboxChange(setModel, "Rustic")
                          }
                        />
                        Rustic
                      </label>
                    </div>
                  </div>
                </FormGroup>

                <FormGroup className="form__group">
                  <div>
                    <p className="mt-4">Interested Color:</p>
                    <div>
                      <label>
                        <input
                          type="checkbox"
                          value="Red"
                          onChange={() => handleCheckboxChange(setColor, "Red")}
                        />
                        Light
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          value="Blue"
                          onChange={() =>
                            handleCheckboxChange(setColor, "Blue")
                          }
                        />
                        Dark
                      </label>
                    </div>
                  </div>
                </FormGroup>

                <FormGroup className="form__group">
                  <div>
                    <p className="mt-4 ">Preferred Size:</p>
                    <div>
                      <label>
                        <input
                          type="checkbox"
                          value="Small"
                          onChange={() =>
                            handleCheckboxChange(setSize, "Small")
                          }
                        />
                        Small
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          value="Medium"
                          onChange={() =>
                            handleCheckboxChange(setSize, "Medium")
                          }
                        />
                        Medium
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          value="Large"
                          onChange={() =>
                            handleCheckboxChange(setSize, "Large")
                          }
                        />
                        Large
                      </label>
                    </div>
                  </div>
                </FormGroup>

                <button type="submit" className="buy__btn auth__btn">
                  Shopping Now
                </button>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
}

export default Survey;

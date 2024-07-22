import React from "react";
import { useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/authSlice";
import axios from "axios";

import "../styles/login.css";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setemail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://ece-project.adaptable.app/auth/login",
        {
          email,
          password,
        }
      );
      const data = response.data;
      const token = data.bearer;
      const isadmin = data.isAdmin;
      dispatch(login(token));
      toast.success("Logged in successfully");
      if (isadmin) {
        navigate("/admin/all-products");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Invalid email or password! Plaese try again!");
    }
  };

  return (
    <Helmet title={"Login"}>
      <section>
        <Container>
          <Row>
            <Col lg="6" className="m-auto text-center">
              <h3 className="fw-bold mb-4">Login</h3>

              <Form className="auth__form" onSubmit={handleSubmit}>
                <FormGroup className="form__group">
                  <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                  />
                </FormGroup>

                <FormGroup className="form__group">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your password"
                  />
                </FormGroup>

                <button type="submit" className="buy__btn auth__btn">
                  Login
                </button>
                <p>
                  Don't have account? <Link to="/signup">Create account</Link>
                </p>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Login;

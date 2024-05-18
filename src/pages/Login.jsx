import React from "react";
import { useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/slices/authSlice";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = { username };
    dispatch(login(user));
    navigate("/home");
  };

  return (
    <Helmet title={"Login"}>
      <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>

          <div>
            <button type="submit">Login</button>
            <button
              type="button"
              onClick={() => (window.location.href = "/signup")}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </Helmet>
  );
};

export default Login;

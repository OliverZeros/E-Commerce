import { Route, Routes, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import Checkout from "../pages/Checkout";
import Signup from "../pages/Signup";
import Survey from "../pages/Survey";
import Shop from "../pages/Shop";
import Profile from "../pages/Profile";
import ProductDetail from "../pages/ProductDetails";
import AdminMain from "../admin/page/AdminMain";
import AddProducts from "../admin/page/AddProducts";
import AllProducts from "../admin/page/AllProducts";
import Dashboard from "../admin/page/Dashboard.jsx";
import AllUsers from "../admin/page/AllUsers.jsx";
import AllReceipts from "../admin/page/AllReceipts.jsx";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="home" element={<Home />} />
      <Route path="cart" element={<Cart />} />
      <Route path="login" element={<Login />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="signup" element={<Signup />} />
      <Route path="survey" element={<Survey />} />
      <Route path="profile" element={<Profile />} />
      <Route path="shop" element={<Shop />} />
      <Route path="shop/:id" element={<ProductDetail />} />
      <Route path="admin" element={<AdminMain />}>
        <Route path="all-products" element={<AllProducts />} />
        <Route path="add-products" element={<AddProducts />} />
        <Route path="all-users" element={<AllUsers />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="all-receipts" element={<AllReceipts />} />
      </Route>
    </Routes>
  );
};

export default Routers;

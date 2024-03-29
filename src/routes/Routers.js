import { Route, Routes, Navigate } from 'react-router-dom'

import Home from '../pages/Home'
import Cart from '../pages/Cart'
import Login from '../pages/Login'
import Checkout from '../pages/Checkout'
import Signup from '../pages/Signup'
import Shop from '../pages/Shop'
import ProductDetail from '../pages/ProductDetails'

const Routers = () => {
    return (
        <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
            <Route path="home" element={<Home />} />
            <Route path="cart" element={<Cart />} />
            <Route path="login" element={<Login />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="signup" element={<Signup />} />
            <Route path="shop" element={<Shop />} />
            <Route path="shop/:id" element={<ProductDetail />} />
        </Routes>
    )
}

export default Routers

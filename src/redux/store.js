import { configureStore } from "@reduxjs/toolkit";

import cartSlice from "./slices/cartSlice";
import authReducer from "./slices/authSlice";
import productSlice from "./slices/productsSlice";
import wishlistSlice from "./slices/wishlistSlice";

const store = configureStore({
  reducer: {
    cart: cartSlice,
    auth: authReducer,
    products: productSlice,
    wishlist: wishlistSlice,
  },
});

export default store;

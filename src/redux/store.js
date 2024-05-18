import { configureStore } from "@reduxjs/toolkit";

import cartSlice from "./slices/cartSlice";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    cart: cartSlice,
    auth: authReducer,
  },
});

export default store;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setTotalQuantity: (state, action) => {
      state.totalQuantity = action.payload;
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice.reducer;

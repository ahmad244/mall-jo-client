import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    quantity: 0,
    total: 0,
  },
  reducers: {
    addProduct: (state, action) => {
      state.products.push(action.payload);
      state.total += action.payload.price * action.payload.quantity;
    },
    setQuantity: (state, action) => {
      state.quantity = action.payload;
    },
    reinitializeCart: (state) => {
      state.products = [];
      state.total = 0;
      state.quantity = 0;
    },
  },
});

export const { setQuantity, addProduct, reinitializeCart } = cartSlice.actions;
export default cartSlice.reducer;

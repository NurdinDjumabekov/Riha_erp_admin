import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeWorkShop: {},
  activeCategs: {},
};

const selectsSlice = createSlice({
  name: "selectsSlice",
  initialState,
  reducers: {
    setActiveWorkShop: (state, action) => {
      state.activeWorkShop = action.payload;
    },
    setActiveCategs: (state, action) => {
      state.activeCategs = action.payload;
    },
  },
});
export const { setActiveWorkShop, setActiveCategs } = selectsSlice.actions;

export default selectsSlice.reducer;

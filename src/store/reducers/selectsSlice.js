import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeWorkShop: {},
  activeCategs: {},
  activeTA: {},
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
    setActiveTA: (state, action) => {
      state.activeTA = action.payload;
    },
    clearSelects: (state, action) => {
      state.activeWorkShop = {};
      state.activeCategs = {};
      state.activeTA = {};
    },
  },
});
export const { setActiveWorkShop, setActiveCategs, setActiveTA, clearSelects } =
  selectsSlice.actions;

export default selectsSlice.reducer;

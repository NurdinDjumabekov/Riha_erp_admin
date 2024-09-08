import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  arbitrPred: 0,
};

const stateSlice = createSlice({
  name: "stateSlice",
  initialState,
  reducers: {
    changeArbitrPred: (state, action) => {
      state.arbitrPred = action?.payload;
    },
  },
});

export const { changeArbitrPred } = stateSlice.actions;

export default stateSlice.reducer;

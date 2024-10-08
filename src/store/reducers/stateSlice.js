import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stateLoad: true, /// всегда меняю его с true на false и наоборот (нужен для перезагрузки карт)
};

const stateSlice = createSlice({
  name: "stateSlice",
  initialState,
  reducers: {
    asdas: (state, action) => {
      state.stateLoad = action?.payload;
    },
  },
});

export const { asdas } = stateSlice.actions;

export default stateSlice.reducer;

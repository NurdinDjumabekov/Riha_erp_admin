import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  фывф: { latitude: "", longitude: "" },
};

const stateSlice = createSlice({
  name: "stateSlice",
  initialState,
  reducers: {
    фывыф: (state, action) => {
      state.фывф = action?.payload;
    },
  },
});

export const { фывыф } = stateSlice.actions;

export default stateSlice.reducer;

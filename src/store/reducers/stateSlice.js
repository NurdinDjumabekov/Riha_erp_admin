import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mapGeo: { latitude: "", longitude: "" },
};

const stateSlice = createSlice({
  name: "stateSlice",
  initialState,
  reducers: {
    setMapGeo: (state, action) => {
      state.mapGeo = action?.payload;
    },
  },
});

export const { setMapGeo } = stateSlice.actions;

export default stateSlice.reducer;

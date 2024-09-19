import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mapGeo: { latitude: "", longitude: "" },
  key: "4b360754-94b6-4399-9a7b-35811336eb5f",
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

// load().then((mapgl) => {
//   map = new mapgl.Map("map-container", {
//     center: [42.8508686, 74.5975735],
//     zoom: 13,
//     key: "4b360754-94b6-4399-9a7b-35811336eb5f",
//   });

//   const marker = new mapgl.Marker(map, {
//     coordinates: [42.8508686, 74.5975735],
//   });
// });

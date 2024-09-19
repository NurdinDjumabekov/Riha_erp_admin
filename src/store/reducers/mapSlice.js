import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setDataSave } from "./saveDataSlice";
import axios from "axios";
import { myAlert } from "../../helpers/MyAlert";
import axiosInstance from "../../axiosInstance";

const { REACT_APP_API_URL } = process.env;

const initialState = {
  mapGeo: { latitude: "", longitude: "" },
  key: "4b360754-94b6-4399-9a7b-35811336eb5f",
};

////// sendGeoUser - отправка геолокации пользователя(агента)
export const sendGeoUser = createAsyncThunk(
  "sendGeoUser",
  async function (props, { dispatch, rejectWithValue }) {
    const { guid, latitude, longitude } = props;
    const data = { agent_guid: guid, lat: latitude, lon: longitude };
    const url = `${REACT_APP_API_URL}/ta/add_gps`;
    try {
      const response = await axios.post(url, data);
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const mapSlice = createSlice({
  name: "mapSlice",
  initialState,
  reducers: {
    setMapGeo: (state, action) => {
      state.mapGeo = action?.payload;
    },
  },
});

export const { setMapGeo } = mapSlice.actions;

export default mapSlice.reducer;

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

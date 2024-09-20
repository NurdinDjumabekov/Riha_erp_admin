import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setDataSave } from "./saveDataSlice";
import axios from "axios";
import { myAlert } from "../../helpers/MyAlert";
import axiosInstance from "../../axiosInstance";
import { transformActionDate } from "../../helpers/transformDate";

const { REACT_APP_API_URL } = process.env;

const initialState = {
  mapGeo: { latitude: "", longitude: "" },
  key: "4b360754-94b6-4399-9a7b-35811336eb5f",
  dateRoute: transformActionDate(new Date()), /// для активной даты (выбор маршрутов)
  listPointsEveryTA: [], /// сипсок точек каждого агента
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

////// getPointsRouteAgent - get данных координат точек для каждого ТА
export const getPointsRouteAgent = createAsyncThunk(
  "getPointsRouteAgent",
  async function ({ guid }, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}ta/get_points?agent_guid=${guid}`;
    try {
      const response = await axios(url);
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

////// getDateRouteAgent - get данных координат каждого ТА
export const getDateRouteAgent = createAsyncThunk(
  "getDateRouteAgent",
  async function ({ guid }, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}ta/get_points?agent_guid=${guid}`;
    try {
      const response = await axios(url);
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
    setDateRoute: (state, action) => {
      state.dateRoute = action?.payload;
    },
    setListPointsEveryTA: (state, action) => {
      state.listPointsEveryTA = action?.payload;
    },
  },
  extraReducers: (builder) => {
    ////////////// getPointsRouteAgent
    builder.addCase(getPointsRouteAgent.fulfilled, (state, action) => {
      state.preloader = false;
      state.listPointsEveryTA = action.payload;
    });
    builder.addCase(getPointsRouteAgent.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getDateRouteAgent.pending, (state, action) => {
      state.preloader = true;
    });
  },
});

export const { setMapGeo, setDateRoute, setListPointsEveryTA } =
  mapSlice.actions;

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

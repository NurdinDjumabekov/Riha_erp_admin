import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setDataSave } from "./saveDataSlice";
import axios from "axios";
import { myAlert } from "../../helpers/MyAlert";
import axiosInstance from "../../axiosInstance";
import { transformActionDate } from "../../helpers/transformDate";
import { setActiveTTForPhoto } from "./photoSlice";

const { REACT_APP_API_URL } = process.env;

const initialState = {
  mapGeo: { latitude: "", longitude: "" },
  key: "4b360754-94b6-4399-9a7b-35811336eb5f",
  dateRoute: transformActionDate(new Date()), /// для активной даты (выбор маршрутов)
  listPointsEveryTA: [], /// сипсок точек каждого агента
  listRouteEveryTA: [], /// сипсок координат каждого агента
  listRouteAllTA: [], /// сипсок координат всех агентов
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
  async function ({ guid, first }, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_points?agent_guid=${guid}`;
    try {
      const response = await axios(url);
      if (response.status >= 200 && response.status < 300) {
        if (first) {
          const obj = {
            guid: response.data?.[0]?.guid,
            label: response.data?.[0]?.text,
            text: response.data?.[0]?.text,
            value: response.data?.[0]?.guid,
          };
          dispatch(setActiveTTForPhoto(obj));
        }
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
  async function ({ guid, date }, { dispatch, rejectWithValue }) {
    const dateNew = transformActionDate(date);
    const url = `${REACT_APP_API_URL}/ta/get_all_gps?agent_guid=${guid}&date_from=${dateNew}&date_to=${dateNew}`;
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

////// getAllRouteAgent - get данных координат всех ТА
export const getAllRouteAgent = createAsyncThunk(
  "getAllRouteAgent",
  async function (props, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_current_gps?agent_guid=0`;
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
    setListRouteEveryTA: (state, action) => {
      state.listRouteEveryTA = action?.payload;
    },

    setListRouteAllTA: (state, action) => {
      state.listRouteAllTA = action?.payload;
    },
  },

  extraReducers: (builder) => {
    ////////////// getPointsRouteAgent
    builder.addCase(getPointsRouteAgent.fulfilled, (state, action) => {
      state.preloader = false;
      state.listPointsEveryTA = action.payload?.map((i) => ({
        ...i,
        coordinates: [i?.coordinates[1], i?.coordinates[0]],
      }));
    });
    builder.addCase(getPointsRouteAgent.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getPointsRouteAgent.pending, (state, action) => {
      state.preloader = true;
    });

    ////////////// getDateRouteAgent
    builder.addCase(getDateRouteAgent.fulfilled, (state, action) => {
      state.preloader = false;
      const start =
        action.payload?.length > 0 ? action.payload?.[0] : undefined;
      const end =
        action.payload?.length > 0
          ? action.payload?.[action.payload.length - 1]
          : undefined;

      const listCords = action.payload?.map((i) => [i?.lon, i?.lat]);

      state.listRouteEveryTA = [
        {
          color: "#43e843",
          label: "A",
          coords: [[start?.lon, start?.lat]], // Пункт А (начало маршрута)
        },
        {
          color: "#43e843",
          label: "",
          coords: listCords,
        },
        {
          color: "#43e843",
          label: "B",
          coords: [[end?.lon, end?.lat]], // Пункт А (начало маршрута)
        },
      ];
    });
    builder.addCase(getDateRouteAgent.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getDateRouteAgent.pending, (state, action) => {
      state.preloader = true;
    });

    ////////////// getAllRouteAgent
    builder.addCase(getAllRouteAgent.fulfilled, (state, action) => {
      state.preloader = false;
      // state.listRouteAllTA = action.payload;
    });
    builder.addCase(getAllRouteAgent.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getAllRouteAgent.pending, (state, action) => {
      state.preloader = true;
    });
  },
});

export const {
  setMapGeo,
  setDateRoute,
  setListPointsEveryTA,
  setListRouteEveryTA,
  setListRouteAllTA,
} = mapSlice.actions;

export default mapSlice.reducer;

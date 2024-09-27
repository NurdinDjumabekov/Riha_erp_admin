import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { myAlert } from "../../helpers/MyAlert";
import axiosInstance from "../../axiosInstance";
import { transformActionDate } from "../../helpers/transformDate";

const { REACT_APP_API_URL } = process.env;

const initialState = {
  activeTTForPhoto: {}, /// delete
  activeDateForPhotos: transformActionDate(new Date()), /// delete
  listPhotos: [],
  activeRouteList: {}, /// активный маршрутный лист
};

////// sendPhotos - отправка фото торговой точки
export const sendPhotos = createAsyncThunk(
  "sendPhotos",
  async function ({ data }, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/add_file`;
    try {
      const response = await axios.post(url, data);
      if (response.status >= 200 && response.status < 300) {
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

////// getListPhotos - get список фотографий
export const getListPhotos = createAsyncThunk(
  "getListPhotos",
  async function (props, { dispatch, rejectWithValue }) {
    const { guid, guid_point } = props;

    const date = transformActionDate(new Date());
    const url = `${REACT_APP_API_URL}/ta/get_file?date=${date}&agent_guid=${guid}&point_guid=${guid_point}`;
    try {
      const response = await axios(url);
      if (response.status >= 200 && response.status < 300) {
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

////// getActiveRouteList - get активного маршрутного листа, который выдается каждому агенту
export const getActiveRouteList = createAsyncThunk(
  "getActiveRouteList",
  async function (agent_guid, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/agent_route_sheet?agent_guid=${agent_guid}`;
    try {
      const response = await axios(url);
      if (response.status >= 200 && response.status < 300) {
        return response?.data?.[0];
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

////// activeRouteListCRUD - изменение активного маршрутного листа, который выдается каждому агенту
export const activeRouteListCRUD = createAsyncThunk(
  "activeRouteListCRUD",
  async function ({ data, guid }, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/set_route_sheet`;
    try {
      const response = await axios.put(url, data);
      if (response.status >= 200 && response.status < 300) {
        dispatch(getActiveRouteList(guid));
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const photoSlice = createSlice({
  name: "photoSlice",
  initialState,
  reducers: {
    setActiveTTForPhoto: (state, action) => {
      state.activeTTForPhoto = action?.payload;
    },
    setActiveDateForPhotos: (state, action) => {
      state.activeDateForPhotos = action?.payload;
    },
    setActiveRouteList: (state, action) => {
      state.activeRouteList = action?.payload;
    },
  },

  extraReducers: (builder) => {
    ////////////// getListPhotos
    builder.addCase(getListPhotos.fulfilled, (state, action) => {
      state.preloader = false;
      state.listPhotos = action.payload;
    });
    builder.addCase(getListPhotos.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getListPhotos.pending, (state, action) => {
      state.preloader = true;
    });

    ////////////// getActiveRouteList
    builder.addCase(getActiveRouteList.fulfilled, (state, action) => {
      state.preloader = false;
      state.activeRouteList = action.payload;
    });
    builder.addCase(getActiveRouteList.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getActiveRouteList.pending, (state, action) => {
      state.preloader = true;
    });
  },
});

export const {
  setActiveTTForPhoto,
  setActiveDateForPhotos,
  setActiveRouteList,
} = photoSlice.actions;

export default photoSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const { REACT_APP_API_URL } = process.env;

const initialState = {
  activeTTForPhoto: {},
  listPhotos: [],
  activeRouteList: {}, /// активный маршрутный лист
};

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

const photoSlice = createSlice({
  name: "photoSlice",
  initialState,
  reducers: {
    setActiveTTForPhoto: (state, action) => {
      state.activeTTForPhoto = action?.payload;
    },

    setListPhotos: (state, action) => {
      state.listPhotos = [];
    },
  },

  extraReducers: (builder) => {
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

export const { setActiveTTForPhoto, setListPhotos } = photoSlice.actions;

export default photoSlice.reducer;

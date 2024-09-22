import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { myAlert } from "../../helpers/MyAlert";
import axiosInstance from "../../axiosInstance";
import { transformActionDate } from "../../helpers/transformDate";

const { REACT_APP_API_URL } = process.env;

const initialState = {
  activeTTForPhoto: {},
  activeDateForPhotos: transformActionDate(new Date()),
  listPhotos: [],
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
    const { activeDateForPhotos, guid, activeTTForPhoto } = props;
    const url = `${REACT_APP_API_URL}/ta/get_file?date=0&agent_guid=${guid}&point_guid=${activeTTForPhoto?.guid}`;
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
  },
});

export const { setActiveTTForPhoto, setActiveDateForPhotos } =
  photoSlice.actions;

export default photoSlice.reducer;

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

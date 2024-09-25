import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setDataSave } from "./saveDataSlice";
import axios from "axios";
import { myAlert } from "../../helpers/MyAlert";
import axiosInstance from "../../axiosInstance";
import { transformActionDate } from "../../helpers/transformDate";
import { setActiveTTForPhoto } from "./photoSlice";
import { clearRouteCRUD } from "../../helpers/clear";

const { REACT_APP_API_URL } = process.env;

/// actionType - 1 создание, 2 - редактирование, 3 - удаление

const initialState = {
  mapGeo: { latitude: "", longitude: "" },
  key: "4b360754-94b6-4399-9a7b-35811336eb5f",
  dateRoute: transformActionDate(new Date()), /// для активной даты (выбор маршрутов)
  listPointsEveryTA: [], /// сипсок точек каждого агента
  listRouteEveryTA: [], /// сипсок координат каждого агента
  listRouteAllTA: [], /// сипсок координат всех агентов
  listRoadRouteEveryTA: [], /// список маршрутов для обьезда каждого ТА
  crudRoute: {
    actionType: 0,
    number: 0,
    comment: "",
    is_active: 0,
    agent_select: {},
    route_sheet_guid: "",
  },
  roadRouteEveryTA: [], /// маршрут c точками для обьезда каждого ТА
  activeRoute: { guid: "" },
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

////// getListRoute - get данных координат для обьезда у каждого ТА
export const getListRoute = createAsyncThunk(
  "getListRoute",
  async function ({ agent_guid, first }, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_route_sheets?agent_guid=${agent_guid}`;
    try {
      const response = await axios(url);
      if (response.status >= 200 && response.status < 300) {
        if (first) {
          dispatch(getEveryRouteWithTT(response.data?.[0]?.guid));
          dispatch(setActiveRoute({ guid: response.data?.[0]?.guid })); /// активный маршрут для отображения
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

////// ListRouteCRUD - create, edit, del списка для данных координат обьезда у каждого ТА
export const ListRouteCRUD = createAsyncThunk(
  "ListRouteCRUD",
  async function (data, { dispatch, rejectWithValue }) {
    const { activeTA, actionType } = data;
    const objReq = { 1: "post", 2: "put", 3: "put", 4: "put" };
    const objurl = {
      1: "create_route_sheet",
      2: "update_route_sheet",
      3: "update_route_sheet",
    };
    const url = `${REACT_APP_API_URL}/ta/${objurl?.[actionType]}`;

    try {
      const response = await axiosInstance[objReq?.[actionType]](url, data);
      if (response.status >= 200 && response.status < 300) {
        if (response.data?.result == 1) {
          myAlert(response.data?.msg);
          dispatch(clearCrudRoute()); /// очищаю state для заркытия модалки
          dispatch(getListRoute({ agent_guid: activeTA?.value })); /// обновляю список маршрутов
        } else {
          myAlert(response.data?.msg, "error");
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

////// getEveryRouteWithTT - get данных координат для обьезда у каждого ТА c точками
export const getEveryRouteWithTT = createAsyncThunk(
  "getEveryRouteWithTT",
  async function (invoice_guid, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_route?route_sheet_guid=${invoice_guid}`;
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
    setCrudRoute: (state, action) => {
      state.crudRoute = action?.payload;
    },
    clearCrudRoute: (state, action) => {
      state.crudRoute = clearRouteCRUD;
    },
    setActiveRoute: (state, action) => {
      state.activeRoute = action?.payload;
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
      state.listRouteAllTA = action.payload;
    });
    builder.addCase(getAllRouteAgent.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getAllRouteAgent.pending, (state, action) => {
      state.preloader = true;
    });

    /////////////// getListRoute
    builder.addCase(getListRoute.fulfilled, (state, action) => {
      state.preloader = false;
      state.listRoadRouteEveryTA = action.payload;
    });
    builder.addCase(getListRoute.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getListRoute.pending, (state, action) => {
      state.preloader = true;
    });

    ////////////// getEveryRouteWithTT
    builder.addCase(getEveryRouteWithTT.fulfilled, (state, action) => {
      state.preloader = false;
      state.roadRouteEveryTA = action.payload;
    });
    builder.addCase(getEveryRouteWithTT.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getEveryRouteWithTT.pending, (state, action) => {
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
  setCrudRoute,
  clearCrudRoute,
  setActiveRoute,
} = mapSlice.actions;

export default mapSlice.reducer;

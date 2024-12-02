import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setDataSave } from "./saveDataSlice";
import axios from "axios";
import { myAlert } from "../../helpers/MyAlert";
import axiosInstance from "../../axiosInstance";
import {
  transformActionDate,
  transformDateTime,
} from "../../helpers/transformDate";
import { setActiveTTForPhoto } from "./photoSlice";
import {
  clearActiveMap,
  clearEveryListRoute,
  clearRoute,
} from "../../helpers/clear";
import { listHistory, pastGeoData } from "../../helpers/LocalData";

const { REACT_APP_API_URL, REACT_APP_MAP_KEY } = process.env;

/// actionType - 1 создание, 2 - редактирование, 3 - удаление

const initialState = {
  mapGeo: { latitude: "", longitude: "" },
  key: REACT_APP_MAP_KEY,

  //////////////////////////////////////// для админа
  dateRoute: transformActionDate(new Date()), /// для активной даты (выбор маршрутов)
  listPointsEveryTA: [], /// сипсок точек каждого агента
  listRouteEveryTA: [], /// сипсок координат каждого агента
  listRoadRouteEveryTA: [], /// список маршрутов для обьезда каждого ТА
  routeCRUD: {
    //// список дней маршрута (1-30)
    actionType: 0,
    number: 0,
    comment: "",
    is_active: 0,
    agent_select: {},
    route_sheet_guid: "",
  },
  roadRouteEveryTA: [], /// маршрут c точками для обьезда каждого ТА
  everyListRouteCRUD: {
    actionType: 0,
    route_guid: "",
    route_sheet_guid: "",
    point_guid: "",
    start_time: transformDateTime(new Date()),
    end_time: transformDateTime(new Date()),
    comment: "",
    ordering: 0,
    status: 0,
    seller_select: {},
  }, //// список маршрутов каждого дня
  activeRoute: { guid: "" },
  activeViewMap: { guid: "", lat: "", lon: "", actionType: 0, listRoute: [] },
  // 1 - просто выбор точки админом, 2 - выбор координат админом,
  // для откыртия и редактирования координат маршрутов

  //////////////////////////////////////// для агента
  //// check
  everyRoutes_TA: [], /// каждый маршрут для ТА (от первой точки до последней)
  listTA_RouteNoPlan: [], //// список коориднат по которым ехал Та(типо сам, не по плану)
};

////// getPointsRouteAgent - get данных координат точек для каждого ТА
export const getPointsRouteAgent = createAsyncThunk(
  "getPointsRouteAgent",
  async function ({ guid, first }, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_points?agent_guid=${guid}`;
    try {
      const response = await axiosInstance(url);
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
      const response = await axiosInstance(url);
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
      const response = await axiosInstance(url);
      if (response.status >= 200 && response.status < 300) {
        console.log("start");
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
      const response = await axiosInstance(url);
      if (response.status >= 200 && response.status < 300) {
        dispatch(getEveryRouteWithTT(response.data?.[0]?.guid));
        dispatch(setActiveRoute({ guid: response.data?.[0]?.guid })); /// активный маршрут для отображения
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
    const { activeTA, actionType, noneAlert } = data;
    const objReq = { 1: "post", 2: "put", 3: "put" };
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
          if (!noneAlert) {
            //// разрешаю выводить alert только в edit
            myAlert(response.data?.msg);
          }
          dispatch(clearRouteCRUD()); /// очищаю state для заркытия модалки
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
      const response = await axiosInstance(url);
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

////// getListRoutesForMap - get данных координат точек для карт (cпец-но два запроса сделал)
export const getListRoutesForMap = createAsyncThunk(
  "getListRoutesForMap",
  async function (invoice_guid, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_route?route_sheet_guid=${invoice_guid}`;
    try {
      const response = await axios(url);
      if (response.status >= 200 && response.status < 300) {
        return { listRoute: response.data, invoice_guid };
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

////// everyRouteCRUD - create, edit, del списка координат обьезда у каждого дня
export const everyRouteCRUD = createAsyncThunk(
  "ListRouteCRUD",
  async function (data, { dispatch, rejectWithValue }) {
    const { route_sheet_guid, actionType, noneAlert } = data;
    const objReq = { 1: "post", 2: "put", 3: "put" };
    const objurl = { 1: "create_route", 2: "update_route", 3: "update_route" };

    const url = `${REACT_APP_API_URL}/ta/${objurl?.[actionType]}`;

    try {
      const response = await axiosInstance[objReq?.[actionType]](url, data);
      if (response.status >= 200 && response.status < 300) {
        if (response.data?.result == 1) {
          if (!noneAlert) {
            //// разрешаю выводить alert только в edit
            myAlert(response.data?.msg);
          }
          dispatch(clearEveryListRouteCRUD()); /// очищаю state для заркытия модалки
          dispatch(getEveryRouteWithTT(route_sheet_guid)); /// обновляю список маршрутов для определенного дня
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

////// editCoordsPoint - обновление координат точек
export const editCoordsPoint = createAsyncThunk(
  "editCoordsPoint",
  async function (data, { dispatch, rejectWithValue }) {
    const { agent_guid } = data;
    const url = `${REACT_APP_API_URL}/ta/update_point`;
    try {
      const response = await axiosInstance.put(url, data);
      if (response.status >= 200 && response.status < 300) {
        dispatch(getListRoute({ agent_guid }));
        dispatch(setActiveViewMap(clearActiveMap));
        myAlert(`Координаты точки '${data?.point}' обновлены`);
        return response.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

////// getListRoutes_TA - get данных координат точек определенного агента (магаз продуктовый, магазин Улан...)
export const getListRoutes_TA = createAsyncThunk(
  "getListRoutes_TA",
  async function (props, { dispatch, rejectWithValue }) {
    const { agent_guid, user_type, activeDate } = props;
    const url = `${REACT_APP_API_URL}/ta/agent_route_sheet?agent_guid=${agent_guid}&date=${activeDate}`;
    try {
      const response = await axiosInstance(url);
      if (response.status >= 200 && response.status < 300) {
        const obj = { route_sheet_guid: response.data?.[0]?.guid, user_type };
        dispatch(getEveryRoutes_TA(obj));
        return response.data?.[0]?.listRouteTA;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

////// getEveryRoutes_TA - get данных каждой координаты точек для определенного ТА
export const getEveryRoutes_TA = createAsyncThunk(
  "getEveryRoutes_TA",
  async function (props, { dispatch, rejectWithValue }) {
    const { route_sheet_guid, user_type } = props;
    const url = `${REACT_APP_API_URL}/ta/agent_routes?route_sheet_guid=${route_sheet_guid}`;
    try {
      const response = await axiosInstance(url);
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
    setRouteCRUD: (state, action) => {
      state.routeCRUD = action?.payload;
    },

    clearRouteCRUD: (state, action) => {
      state.routeCRUD = clearRoute;
    },

    setActiveRoute: (state, action) => {
      state.activeRoute = action?.payload;
    },

    setEveryListRouteCRUD: (state, action) => {
      state.everyListRouteCRUD = action?.payload;
    },

    clearEveryListRouteCRUD: (state, action) => {
      state.everyListRouteCRUD = clearEveryListRoute;
    },

    setActiveViewMap: (state, action) => {
      state.activeViewMap = action?.payload;
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
      state.roadRouteEveryTA = [];
    });
    builder.addCase(getEveryRouteWithTT.pending, (state, action) => {
      state.preloader = true;
    });

    //////////////// getListRoutesForMap
    builder.addCase(getListRoutesForMap.fulfilled, (state, action) => {
      state.preloader = false;
      const nesList = action.payload?.listRoute?.filter(
        (item) => item?.status == 1
      );
      const obj = { ...state.activeViewMap, listRoute: nesList };
      const data = { guid: action.payload?.invoice_guid };
      state.activeViewMap = { ...obj, ...data, actionType: 2 };
    });
    builder.addCase(getListRoutesForMap.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      state.activeViewMap = [];
    });
    builder.addCase(getListRoutesForMap.pending, (state, action) => {
      state.preloader = true;
    });

    //////////////// getListRoutes_TA
    builder.addCase(getListRoutes_TA.fulfilled, (state, action) => {
      state.preloader = false;

      // Добавляем существующие данные из action.payload
      const list = action.payload?.map((item) => {
        return { ...item, lng: +item?.lon, lat: +item?.lat };
      });
      state.listTA_RouteNoPlan = list;
    });

    builder.addCase(getListRoutes_TA.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      state.listTA_RouteNoPlan = [];
    });
    builder.addCase(getListRoutes_TA.pending, (state, action) => {
      state.preloader = true;
    });

    //////////////// getEveryRoutes_TA
    builder.addCase(getEveryRoutes_TA.fulfilled, (state, action) => {
      state.everyRoutes_TA = action.payload
        // ?.slice(1, 10) // Исключаем объекты с пустыми `lon` или `lat`
        ?.filter((item) => item?.lon && item?.lat) // Исключаем объекты с пустыми `lon` или `lat`
        ?.map((item) => {
          return { ...item, lng: +item?.lon, lat: +item?.lat };
        });
      state.preloader = false;
    });

    builder.addCase(getEveryRoutes_TA.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      state.everyRoutes_TA = [];
    });
    builder.addCase(getEveryRoutes_TA.pending, (state, action) => {
      state.preloader = true;
    });
  },
});

export const {
  setRouteCRUD,
  clearRouteCRUD,
  setActiveRoute,
  setEveryListRouteCRUD,
  clearEveryListRouteCRUD,
  setActiveViewMap,
} = mapSlice.actions;

export default mapSlice.reducer;

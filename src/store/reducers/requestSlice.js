import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setDataSave } from "./saveDataSlice";
import axios from "axios";
import { myAlert } from "../../helpers/MyAlert";
import axiosInstance from "../../axiosInstance";
import { generateNowWeek } from "../../helpers/transformDate";
import { searchActiveOrdersTA } from "../../helpers/searchActiveOrdersTA";
import { createEventId } from "../../helpers/LocalData";
import { setActiveCategs, setActiveWorkShop } from "./selectsSlice";

const { REACT_APP_API_URL } = process.env;

const initialState = {
  listWorkshop: [],
  listCategs: [],
  listProds: [],
  listTA: [],
  listOrders: [],
  listSendOrders: [], //// временный список для хранения списка заказа ТА
};

////// logInAccount - логинизация
export const logInAccount = createAsyncThunk(
  "logInAccount",
  async function (props, { dispatch, rejectWithValue }) {
    const { navigate, data } = props;
    const url = `${REACT_APP_API_URL}/ta/login`;
    try {
      const response = await axios.post(url, data);
      if (response.status >= 200 && response.status < 300) {
        const { result, guid, fio, user_type } = response?.data;
        if (result == 1 && !!guid) {
          navigate("/main");
          dispatch(setDataSave({ guid, fio, user_type }));
        } else {
          myAlert("Неверный логин или пароль");
        }
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

////// getListWorkShop - get список цехов
export const getListWorkShop = createAsyncThunk(
  "getListWorkShop",
  async function (props, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_workshop`;
    try {
      const response = await axiosInstance(url);
      if (response.status >= 200 && response.status < 300) {
        const obj = response?.data?.[0];
        dispatch(getListCategs(obj)); /// для получение категорий

        const objSort = { value: obj?.guid, label: obj.name };
        dispatch(setActiveWorkShop({ ...obj, ...objSort }));
        ///// подставляю активныый селект в state
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

////// getListCategs - get список категорий
export const getListCategs = createAsyncThunk(
  "getListCategs",
  async function ({ guid }, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_category?workshop_guid=${guid}`;
    try {
      const response = await axiosInstance(url);
      if (response.status >= 200 && response.status < 300) {
        const obj = response?.data?.[0];
        dispatch(getListProds({ guid, guidCateg: obj?.category_guid }));
        /// для получение товаров

        const objSort = {
          value: obj?.category_guid,
          label: obj?.category_name,
        };
        dispatch(setActiveCategs({ ...obj, ...objSort }));
        ///// подставляю активный селект в state
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

////// getListProds - get список товаров
export const getListProds = createAsyncThunk(
  "getListProds",
  async function ({ guid, guidCateg }, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_product?category_guid=${guidCateg}&workshop_guid=${guid}`;
    try {
      const response = await axiosInstance(url);
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

////// getListTA - список Тоговых агентов
export const getListTA = createAsyncThunk(
  "getListTA",
  async function ({ first }, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_agent`;
    try {
      const response = await axiosInstance(url);
      if (response.status >= 200 && response.status < 300) {
        if (first) {
          const dates = generateNowWeek(); /// генерирую диапозон нынешней недели
          const agents_guid = searchActiveOrdersTA(response?.data);
          dispatch(getListOrders({ ...dates, agents_guid }));
        }
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

////// updateListTA - редактирование bool значения у Тоговых агентов
export const updateListTA = createAsyncThunk(
  "updateListTA",
  async function (data, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/edit_agent`;
    try {
      const response = await axiosInstance.post(url, data);
      if (response.status >= 200 && response.status < 300) {
        dispatch(getListTA());
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

////// getListOrders - список заказов
export const getListOrders = createAsyncThunk(
  "getListOrders",
  async function (props, { dispatch, rejectWithValue }) {
    const { agents_guid, date_from, date_to } = props;
    const url = `${REACT_APP_API_URL}/ta/get_applications`;
    const data = { agents_guid, date_from, date_to };
    try {
      const response = await axiosInstance.post(url, data);
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

////// addOrdersInList - добавление заказов в список
export const addOrdersInList = createAsyncThunk(
  "addOrdersInList",
  async function (data, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/create_application`;
    dispatch(addListOrders({ ...data, id: createEventId() }));
    console.log({ ...data, id: createEventId() });
    // try {
    //   const response = await axiosInstance.post(url, data);
    //   if (response.status >= 200 && response.status < 300) {
    //     return response?.data;
    //   } else {
    //     throw Error(`Error: ${response.status}`);
    //   }
    // } catch (error) {
    //   return rejectWithValue(error.message);
    // }
  }
);

const requestSlice = createSlice({
  name: "requestSlice",
  initialState,
  reducers: {
    editListAgents: (state, action) => {
      state.listTA = state.listTA?.map((item) =>
        item?.guid === action.payload ? { ...item, bool: !item?.bool } : item
      );
    },

    addListOrders: (state, action) => {
      state.listOrders = [...state.listOrders, { ...action.payload }];
    },

    ///// добавление во временный список для отправки создания заказа от ТА
    addDataOrders: (state, action) => {
      const newOrder = action.payload;

      const orderExists = state.listSendOrders?.some(
        (order) => order?.product_guid === newOrder?.product_guid
      );

      if (orderExists) {
        state.listSendOrders = state.listSendOrders.map((order) =>
          order?.product_guid === newOrder?.product_guid ? newOrder : order
        );
      } else {
        state.listSendOrders = [...state.listSendOrders, newOrder];
      }
    },

    ///// удаление с временного списока для отправки создания заказа от ТА
    delDataOrders: (state, action) => {
      const { product_guid } = action.payload;
      state.listSendOrders = state.listSendOrders?.filter(
        (i) => i?.product_guid !== product_guid
      );
    },

    ///// очищаю временный список для отправки создания заказа от ТА
    clearDataOrders: (state, action) => {
      state.listSendOrders = [];
    },
  },

  extraReducers: (builder) => {
    ////////////// logInAccount
    builder.addCase(logInAccount.fulfilled, (state, action) => {
      state.preloader = false;
    });
    builder.addCase(logInAccount.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
      myAlert("Неверный логин или пароль");
    });
    builder.addCase(logInAccount.pending, (state, action) => {
      state.preloader = true;
    });

    ////////////// getListWorkShop
    builder.addCase(getListWorkShop.fulfilled, (state, action) => {
      state.preloader = false;
      state.listWorkshop = action.payload?.map((i) => ({ ...i, bool: true }));
    });
    builder.addCase(getListWorkShop.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getListWorkShop.pending, (state, action) => {
      state.preloader = true;
    });

    //////////////  getListCategs
    builder.addCase(getListCategs.fulfilled, (state, action) => {
      state.preloader = false;
      state.listCategs = action.payload;
    });
    builder.addCase(getListCategs.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getListCategs.pending, (state, action) => {
      state.preloader = true;
    });

    ////////////// getListProds
    builder.addCase(getListProds.fulfilled, (state, action) => {
      state.preloader = false;
      state.listProds = action.payload?.map((i) => ({ ...i, count: 1 }));
    });
    builder.addCase(getListProds.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getListProds.pending, (state, action) => {
      state.preloader = true;
    });

    ////////////// getListTA
    builder.addCase(getListTA.fulfilled, (state, action) => {
      state.preloader = false;
      state.listTA = action.payload?.map((i) => ({ ...i, bool: true }));
    });
    builder.addCase(getListTA.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getListTA.pending, (state, action) => {
      state.preloader = true;
    });

    ////////////// getListOrders
    builder.addCase(getListOrders.fulfilled, (state, action) => {
      state.preloader = false;
      state.listOrders = action.payload;
    });
    builder.addCase(getListOrders.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getListOrders.pending, (state, action) => {
      state.preloader = true;
    });
  },
});
export const {
  editListAgents,
  addListOrders,
  addDataOrders,
  delDataOrders,
  clearDataOrders,
} = requestSlice.actions;

export default requestSlice.reducer;

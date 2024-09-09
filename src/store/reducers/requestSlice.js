import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setDataSave } from "./saveDataSlice";
import axios from "axios";
import { myAlert } from "../../helpers/MyAlert";
import axiosInstance from "../../axiosInstance";
import { searchActiveOrdersTA } from "../../helpers/searchActiveOrdersTA";
import { createEventId } from "../../helpers/LocalData";
import { setActiveCategs, setActiveWorkShop } from "./selectsSlice";
import { transformListsProds } from "../../helpers/transformLists";

const { REACT_APP_API_URL } = process.env;

const initialState = {
  listWorkshop: [],
  listCategs: [],
  listProds: [],
  listTA: [],
  listOrders: [],
  listSendOrders: [], //// временный список для хранения списка заказа ТА
  invoiceGuid: { guid: "", action: 0 }, /// guid заявки и действие 1 - создание, 2 - редактирование
  activeDate: { date_from: "", date_to: "" }, // Состояние для диапазона активной недели
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
          navigate("/");
          dispatch(setDataSave({ guid, fio, user_type }));
        } else {
          myAlert("Неверный логин или пароль", "error");
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
      const response = await axios(url);
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

////// searchListProds - поиск товара в списке товаров
export const searchListProds = createAsyncThunk(
  "searchListProds",
  async function (search, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_product?search=${search}`;

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
  async function ({ first, activeDate }, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_agent`;
    try {
      const response = await axiosInstance(url);
      if (response.status >= 200 && response.status < 300) {
        if (first) {
          const agents_guid = searchActiveOrdersTA(response?.data);
          dispatch(getListOrders({ ...activeDate, agents_guid }));
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

////// searchTA - поиск Тоговых агентов
export const searchTA = createAsyncThunk(
  "searchTA",
  async function (search, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_agent?search=${search}`;
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

////// getListProdsInInvoice - список товаров определённого заказа
export const getListProdsInInvoice = createAsyncThunk(
  "getListProdsInInvoice",
  async function (guid, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_application?invoice_guid=${guid}`;
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

////// createInvoice - создание заявок ( action: 1)
export const createInvoice = createAsyncThunk(
  "createInvoice",
  async function (data, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/create_application`;
    try {
      const response = await axiosInstance.post(url, data);
      if (response.status >= 200 && response.status < 300) {
        const guid = response?.data?.invoice_guid;
        dispatch(setInvoiceGuid({ guid, action: 1 }));
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// "date_from": "2024-09-09 18:00",
// "date_to": "2024-09-09 18:30",
// "comment": "asdasdasasdas",

// start,
// title: "asdasdas",
// allDay: false, /// для всего дня
// color: generateColor(),
// status: 1,
// total_price: "1000",
// agent: "Джумабеков Нурдин",

////// createProdInInvoice - добавление и редактирование товаров в заявоки
export const createProdInInvoice = createAsyncThunk(
  "createProdInInvoice",
  async function (props, { dispatch, rejectWithValue }) {
    const { forGetInvoice, forCreate, invoiceGuid } = props;

    const { listSendOrders, comment } = forCreate;
    const { activeDate, listTA } = forGetInvoice;
    const { action, guid } = invoiceGuid;

    const urlCreate = `${REACT_APP_API_URL}/ta/create_application_product`;
    const urlEdit = `${REACT_APP_API_URL}/ta/create_application_product`;

    const objUrl = { 1: urlCreate, 2: urlEdit }; /// 1 - создание, 2 - редактирование

    const obj = { invoice_guid: guid, comment };
    const data = { ...obj, products: transformListsProds(listSendOrders) };

    try {
      const response = await axiosInstance.post(objUrl?.[action], data);
      if (response.status >= 200 && response.status < 300) {
        dispatch(setInvoiceGuid({ guid: "", action: 0 })); //// для закрытия модалки добавления
        myAlert("Заявка успешно создана!");
        ///// для get обновленныхз данных с добавленной заявкой
        const agents_guid = searchActiveOrdersTA(listTA);
        dispatch(getListOrders({ ...activeDate, agents_guid }));
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const requestSlice = createSlice({
  name: "requestSlice",
  initialState,
  reducers: {
    editListAgents: (state, action) => {
      state.listTA = state.listTA?.map((item) =>
        item?.guid === action.payload
          ? { ...item, is_checked: item?.is_checked === 1 ? 0 : 1 }
          : item
      );
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
    clearListOrders: (state, action) => {
      state.listSendOrders = [];
    },

    /////изменение ключа count в списке товаров
    changeCountListProds: (state, action) => {
      const { product_guid, count } = action.payload;
      state.listProds = state.listProds?.map((i) =>
        i?.product_guid === product_guid ? { ...i, count } : i
      );
    },

    /////изменение ключа count в списке товаров временной корзины
    changeCountOrders: (state, action) => {
      const { product_guid, count } = action.payload;
      state.listSendOrders = state.listSendOrders?.map((i) =>
        i?.product_guid === product_guid ? { ...i, count } : i
      );
    },

    setInvoiceGuid: (state, action) => {
      state.invoiceGuid = action.payload;
    },

    //// меняется активная дата для отображения и сортировки данных
    setActiveDate: (state, action) => {
      state.activeDate = action.payload;
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

    ////////////// searchListProds
    builder.addCase(searchListProds.fulfilled, (state, action) => {
      state.preloader = false;
      state.listProds = action.payload?.map((i) => ({ ...i, count: 1 }));
    });
    builder.addCase(searchListProds.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(searchListProds.pending, (state, action) => {
      state.preloader = true;
    });

    ////////////// getListTA
    builder.addCase(getListTA.fulfilled, (state, action) => {
      state.preloader = false;
      state.listTA = action.payload;
    });
    builder.addCase(getListTA.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getListTA.pending, (state, action) => {
      state.preloader = true;
    });

    ////////////// searchTA
    builder.addCase(searchTA.fulfilled, (state, action) => {
      state.preloader = false;
      state.listTA = action.payload;
    });
    builder.addCase(searchTA.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(searchTA.pending, (state, action) => {
      state.preloader = true;
    });

    ////////////// getListOrders
    builder.addCase(getListOrders.fulfilled, (state, action) => {
      state.preloader = false;
      state.listOrders = action.payload?.map((i) => {
        return { ...i, allDay: false, start: i?.date_from };
      });
    });
    builder.addCase(getListOrders.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getListOrders.pending, (state, action) => {
      state.preloader = true;
    });

    ///////////// getListProdsInInvoice
    builder.addCase(getListProdsInInvoice.fulfilled, (state, action) => {
      state.preloader = false;
      state.listSendOrders = action.payload;
      // ?.map((i) => {
      //   return { ...i, allDay: false, start: i?.date_from };
      // });
    });
    builder.addCase(getListProdsInInvoice.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getListProdsInInvoice.pending, (state, action) => {
      state.preloader = true;
    });
  },
});
export const {
  editListAgents,
  addDataOrders,
  delDataOrders,
  clearListOrders,
  changeCountListProds,
  changeCountOrders,
  setInvoiceGuid,
  setActiveDate,
} = requestSlice.actions;

export default requestSlice.reducer;

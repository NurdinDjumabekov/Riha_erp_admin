import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { myAlert } from "../../helpers/MyAlert";
import axiosInstance from "../../axiosInstance";
import { setActiveCategs, setActiveWorkShop } from "./selectsSlice";
import { setInvoiceInfo } from "./mainSlice";

const { REACT_APP_API_URL } = process.env;

/////// WH - Ware House (склад)

const initialState = {
  listWorkshopWH: [],
  listCategsWH: [],
  allProdsWH: [],
  listWHProdTA: [],
  listTA: [],
  invoiceGuid: "", /// guid накладной отпуска для ТА
  listHistoryInvoice: [],

  //////////////////////
  listOrdersTA: [], //// список заказов ТА
  activeSort: 1, //// для сортировки заказов агентов
  activeOrder: {}, //// для активного заказа агентов
  listProdsEveryOrder: [], //// список товаров каждого заказа для отпуска
};

////// getListOrdersWH_Req - список заказов от ТА для отпуска
export const getListOrdersWH_Req = createAsyncThunk(
  "getListOrdersWH_Req",
  async function (codeid, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_otpusk_agent?sort=${codeid}`;
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

////// getEveryOrderTA - get guid накладной и список товаров отпределенного ТА для отпуска товара
export const getEveryOrderTA = createAsyncThunk(
  "getEveryOrderTA",
  async function (agent_guid, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_otpusk_invoice?agent_guid=${agent_guid}`;
    try {
      const response = await axiosInstance(url);
      if (response.status >= 200 && response.status < 300) {
        return response?.data?.products;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//// addProdInInvoiceReq - добавление товара в накланую отпуска для ТА
export const addProdInInvoiceReq = createAsyncThunk(
  "addProdInInvoiceReq",
  async function (data, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/create_invoice_product`;
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

////////////////////////////////////////////////////////

//// getListWorkShopWH - get список цехов
export const getListWorkShopWH = createAsyncThunk(
  "getListWorkShopWH",
  async function (props, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_workshop?all=1`;
    try {
      const response = await axiosInstance(url);
      if (response.status >= 200 && response.status < 300) {
        const obj = response?.data?.[0];
        dispatch(getListCategsWH(obj)); /// для получение категорий

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

////// getListCategsWH - get список категорий
export const getListCategsWH = createAsyncThunk(
  "getListCategsWH",
  async function ({ guid }, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_category?workshop_guid=${guid}&all=1`;
    try {
      const response = await axiosInstance(url);
      if (response.status >= 200 && response.status < 300) {
        const obj = response?.data?.[0];
        dispatch(getListProdsWH({ guid, guidCateg: obj?.category_guid }));
        /// для получения товаров
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

////// getListProdsWH - get список товаров со склада
export const getListProdsWH = createAsyncThunk(
  "getListProdsWH",
  async function ({ guid, guidCateg }, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_sklad?category_guid=${guidCateg}&workshop_guid=${guid}`;
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

//// editDeleteProdInInvoiceTA - добавление и удаление товара в накланую отпуска для ТА
export const editProdInInvoiceTA = createAsyncThunk(
  "editProdInInvoiceTA",
  async function (props, { dispatch, rejectWithValue }) {
    const { data, activeTA, obj } = props;
    const url = `${REACT_APP_API_URL}/ta/update_application_product`;
    try {
      const response = await axiosInstance.put(url, data);
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

////// getEveryInvoiceTA - get каждую накладную торгового агента
export const getEveryInvoiceTA = createAsyncThunk(
  "getEveryInvoiceTA",
  async function (props, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_otpusk_agent`;
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

////// sendInvoiceTAsale - отправка накладной торговому агенту
export const sendInvoiceTAsale = createAsyncThunk(
  "sendInvoiceTAsale",
  async function ({ data }, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/update_invoice`;
    try {
      const response = await axiosInstance.put(url, data);
      if (response.status >= 200 && response.status < 300) {
        myAlert("Накладная отправлена торговому агенту");
        dispatch(setInvoiceInfo({ guid: "", action: 0, listInvoice: [] }));
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

////// getHistoryInvoice - get историю отпущенный накладных
export const getHistoryInvoice = createAsyncThunk(
  "getHistoryInvoice",
  async function (props, { dispatch, rejectWithValue }) {
    const { activeDate, agent_guid } = props;
    const url = `${REACT_APP_API_URL}/ta/get_invoices?reciever_type=1&date=${activeDate}&reciever_guid=${agent_guid}`;
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

const wareHouseSlice = createSlice({
  name: "wareHouseSlice",
  initialState,
  reducers: {
    clearAllWareHome: (state, action) => {
      state.listWorkshopWH = [];
      state.listCategsWH = [];
      state.allProdsWH = [];
      state.listWHProdTA = [];
      state.listTA = [];
    },

    clearListWHProdTA: (state, action) => {
      state.listWHProdTA = action.payload;
    },

    setInvoiceGuid: (state, action) => {
      state.invoiceGuid = action.payload;
    },

    /////изменение ключа count в списке товаров CГП
    changeCountAllListWH: (state, action) => {
      const { product_guid, count } = action.payload;
      state.allProdsWH = state.allProdsWH?.map((i) =>
        i?.product_guid === product_guid ? { ...i, count } : i
      );
    },

    /////изменение ключа count в списке товаров CГП
    changeCountListInvoiceTA: (state, action) => {
      const { product_guid, count } = action.payload;
      state.listWHProdTA = state.listWHProdTA?.map((i) =>
        i?.product_guid === product_guid ? { ...i, count } : i
      );
    },

    setAllProdsWH: (state, action) => {
      state.allProdsWH = action.payload;
    },

    /////////////////////////////////////
    activeSortFN: (state, action) => {
      state.activeSort = action.payload;
    },

    activeOrderFN: (state, action) => {
      state.activeOrder = action.payload;
    },
  },

  extraReducers: (builder) => {
    ////////////// getListOrdersWH_Req
    builder.addCase(getListOrdersWH_Req.fulfilled, (state, action) => {
      state.preloader = false;
      state.listOrdersTA = action.payload;
    });
    builder.addCase(getListOrdersWH_Req.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getListOrdersWH_Req.pending, (state, action) => {
      state.preloader = true;
    });

    /////////////// getEveryOrderTA
    builder.addCase(getEveryOrderTA.fulfilled, (state, action) => {
      state.preloader = false;
      state.listProdsEveryOrder = action.payload;
    });
    builder.addCase(getEveryOrderTA.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getEveryOrderTA.pending, (state, action) => {
      state.preloader = true;
    });

    ////////////// getListWorkShopWH
    builder.addCase(getListWorkShopWH.fulfilled, (state, action) => {
      state.preloader = false;
      state.listWorkshopWH = action.payload;
    });
    builder.addCase(getListWorkShopWH.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getListWorkShopWH.pending, (state, action) => {
      state.preloader = true;
    });

    //////////////  getListCategsWH
    builder.addCase(getListCategsWH.fulfilled, (state, action) => {
      state.preloader = false;
      state.listCategsWH = action.payload;
    });
    builder.addCase(getListCategsWH.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getListCategsWH.pending, (state, action) => {
      state.preloader = true;
    });

    ////////////// getListProdsWH
    builder.addCase(getListProdsWH.fulfilled, (state, action) => {
      state.preloader = false;
      state.allProdsWH = action.payload?.map((i) => ({
        ...i,
        countOld: i?.amount,
        count: i?.amount,
        is_checked: false,
      }));
    });
    builder.addCase(getListProdsWH.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getListProdsWH.pending, (state, action) => {
      state.preloader = true;
    });

    ///////////////// getHistoryInvoice
    builder.addCase(getHistoryInvoice.fulfilled, (state, action) => {
      state.preloader = false;
      state.listHistoryInvoice = action.payload;
    });
    builder.addCase(getHistoryInvoice.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(getHistoryInvoice.pending, (state, action) => {
      state.preloader = true;
    });
  },
});
export const {
  activeSortFN,
  activeOrderFN,
  clearAllWareHome,
  clearListWHProdTA,
  setInvoiceGuid,
  changeCountAllListWH,
  changeCountListInvoiceTA,
  setAllProdsWH,
} = wareHouseSlice.actions;

export default wareHouseSlice.reducer;

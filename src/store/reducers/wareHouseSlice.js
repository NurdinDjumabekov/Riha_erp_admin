import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { myAlert } from "../../helpers/MyAlert";
import axiosInstance from "../../axiosInstance";
import { setActiveCategs, setActiveWorkShop } from "./selectsSlice";
import { setInvoiceInfo } from "./mainSlice";

const { REACT_APP_API_URL } = process.env;

/////// WH - Ware House (склад)

const initialState = {
  //////////////////////
  listOrdersTA: [], //// список заказов ТА
  activeSort: 1, //// для сортировки заказов агентов
  activeOrder: {}, //// для активного заказа агентов
  listProdsEveryOrder: {}, //// список товаров каждого заказа для отпуска
  listProdsWH: [], //// список товаров при поиске на складе
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
        return response?.data;
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

//// searchProdsWH_Req - добавление товара в накланую отпуска для ТА
export const searchProdsWH_Req = createAsyncThunk(
  "searchProdsWH_Req",
  async function (search, { dispatch, rejectWithValue }) {
    const searchUrl = !!search ? `?search=${search}` : "";
    const url = `${REACT_APP_API_URL}/ta/get_product${searchUrl}`;
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

//// editStatusOrders - изменение статуса заказов для отпуска ТА
export const editStatusOrders = createAsyncThunk(
  "editStatusOrders",
  async function (data, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/application_status`;
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

const wareHouseSlice = createSlice({
  name: "wareHouseSlice",
  initialState,
  reducers: {
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

    //////////////// searchProdsWH_Req
    builder.addCase(searchProdsWH_Req.fulfilled, (state, action) => {
      state.preloader = false;
      state.listProdsWH = action.payload;
    });
    builder.addCase(searchProdsWH_Req.rejected, (state, action) => {
      state.error = action.payload;
      state.preloader = false;
    });
    builder.addCase(searchProdsWH_Req.pending, (state, action) => {
      state.preloader = true;
    });
  },
});
export const { activeSortFN, activeOrderFN } = wareHouseSlice.actions;

export default wareHouseSlice.reducer;

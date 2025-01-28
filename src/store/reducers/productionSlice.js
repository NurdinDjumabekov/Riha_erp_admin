import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { myAlert } from "../../helpers/MyAlert";
import axiosInstance from "../../axiosInstance";
import { getListOrders } from "./mainSlice";
import { searchActiveOrdersTA } from "../../helpers/searchActiveOrdersTA";
import { transformActionDate } from "../../helpers/transformDate";

const { REACT_APP_API_URL } = process.env;

const initialState = {
  preloaderPR: false,
  listProductionInvoice: [], /// список накладных производства
  listProductionProds: [], /// список товаров в производства
  listLeftoversProduction: [], /// список остатков производствa
};

////// getListInvoiceProduction - get список накладных производства
export const getListInvoiceProduction = createAsyncThunk(
  "getListInvoiceProduction",
  async function (props, { dispatch, rejectWithValue }) {
    const { date_from, setActiveInvoice } = props;
    const date = date_from || "";
    const url = `${REACT_APP_API_URL}/ta/get_production_invoice?date_from=${date}`;
    try {
      const response = await axiosInstance(url);
      if (response.status >= 200 && response.status < 300) {
        setActiveInvoice(response?.data?.[0]);
        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

////// getListProdsProduction - get список товаров производства
export const getListProdsProduction = createAsyncThunk(
  "getListProdsProduction",
  async function (props, { dispatch, rejectWithValue }) {
    const { invoice_guid } = props;
    const url = `${REACT_APP_API_URL}/ta/get_production_products?invoice_guid=${invoice_guid}`;
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

////// sendInWareHomeFN - отправка товаров на склад
export const sendInWareHomeFN = createAsyncThunk(
  "sendInWareHomeFN",
  async function (props, { dispatch, rejectWithValue }) {
    const { data, listTA, activeDate, setActiveInvoice } = props;
    const url = `${REACT_APP_API_URL}/ta/update_production_invoice`;
    try {
      const response = await axiosInstance.put(url, data);
      if (response.status >= 200 && response.status < 300) {
        myAlert("Список товаров отправлен на склад");
        const obj = { date_from: "", date_to: "", setActiveInvoice };
        dispatch(getListInvoiceProduction(obj));
        //// для обновление списка товаров произ-ва

        const agents_guid = searchActiveOrdersTA(listTA);
        dispatch(getListOrders({ ...activeDate, agents_guid }));
        /// обновление данных календаря

        return response?.data;
      } else {
        throw Error(`Error: ${response.status}`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

////// getListLeftoversProduction - get список остатков товарова производства
export const getListLeftoversProduction = createAsyncThunk(
  "getListLeftoversProduction",
  async function (props, { dispatch, rejectWithValue }) {
    const {} = props;
    const url = `${REACT_APP_API_URL}/ta/+++++++++`;
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

////// addListLeftoversInProduction - добавить список остатков товарова в накладную производства
export const addListLeftoversInProduction = createAsyncThunk(
  "addListLeftoversInProduction",
  async function (props, { dispatch, rejectWithValue }) {
    const {} = props;
    const url = `${REACT_APP_API_URL}/ta/+++++++++`;
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

const productionSlice = createSlice({
  name: "productionSlice",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    ////////////// getListInvoiceProduction
    builder.addCase(getListInvoiceProduction.fulfilled, (state, action) => {
      state.preloaderPR = false;
      state.listProductionInvoice = action.payload;
    });
    builder.addCase(getListInvoiceProduction.rejected, (state, action) => {
      state.error = action.payload;
      state.listProductionInvoice = [];
      state.preloaderPR = false;
    });
    builder.addCase(getListInvoiceProduction.pending, (state, action) => {
      state.preloaderPR = true;
    });

    ////////////// getListProdsProduction
    builder.addCase(getListProdsProduction.fulfilled, (state, action) => {
      state.preloaderPR = false;
      state.listProductionProds = action.payload;
    });
    builder.addCase(getListProdsProduction.rejected, (state, action) => {
      state.error = action.payload;
      state.listProductionProds = [];
      state.preloaderPR = false;
    });
    builder.addCase(getListProdsProduction.pending, (state, action) => {
      state.preloaderPR = true;
    });

    ///////////// getListLeftoversProduction
    builder.addCase(getListLeftoversProduction.fulfilled, (state, action) => {
      state.preloaderPR = false;
      state.listLeftoversProduction = action.payload;
    });
    builder.addCase(getListLeftoversProduction.rejected, (state, action) => {
      state.error = action.payload;
      state.preloaderPR = false;
    });
    builder.addCase(getListLeftoversProduction.pending, (state, action) => {
      state.preloaderPR = true;
    });
  },
});

export const {} = productionSlice.actions;

export default productionSlice.reducer;

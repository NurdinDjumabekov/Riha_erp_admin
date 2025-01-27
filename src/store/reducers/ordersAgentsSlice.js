import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { myAlert } from "../../helpers/MyAlert";
import axiosInstance from "../../axiosInstance";
import {
  generateNowWeek,
  transformActionDate,
} from "../../helpers/transformDate";

const { REACT_APP_API_URL } = process.env;

const initialState = {
  preloaderOrdersTa: false,
  activeDate: { ...generateNowWeek() },
  listTA: [], /// список агентов
  listOrders: [], //// список заказов на каждый час
  listTitleOrders: [], //// список итоговых заказов на целый день
};

////// getListTA - список Тоговых агентов
export const getListTA = createAsyncThunk(
  "getListTA",
  async function (props, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_agent`;
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
  async function (data, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_applications`;
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

////// getListTitleOrders - список заголовков заказа
export const getListTitleOrders = createAsyncThunk(
  "getListTitleOrders",
  async function (data, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/get_application_ingredient`;
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

////// getEveryDataDay - get список данных целого дня (продукты и ингредиенты)
export const getEveryDataDay = createAsyncThunk(
  "getEveryDataDay",
  async function (props, { dispatch, rejectWithValue }) {
    const { agents_guid, date_from, date_to } = props;
    const url = `${REACT_APP_API_URL}/ta/get_application_titles`;
    const data = { agents_guid, date_from, date_to };
    try {
      const response = await axiosInstance.post(url, data);
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

const ordersAgentsSlice = createSlice({
  name: "ordersAgentsSlice",
  initialState,
  reducers: {
    setDebtEveryTA: (state, action) => {
      state.debtEveryTA = action?.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { setDebtEveryTA } = ordersAgentsSlice.actions;

export default ordersAgentsSlice.reducer;
/// на будущее

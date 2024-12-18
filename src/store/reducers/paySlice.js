import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { myAlert } from "../../helpers/MyAlert";
import { getListTA } from "./mainSlice";
import axiosInstance from "../../axiosInstance";

const { REACT_APP_API_URL } = process.env;

const initialState = {
  debtEveryTA: { vozvrat: [], dolg: [] }, /// долг каждого агента
};

////// getEveryDebtReq - get список долгов каждого ТА
export const getEveryDebtReq = createAsyncThunk(
  "getEveryDebtReq",
  async function ({ agent_guid }, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/account?agent_guid=${agent_guid}`;
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

////// payTA - оплата ТА
export const payTA = createAsyncThunk(
  "payTA",
  async function (data, { dispatch, rejectWithValue }) {
    const url = `${REACT_APP_API_URL}/ta/add_oplata`;
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

const paySlice = createSlice({
  name: "paySlice",
  initialState,
  reducers: {
    setDebtEveryTA: (state, action) => {
      state.debtEveryTA = action?.payload;
    },
  },
  extraReducers: (builder) => {
    ////////////// getEveryDebtReq
    builder.addCase(getEveryDebtReq.fulfilled, (state, action) => {
      // state.preloader = false;
      state.debtEveryTA = action.payload;
    });
    builder.addCase(getEveryDebtReq.rejected, (state, action) => {
      state.error = action.payload;
      // state.preloader = false;
      state.debtEveryTA = [];
    });
    builder.addCase(getEveryDebtReq.pending, (state, action) => {
      // state.preloader = true;
    });
  },
});

export const { setDebtEveryTA } = paySlice.actions;

export default paySlice.reducer;
